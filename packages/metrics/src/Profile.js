import { parsePath }                                             from '@acq/path'
import { CrosTab }                                               from '@analys/crostab'
import { round }                                                 from '@aryth/math'
import { ALPHABET_UPPER, Latin, shortenWeight, stringAscending } from '@fontlab/latin'
// import { ros, says }                                                             from '@spare/logger'
import { indexedIterate }                                        from '@vect/nested'
import { iterate, mapper }                                       from '@vect/object-mapper'
import { firstKey, selectObject }                                from '@vect/object-select'
import { init }                                                  from '@vect/vector-init'
import { promises }                                              from 'fs'
import { DEFAULT_OPTIONS, profileToJson }                        from './convert/kerningToJson'
import { Kerning }                                               from './Kerning'
import { Metrics }                                               from './Metrics'

const LAYERS_PRIORITY = ['Regular', 'Roman', 'Medium', 'Semi Bold', 'Semi', 'Demi', 'Light']

export class Profile {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Kerning>} */
  layerToKerning // LayersToKerning
  /** @type {Object<string,Object<string,Metrics>>} */
  glyphLayerToMetrics // GlyphsToLayersToMetrics
  upm

  /**
   * @param {FontlabJson} profile
   */
  constructor(profile) {
    this.dataType = profile.dataType
    // profile.dataType  |> says[FONTLAB]
    if (profile.masters) this.layerToKerning = mapper(profile.masters, Kerning.build)
    if (profile.metrics) this.glyphLayerToMetrics = mapper(profile.metrics, glyphsToMetrics => mapper(glyphsToMetrics.layers, Metrics.build))
    this.upm = profile.upm
  }
  static build(fontlabJson) { return new Profile(fontlabJson) }
  static async fromFile(filePath) {
    // says[FONTLAB](`loading ${ros(filePath)}`)
    const buffer = await promises.readFile(filePath, 'utf8')
    // says[FONTLAB](`loaded ${ros(filePath)}`)
    const fontlabJson = await JSON.parse(buffer.toString())
    return Profile.build(fontlabJson)
  }
  async save(file, { kerningClasses, pairs, metrics, suffix } = DEFAULT_OPTIONS) {
    const { dir, base, ext } = parsePath(file)
    if ((!kerningClasses || !pairs || !metrics) && !suffix) {
      suffix = kerningClasses && !pairs ? 'Classes' : !kerningClasses && pairs ? 'Pairs' : kerningClasses && pairs ? 'Masters' : ''
      if (metrics) suffix += 'Metrics'
    }
    const target = dir + '/' + base + suffix + ext
    const json = JSON.stringify(this.toJson({ kerningClasses, pairs, metrics }))
    await promises.writeFile(target, json)
  }

  get layers() { return Object.keys(this.layerToKerning) }
  get defaultLayer() {
    for (let layer in LAYERS_PRIORITY) if (layer in this.layerToKerning) return layer
    return firstKey(this.layerToKerning)
  }

  toJson(options = DEFAULT_OPTIONS) { return profileToJson(this, options) }

  /** @returns {KerningClass[]} */
  kerningClasses(layer = this.defaultLayer) { return this.layerToKerning[layer].kerningClasses }
  metrics(layer = this.defaultLayer) { return mapper(this.glyphLayerToMetrics, layerToMetrics => layerToMetrics[layer]) }
  alphabetGroups() {
    const o = {}
    let letter
    Object.keys(this.glyphLayerToMetrics)
      .sort(stringAscending)
      .forEach((glyph) => {
        if ((letter = Latin.letter(glyph)) !== '-') (o[letter] ?? (o[letter] = [])).push(glyph)
      })
    iterate(o, vec => vec.sort(stringAscending))
    return o
  }
  alphabetsByLayers(alphabets = ALPHABET_UPPER) {
    const { layers } = this, glyphLayerToMetrics = selectObject(this.glyphLayerToMetrics, alphabets)
    const crostab = CrosTab.from({
      side: alphabets.slice(),
      head: init(layers.length * 2, (i) => !(i % 2) ? layers[i / 2] + '.L' : layers[(i - 1) / 2] + '.R'),
      title: 'metrics',
    })
    indexedIterate(glyphLayerToMetrics, (glyph, layer, metrics) => {
      crostab.setCell(glyph, layer + '.L', round(metrics.lsb))
      crostab.setCell(glyph, layer + '.R', round(metrics.rsb))
    })
    return crostab.mutateBanner(shortenWeight)
  }
}