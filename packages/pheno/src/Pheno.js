import { CrosTab }                                   from '@analys/crostab'
import { almostEqual, round }                        from '@aryth/math'
import { ALPHABET_UPPER, asc, Latin, shortenWeight } from '@fontlab/latin'
import { Master }                                    from '@fontlab/master'
import { Metric }                                    from '@fontlab/metric'
import { $, says }                                   from '@spare/xr'
import { valid }                                     from '@typen/nullish'
import { filterIndexed, transpose, updateCell }      from '@vect/nested'
import { mapKeyValue, mapValues, mutate }            from '@vect/object-mapper'
import { appendValue }                               from '@vect/object-update'
import { getFace, LAYER }                            from '../asset'

// noinspection CommaExpressionJS
export class Pheno {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Master>}                */ layerToMaster // LayersToKerning
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

  // static async fromFile(filePath) { return (await fileToProfile(filePath))|> Pheno.build }
  // async save(file, options = CONVERT_OPTIONS) { await profileToFile(this, file, options) }
  // toJson(options = CONVERT_OPTIONS) { return profileToJson(this, options) }

  get layers() { return Object.keys(this.layerToMaster) }
  get face() { return getFace(this.layerToMaster) }
  get glyphLayerToMetric() { return this.layerToMetrics|> transpose }

  /** @return {Master} */
  master(layer) { return this.layerToMaster[layer ?? this.face] }
  metrics(layer) { return this.layerToMetrics[layer ?? this.face] }
  glyphs(layer) { return Object.keys(this.metrics(layer ?? this.face)).sort(asc) }

  alphabetGrouped(layer) {
    let grouped = {}, x
    for (let g of this.glyphs(layer)) if ((x = Latin.letterOrNull(g))) appendValue.call(grouped, x, g)
    for (let x of grouped) grouped[x].sort(asc)
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

  mutateRegroup(regroupScheme) { return mutate(this.layerToMaster, m => m.regroup(regroupScheme)), this }
  mutatePairs(nextPairs) {
    function zero(v) { return almostEqual(v, 0, 0.1) }
    function val(x, y) { return (this[x] ?? {})[y] }
    for (let [ layer, { pairs } ] of this.layerToMaster) {
      let num = 0
      for (let [ x, y, v ] of filterIndexed(nextPairs,
        (nx, ny, nv) => valid(nv) && !zero(nv) && val.call(pairs, nx, ny) !== nv)) {
        num++
        // if (layer === 'Regular') `layer ( ${ros(layer)} ) cell( ${x}, ${y} ) = (${raw}) -> (${v})` |> says['Pheno'].br('mutatePairs')
        updateCell.call(pairs, x, y, v)
      }
      $[LAYER](layer)['updated'](num) |> says['Pheno'].br('mutatePairs')
    }
    return this
  }
}