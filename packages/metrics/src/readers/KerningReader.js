import { CrosTab }       from '@analys/crostab'
import { round }         from '@aryth/math'
import { shortenWeight } from '@fontlab/latin'
import { init }          from '@vect/vector-init'

export class KerningReader {
  alphabets
  constructor(alphabets) {
    this.alphabets = alphabets
  }

  static getLayers(json) { return Object.keys(json?.masters ?? {}) }

  /**
   *
   * @param {FontlabJson} json
   * @returns {CrosTab}
   */
  byLayersAlphabetsByLayers(json) {
    const layers = KerningReader.getLayers(json)
    const side = this.alphabets.slice()
    const head = init(layers.length * 2, (i) => !(i % 2) ? layers[i / 2] + '.L' : layers[(i - 1) / 2] + '.R')
    const crostab = CrosTab.from({ side, head, title: 'metrics', })

    const masters = json.masters
    for (const [glyph, { pairs }] of Object.entries(masters)) {
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
}