import { CrosTab }                                               from '@analys/crostab'
import { filterIndexed as filterIndexedCrostab }                 from '@analys/crostab-indexed'
import { almostEqual, round }                                    from '@aryth/math'
import { ALPHABET_UPPER, Latin, shortenWeight, stringAscending } from '@fontlab/latin'
import { Master }                                                from '@fontlab/master'
import { Metric }                                                from '@fontlab/metric'
import { ros, says }                                             from '@spare/logger'
import { cr }                                                    from '@spare/xr'
import { camelToSnake }                                          from '@texting/phrasing'
import { nullish }                                               from '@typen/nullish'
import { filterIndexed, transpose, updateCell }                  from '@vect/nested'
import { iterateValues, mapKeyValue, mapValues }                 from '@vect/object-mapper'
import { CONVERT_OPTIONS, getFace, LAYER }                       from '../asset'
import { profileToJson }                                         from './convert/classToJson'
import { fileToProfile, profileToFile }                          from './convert/profileAndFile'

export class Pheno {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Master>}                */ layerToMaster // LayersToKerning
  /** @type {Object<string,Object<string,Metric>>} */ glyphLayerToMetric // GlyphsToLayersToMetrics
  /** @type {Object<string,Object<string,Metric>>} */ layerToMetrics // GlyphsToLayersToMetrics
  upm

  /**
   * @param {FontlabJson} profile
   */
  constructor(profile) {
    const { dataType, masters, metrics, upm } = profile
    this.dataType = dataType
    if (masters) this.layerToMaster = mapKeyValue(masters, Master.fromEntry)
    if (metrics) this.layerToMetrics = mapValues(metrics, ({ layers }) => mapValues(layers, Metric.build))|> transpose
    this.upm = upm
  }
  static build(fontlabJson) { return new Pheno(fontlabJson) }

  static async fromFile(filePath) { return (await fileToProfile(filePath))|> Pheno.build }
  async save(file, options = CONVERT_OPTIONS) { await profileToFile(this, file, options) }

  get layers() { return Object.keys(this.layerToMaster) }
  get face() { return getFace(this.layerToMaster) }
  get glyphLayerToMetric() { return this.layerToMetrics |> transpose }

  toJson(options = CONVERT_OPTIONS) { return profileToJson(this, options) }

  /** @return {Master} */
  master(layer) { return this.layerToMaster[layer ?? this.face] }
  metricSet(layer) { return this.layerToMetrics[layer ?? this.face] }

  alphabetGroups() {
    const grouped = {}
    const glyphs = Object.keys(this.glyphLayerToMetric).sort(stringAscending)
    for (let glyph of glyphs) {
      const letter = Latin.letterOrNull(glyph)
      if (!letter) continue;
      (grouped[letter] ?? (grouped[letter] = [])).push(glyph)
    }
    iterateValues(grouped, list => list.sort(stringAscending))
    return grouped
  }
  sidebearingTable(alphabet = ALPHABET_UPPER) {
    const crostab = CrosTab.draft({
      side: alphabet.slice(),
      head: this.layers.map(layer => [ `${layer}.L`, `${layer}.R` ]).flat(),
      value: '',
      title: 'metrics',
    })
    for (let [ layer, glyph, metric ] of filterIndexed(this.layerToMetrics, (layer, glyph, metric) => alphabet.includes(glyph))) {
      crostab.setCell(glyph, `${layer}.L`, round(metric.lsb))
      crostab.setCell(glyph, `${layer}.R`, round(metric.rsb))
    }
    return crostab.mutateBanner(shortenWeight)
  }

  regroupMasters(regroupScheme) {
    for (let layer of this.layers)
      this.layerToMaster[layer] = this.layerToMaster[layer].regroup(regroupScheme)
    return this
  }
  updatePairsByCrostab(crostab) {
    if (!crostab) return this
    for (let layer of this.layers) {
      const pairs = this.layerToMaster[layer].pairs
      let num = 0
      for (let [ x, y, val ] of filterIndexedCrostab(crostab, (x, y, v) => !almostEqual(v, 0, 0.1))) {
        const raw = (pairs[x] ?? {})[y] ?? null
        if (nullish(val) || almostEqual(val, 0, 0.1) || raw === val) continue
        num++
        if (layer === 'Regular') `layer ( ${ros(layer)} ) cell( ${x}, ${y} ) = (${raw}) -> (${val})` |> says['Profile'].br(ros(camelToSnake('updatePairsByCrostab')))
        updateCell.call(pairs, x, y, val)
      }
      cr('updatePairsByCrostab')[LAYER](ros(layer))['updatedPairs'](num) |> says['Profile']
      // `layer ( ${ros(layer)} ) updated (${num}) pairs` |> says['Pheno'].br(ros(camelToSnake('updatePairsByCrostab')))
    }
    return this
  }
}