import { CrosTab }       from '@analys/crostab'
import { round }         from '@aryth/math'
import { mapToObject }   from '@vect/object-init'
import { firstValue }    from '@vect/object-select'
import { init }          from '@vect/vector-init'
import { shortenWeight } from './shortenWeight.js'


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
    if (this.alphabets.includes(name)) return [ name, '_' ]
    for (const alphabet of this.alphabets) {
      for (const diacritic of this.diacritics) {
        if (name === alphabet + diacritic) return [ alphabet, diacritic ]
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
  alphabetsByLayers(json) {
    const layers = MetricsReader.getLayers(json)
    const side = this.alphabets.slice()
    const head = init(layers.length * 2, (i) => !(i % 2) ? layers[i / 2] + '.L' : layers[(i - 1) / 2] + '.R')
    const crostab = CrosTab.from({ side, head, title: 'metrics', })

    /** @type {FontlabMetrics} */ const metrics = json.metrics
    for (const [ glyph, fontlabMetric ] of Object.entries(metrics)) {
      if (this.matchAlphabet(glyph)) {
        for (const [ layer, metricParams ] of Object.entries(fontlabMetric.layers)) {
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
    const crostabHead = [ '_', ...this.diacritics ]
    const crostabCollection = mapToObject(MetricsReader.getLayers(json), layer => CrosTab.from({
      side: this.alphabets.slice(),
      head: crostabHead.slice(),
      title: layer
    }))
    const metrics = json.metrics
    let match, alphabet, diacritic
    for (let name in metrics) {
      if ((match = this.matchAlphabetAndDiacritic(name)) && ([ alphabet, diacritic ] = match)) {
        /** @type {FontlabMetrics} */ const metric = metrics[name]
        const layers = metric?.layers
        for (let layer in layers) {
          const { lsb, rsb } = layers[layer]
          const crostab = crostabCollection[layer] // logger(Xr().glyph(glyph).variation(variation).info(deco({ lsb, rsb })))
          crostab.setCell(alphabet, diacritic, [ lsb, rsb ])
        }
      }
    }
    return crostabCollection
  }
}








