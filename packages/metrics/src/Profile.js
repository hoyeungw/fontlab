import { CrosTab }                                               from '@analys/crostab'
import { filterIndexed }                                         from '@analys/crostab-indexed'
import { almostEqual, round }                                    from '@aryth/math'
import { ALPHABET_UPPER, Latin, shortenWeight, stringAscending } from '@fontlab/latin'
import { Master }                                                from '@fontlab/master'
import { ros, says }                                             from '@spare/logger'
import { cr }                                                    from '@spare/xr'
import { camelToSnake }                                          from '@texting/phrasing'
import { nullish }                                               from '@typen/nullish'
import { updateCell }                                            from '@vect/nested'
import { iterateValues, mapValues }                              from '@vect/object-mapper'
import { firstKey }                                              from '@vect/object-select'
import { CONVERT_OPTIONS, LAYER, LAYERS_PRIORITY }               from '../asset'
import { profileToJson }                                         from './convert/classToJson'
import { fileToProfile, profileToFile }                          from './convert/profileAndFile'
import { Metric }                                                from './Metric'


export class Profile {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Master>} */
  layerToMaster // LayersToKerning
  /** @type {Object<string,Object<string,Metric>>} */
  glyphLayerToMetric // GlyphsToLayersToMetrics
  upm

  /**
   * @param {FontlabJson} profile
   */
  constructor(profile) {
    this.dataType = profile.dataType
    // profile.dataType  |> says[FONTLAB]
    if (profile.masters) this.layerToMaster = mapValues(profile.masters, Master.build)
    if (profile.metrics) this.glyphLayerToMetric = mapValues(profile.metrics, glyphsToMetrics => mapValues(glyphsToMetrics.layers, Metric.build))
    this.upm = profile.upm
  }
  static build(fontlabJson) { return new Profile(fontlabJson) }
  static async fromFile(filePath) { return (await fileToProfile(filePath))|> Profile.build }
  get layers() { return Object.keys(this.layerToMaster) }
  get defaultLayer() {
    for (let layer in LAYERS_PRIORITY) if (layer in this.layerToMaster) return layer
    return firstKey(this.layerToMaster)
  }

  toJson(options = CONVERT_OPTIONS) { return profileToJson(this, options) }

  /** @return {Master} */
  master(layer = this.defaultLayer) { return this.layerToMaster[layer] }
  glyphToMetric(layer = this.defaultLayer) { return mapValues(this.glyphLayerToMetric, layerToMetric => layerToMetric[layer]) }

  alphabetGroups() {
    const grouped = {}
    const glyphs = Object.keys(this.glyphLayerToMetric).sort(stringAscending)
    for (let glyph of glyphs) {
      const letter = Latin.letter(glyph)
      if (!letter) continue;
      (grouped[letter] ?? (grouped[letter] = [])).push(glyph)
    }
    iterateValues(grouped, list => list.sort(stringAscending))
    return grouped
  }
  alphabetByLayer(alphabet = ALPHABET_UPPER) {
    const crostab = CrosTab.from({
      side: alphabet.slice(),
      head: this.layers.map(layer => [ layer + '.L', layer + '.R' ]).flat(),
      title: 'metrics',
    })
    const enumerator = filterIndexed(this.glyphLayerToMetric, (glyph, layer, metric) => alphabet.includes(glyph))
    for (let [ glyph, layer, metric ] of enumerator) {
      crostab.setCell(glyph, layer + '.L', round(metric.lsb))
      crostab.setCell(glyph, layer + '.R', round(metric.rsb))
    }
    return crostab.mutateBanner(shortenWeight)
  }

  regroupMasters(regroupScheme) {
    for (let layer of this.layers) {
      this.layerToMaster[layer] = this.layerToMaster[layer].regroup(regroupScheme)
    }
    return this
  }
  updatePairsByCrostab(crostab) {
    if (!crostab) return this
    for (let layer of this.layers) {
      const pairs = this.layerToMaster[layer].pairs
      let num = 0
      for (let [ x, y, val ] of filterIndexed(crostab, (x, y, v) => !almostEqual(v, 0, 0.1))) {
        const raw = (pairs[x] ?? {})[y] ?? null
        if (nullish(val) || almostEqual(val, 0, 0.1) || raw === val) continue
        num++
        if (layer === 'Regular') `layer ( ${ros(layer)} ) cell( ${x}, ${y} ) = (${raw}) -> (${val})` |> says['Profile'].br(ros(camelToSnake('updatePairsByCrostab')))
        updateCell.call(pairs, x, y, val)
      }
      cr('updatePairsByCrostab')[LAYER](ros(layer))['updatedPairs'](num) |> says['Profile']
      // `layer ( ${ros(layer)} ) updated (${num}) pairs` |> says['Profile'].br(ros(camelToSnake('updatePairsByCrostab')))
    }
    return this
  }

  // { groups, pairs, metrics, suffix }
  async save(file, options = CONVERT_OPTIONS) { await profileToFile(this, file, options) }
}