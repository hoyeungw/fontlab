import { CrosTab }       from '@analys/crostab'
import { round }         from '@aryth/math'
import { mapToObject }   from '@vect/object-init'
import { init }          from '@vect/vector-init'
import { shortenWeight } from '../../util/shortenWeight.js'

export class MetricsReader {
  alphabets
  diacritics
  constructor(alphabets, diacritics) {
    this.alphabets = alphabets
    this.diacritics = diacritics
  }

  matchAlphabetAndDiacritic(name) {
    if (this.alphabets.includes(name)) return [name, '_']
    for (const alphabet of this.alphabets) {
      for (const diacritic of this.diacritics) {
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
   * @param {VFM} vfm
   * @returns {CrosTab}
   */
  alphabetsByLayers(vfm) {
    const layers = vfm.layers
    const crostab = CrosTab.from({
      side: this.alphabets.slice(),
      head: init(layers.length * 2, (i) => !(i % 2) ? layers[i / 2] + '.L' : layers[(i - 1) / 2] + '.R'),
      title: 'metrics',
    })

    for (const [glyph, layerToMetrics] of Object.entries(vfm.glyphLayerToMetrics)) {
      if (this.matchAlphabet(glyph)) for (const [layer, metrics] of Object.entries(layerToMetrics)) {
        const { lsb, rsb } = metrics
        crostab.setCell(glyph, layer + '.L', round(lsb))
        crostab.setCell(glyph, layer + '.R', round(rsb))
      }
    }
    crostab.mapBanner(shortenWeight)
    return crostab
  }

  /**
   *
   * @param {FontlabJson} json
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
        /** @type {GlyphToFontlabMetrics} */ const metric = metrics[name]
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








