import { iterate, iterateEntries, mapper }           from '@vect/object-mapper'
import { ros, says }                                 from '@spare/logger'
import { ALPHABETS_LOWER, ALPHABETS_UPPER, FONTLAB } from '../asset'
import { promises }                                  from 'fs'
import { firstKey, selectObject }                    from '@vect/object-select'
import { stringValue }                               from '../util/stringValue'
import { parsePath }                                 from '@acq/path'
import { DEFAULT_OPTIONS, kerningToJson, vfmToJson } from './convert/kerningToVFM'
import { CrosTab }                                   from '@analys/crostab'
import { init }                                      from '@vect/vector-init'
import { round }                                     from '@aryth/math'
import { shortenWeight }                             from './shortenWeight'
import { mapToObject }                               from '@vect/object-init'
import { merge }                                     from '@vect/vector-merge'
import { stringAscending }                           from '../util/stringAscending'

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
      suffix =
        kerningClasses && !pairs ? 'Classes' :
          !kerningClasses && pairs ? 'Pairs' :
            kerningClasses && pairs ? 'Masters' :
              ''
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
  kerningClasses(layer = this.defaultLayer) { return this.layerToKerning[layer].kerningClasses }
  metrics(layer = this.defaultLayer) { return mapper(this.glyphLayerToMetrics, layerToMetrics => layerToMetrics[layer]) }
  alphabetGroups() {
    const NUMERICS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero']
    const EXCLUSION = ['CR', 'Euro', 'Eth', 'Eng', 'NULL']
    function exclude(glyph) { if (EXCLUSION.includes(glyph)) return true } // Eng for N, Eth for D
    const alphabets = merge(ALPHABETS_UPPER, ALPHABETS_LOWER)
    const o = mapToObject(alphabets, () => [])
    const safeList = []
    Object.keys(this.glyphLayerToMetrics)
      .sort(stringAscending)
      .forEach((glyph) => {
        if (exclude(glyph)) return
        if (ALPHABETS_UPPER.includes(glyph[0])) {
          o[glyph[0]].push(glyph)
          safeList.push(glyph.toLowerCase())
        } else if (ALPHABETS_LOWER.includes(glyph[0]) && safeList.includes(glyph)) {
          o[glyph[0]].push(glyph)
        }
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

export class Kerning {
  kerningClasses
  pairs
  constructor(kerning) {
    const classes = (kerning.kerningClasses ?? [])
      .map(KerningClass.build)
      .sort(({ name: a }, { name: b }) => stringValue(a) - stringValue(b))
    this.kerningClasses = [...classes.filter(({ _1st }) => _1st), ...classes.filter(({ _2nd }) => _2nd)]
    this.pairs = kerning.pairs
  }
  static build(fontlabKerning) { return new Kerning(fontlabKerning) }

  classes() { return this.kerningClasses.map(kerningClass => kerningClass.toObject()) }
  paringCrostab() {

  }
  toVFM(options = DEFAULT_OPTIONS) { return kerningToJson(this, options) }
}

export class KerningClass {
  /** @type {boolean} */ _1st
  /** @type {boolean} */ _2nd
  /** @type {string} */ name
  /** @type {Array<string>} */ names
  constructor(body) {
    this._1st = body['1st']
    this._2nd = body['2nd']
    this.name = body.name
    this.names = body.names
    this.names.sort()
  }
  static build(body) { return new KerningClass(body) }
  get side() { return this._1st ? 'verso' : this._2nd ? 'recto' : null }
  toObject() { return { side: this.side, key: this.name, glyphs: this.names }}
  toVFM() {
    const o = {}
    if (this._1st) o['1st'] = this._1st
    if (this._2nd) o['2nd'] = this._2nd
    o.name = this.name
    o.names = this.names
    return o
  }
  toString() { return `[side] (${this.side}) [key] (${this.name}) [glyphs] (${this.names})` }
}

export class Metrics {
  lsb
  rsb
  metricsLeft
  metricsRight
  width
  xmax
  xmin
  ymax
  ymin
  constructor(metrics) {
    this.lsb = metrics.lsb
    this.rsb = metrics.rsb
    this.metricsLeft = metrics.metricsLeft
    this.metricsRight = metrics.metricsRight
    this.width = metrics.width
    this.xmax = metrics.xmax
    this.xmin = metrics.xmin
    this.ymax = metrics.ymax
    this.ymin = metrics.ymin
  }
  static build(metrics) { return new Metrics(metrics) }
  toString() {
    return `[sideBearing] (${this.lsb},${this.rsb}) [width] (${this.width}) [extreme] ({ xmin:${this.xmin},xmax:${this.xmax},ymin:${this.ymin},ymax:${this.ymax})`
  }
}