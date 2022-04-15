import { CrosTab }             from '@analys/crostab'
import { mapToObject }         from '@vect/object-init'
import { firstValue }          from '@vect/object-select'
import { round }               from '@aryth/math'
import { init }                from '@vect/vector-init'
import { WEIGHTS_TO_INITIALS } from '../asset/WEIGHTS.js'
import { makeReplaceable }     from '@spare/translator'

const REPLACEABLES = makeReplaceable(Object.entries(WEIGHTS_TO_INITIALS).map(([k, v]) => [new RegExp(k, 'gi'), v]))

// logger(decoEntries(REPLACEABLES))
export const shortenWeight = (weight) => {
  weight = weight.replace(/\s+/g, '')
  // logger(weight)
  weight = weight.replace(REPLACEABLES)
  return weight
}

/**
 * @typedef {{
 *    datatype:string,
 *    masters:FontlabMasters,
 *    metrics:FontlabMetrics,
 *    upm:number
 * }} VFMJson
 *
 * @typedef {
 *   Object.<string,{
 *     kerningClasses:Object,
 *     pairs:Object
 *   }>
 * } FontlabMasters
 *
 * @typedef {
 *   Object.<string,{
 *     layers:{
 *       [Hairline]: MetricsParams,
 *       [Thin]: MetricsParams,
 *       [ExtraLight]: MetricsParams,
 *       [Light]: MetricsParams,
 *       [Regular]: MetricsParams,
 *       [Medium]: MetricsParams,
 *       [SemiBold]: MetricsParams,
 *       [Bold]: MetricsParams,
 *       [Black]: MetricsParams,
 *     }
 *   }>
 * } FontlabMetrics
 *
 * @typedef {{
 *    lsb: number,
 *    rsb: number,
 *    [width]: number,
 *    [xmax]: number,
 *    [xmin]: number,
 *    [ymax]: number,
 *    [ymin]: number,
 * }} MetricsParams
 */

export class MetricsReader {
  alphabets
  diacritics
  constructor(alphabets, diacritics) {
    this.alphabets = alphabets
    this.diacritics = diacritics
  }

  /**
   *
   * @param {VFMJson} json
   * @returns {Array<string>}
   */
  static getLayers(json) {
    /** @type {FontlabMetrics} */
    const firstMetric = firstValue(json.metrics)
    return Object.keys(firstMetric.layers)
  }

  matchAlphabetAndDiacritic(name) {
    if (this.alphabets.includes(name)) return [name, '_']
    for (let alphabet of this.alphabets) {
      for (let diacritic of this.diacritics) {
        if (name === alphabet + diacritic) return [alphabet, diacritic]
      }
    }
    return null
  }

  matchAlphabet(name) {
    if (this.alphabets.includes(name)) return name
    return null
  }

  /**
   *
   * @param {VFMJson} json
   * @returns {CrosTab}
   */
  simplyAlphabetsByLayers(json) {
    const layers = MetricsReader.getLayers(json)
    const head = init(layers.length * 2, (i) => !(i % 2) ? layers[i / 2] + '.L' : layers[(i - 1) / 2] + '.R')
    const crostab = CrosTab.from({
      side: this.alphabets.slice(),
      head: head,
      title: 'metrics',
    })
    for (const [glyph, fontlabMetric] of Object.entries(json.metrics)) {
      if (this.matchAlphabet(glyph)) {
        for (const [layer, metricParams] of Object.entries(fontlabMetric.layers)) {
          const { lsb, rsb } = metricParams
          crostab.setCell(glyph, layer + '.L', round(lsb))
          crostab.setCell(glyph, layer + '.R', round(rsb))
        }
      }
    }
    crostab.mapBanner(shortenWeight)
    return crostab
  }

  /**
   *
   * @param {VFMJson} json
   * @returns {Object<string,CrosTab>}
   */
  byLayersAlphabetsByDiacritics(json) {
    const crostabHead = ['_', ...this.diacritics]
    const crostabCollection = mapToObject(MetricsReader.getLayers(json), layer => CrosTab.from({
      side: this.alphabets.slice(),
      head: crostabHead.slice(),
      title: layer
    }))
    const metrics = json.metrics
    let match, alphabet, diacritic
    for (let name in metrics) {
      if ((match = this.matchAlphabetAndDiacritic(name)) && ([alphabet, diacritic] = match)) {
        const metric = metrics[name]
        const layers = metric?.layers
        for (let layer in layers) {
          const { lsb, rsb } = layers[layer]
          const crostab = crostabCollection[layer] // logger(Xr().glyph(glyph).variation(variation).info(deco({ lsb, rsb })))
          crostab.setCell(alphabet, diacritic, [lsb, rsb])
        }
      }
    }
    return crostabCollection
  }
}








