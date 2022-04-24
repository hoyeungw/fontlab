import { parsePath }                                 from '@acq/path'
import { CrosTab }                                   from '@analys/crostab'
import { round }                                     from '@aryth/math'
import { ros, says }                                 from '@spare/logger'
import { mapToObject }                               from '@vect/object-init'
import { iterate, iterateEntries, mapper }           from '@vect/object-mapper'
import { firstKey, selectObject }                    from '@vect/object-select'
import { init }                                      from '@vect/vector-init'
import { merge }                                     from '@vect/vector-merge'
import { promises }                                  from 'fs'
import { ALPHABETS_LOWER, ALPHABETS_UPPER, FONTLAB } from '../asset'
import { EXCLUSION_UPPER }                           from '../asset/GLYPH_NAMES'
import { shortenWeight }                             from '../util/shortenWeight'
import { stringAscending }                           from '../util/stringAscending'
import { DEFAULT_OPTIONS, vfmToJson }                from './convert/kerningToVFM'
import { GL }                                        from './GL'
import { Kerning }                                   from './Kerning'
import { Metrics }                                   from './Metrics'

const LAYERS_PRIORITY = ['Regular', 'Roman', 'Medium', 'Semi Bold', 'Semi', 'Demi', 'Light']

export class VFM {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Kerning>} */
  layerToKerning // LayersToKerning
  /** @type {Object<string,Object<string,Metrics>>} */
  glyphLayerToMetrics // GlyphsToLayersToMetrics
  upm

  /**
   * @param {FontlabJson} vfm
   */
  constructor(vfm) {
    this.dataType = vfm.dataType
    vfm.dataType  |> says[FONTLAB]
    if (vfm.masters) this.layerToKerning = mapper(vfm.masters, Kerning.build)
    if (vfm.metrics) this.glyphLayerToMetrics = mapper(vfm.metrics, glyphsToMetrics => mapper(glyphsToMetrics.layers, Metrics.build))
    this.upm = vfm.upm
  }
  static build(fontlabJson) { return new VFM(fontlabJson) }
  static async fromFile(filePath) {
    says[FONTLAB](`loading ${ros(filePath)}`)
    const buffer = await promises.readFile(filePath, 'utf8')
    says[FONTLAB](`loaded ${ros(filePath)}`)
    const fontlabJson = await JSON.parse(buffer.toString())
    return VFM.build(fontlabJson)
  }
  async save(file, { kerningClasses, pairs, metrics, suffix } = DEFAULT_OPTIONS) {
    const { dir, base, ext } = parsePath(file)
    if ((!kerningClasses || !pairs || !metrics) && !suffix) {
      suffix = kerningClasses && !pairs ? 'Classes' : !kerningClasses && pairs ? 'Pairs' : kerningClasses && pairs ? 'Masters' : ''
      if (metrics) suffix += 'Metrics'
    }
    const target = dir + '/' + base + suffix + ext
    const json = JSON.stringify(this.toVFM({ kerningClasses, pairs, metrics }))
    await promises.writeFile(target, json)
  }

  get layers() { return Object.keys(this.layerToKerning) }
  get defaultLayer() {
    for (let layer in LAYERS_PRIORITY) if (layer in this.layerToKerning) return layer
    return firstKey(this.layerToKerning)
  }

  toVFM(options = DEFAULT_OPTIONS) { return vfmToJson(this, options) }

  /** @returns {KerningClass[]} */
  kerningClasses(layer = this.defaultLayer) { return this.layerToKerning[layer].kerningClasses }
  metrics(layer = this.defaultLayer) { return mapper(this.glyphLayerToMetrics, layerToMetrics => layerToMetrics[layer]) }
  alphabetGroups() {

    function exclude(glyph) {
      if (EXCLUSION_UPPER.includes(glyph)) return true
    } // Eng for N, Eth for D
    const alphabets = merge(ALPHABETS_UPPER, ALPHABETS_LOWER)
    const o = mapToObject(alphabets, () => [])
    Object.keys(this.glyphLayerToMetrics)
      .sort(stringAscending)
      .forEach((glyph) => {
        if (GL.isUpper(glyph)) o[glyph[0]].push(glyph)
        if (GL.isLower(glyph)) o[glyph[0]].push(glyph)
      })
    iterate(o, vec => vec.sort(stringAscending))
    return o
  }
  alphabetsByLayers(alphabets = ALPHABETS_UPPER) {
    const { layers } = this, glyphLayerToMetrics = selectObject(this.glyphLayerToMetrics, alphabets)
    const crostab = CrosTab.from({
      side: alphabets.slice(),
      head: init(layers.length * 2, (i) => !(i % 2) ? layers[i / 2] + '.L' : layers[(i - 1) / 2] + '.R'),
      title: 'metrics',
    })
    iterateEntries(glyphLayerToMetrics, ([glyph, layerToMetrics]) => {
      iterateEntries(layerToMetrics, ([layer, metrics]) => {
        crostab.setCell(glyph, layer + '.L', round(metrics.lsb))
        crostab.setCell(glyph, layer + '.R', round(metrics.rsb))
      })
    })
    return crostab.mutateBanner(shortenWeight)
  }
}