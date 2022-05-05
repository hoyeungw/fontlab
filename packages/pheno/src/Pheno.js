import { UNION }                                                              from '@analys/enum-join-modes'
import { Table }                                                              from '@analys/table'
import { merge }                                                              from '@analys/table-join'
import { almostEqual }                                                        from '@aryth/math'
import { asc, Latin, Scope, shortToWeight, weightToShort }                    from '@fontlab/latin'
import { Master }                                                             from '@fontlab/master'
import { Metric }                                                             from '@fontlab/metric'
import { valid }                                                              from '@typen/nullish'
import { filterIndexed, transpose, updateCell }                               from '@vect/nested'
import { vectorToObject }                                                     from '@vect/object-init'
import { filterMappedIndexed, mapKeyValue, mappedIndexed, mapValues, mutate } from '@vect/object-mapper'
import { appendValue }                                                        from '@vect/object-update'
import { getFace, GLYPH, LETTER }                                             from '../asset'

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
  get shortenLayers() { return this.layers.map(weightToShort) }
  get face() { return getFace(this.layerToMaster) }
  get glyphLayerToMetric() { return this.layerToMetrics|> transpose }

  /**
   * @param {string} [layer]
   * @return {Master}
   */
  master(layer) { return this.layerToMaster[layer ?? this.face] }
  /**
   * @param {string} [layer]
   * @return {Object<string,Metric>}
   */
  metrics(layer) { return this.layerToMetrics[layer ?? this.face] }
  glyphs(layer) { return Object.keys(this.metrics(layer ?? this.face)).sort(asc) }

  alphabetGrouped(layer) {
    let grouped = {}, x
    for (let g of this.glyphs(layer)) if ((x = Latin.letterOrNull(g))) appendValue.call(grouped, x, g)
    for (let x in grouped) grouped[x].sort(asc)
    return grouped
  }
  sidebearingTable(scope = Scope.Upper) {
    function getRow(glyph, metric) { return [ glyph, metric.relLSB, metric.relRSB ] }
    const JOIN_SPEC = { fields: [ GLYPH ], joinType: UNION, fillEmpty: '' }
    const table = merge.call(JOIN_SPEC, ...mappedIndexed(this.layerToMetrics, (name, metrics) =>
      Table.from({
        head: [ GLYPH, name + '.L', name + '.R' ],
        rows: [ ...filterMappedIndexed(metrics, Latin.filterFactory(scope), getRow) ],
        title: name,
      })))
    return Table.from(table)
      .mutateHead(weightToShort)
      .proliferateColumn({ key: GLYPH, to: Latin.letterOrEmpty, as: LETTER }, { nextTo: GLYPH, mutate: true })
  }

  mutateGroups(regroups) { return mutate(this.layerToMaster, m => m.regroup(regroups)), this }
  mutatePairs(nextPairs) {
    function zero(v) { return almostEqual(v, 0, 0.1) }
    function cell(x, y) { return this[x] ? this[x][y] : null }
    return mapValues(this.layerToMaster, ({ pairs }) => {
      let count = 0
      for (let [ x, y, v ] of filterIndexed(nextPairs, (x, y, v) => valid(v) && !zero(v) && cell.call(pairs, x, y) !== v)) {
        count++, updateCell.call(pairs, x, y, v)
      } // if (layer === 'Regular') `layer ( ${ros(layer)} ) cell( ${x}, ${y} ) = (${raw}) -> (${v})` |> says['Pheno'].br('mutatePairs')
      return count // $[LAYER](layer)['updated'](num) |> says['Pheno'].br('mutatePairs')
    })
  }

  /**
   * @param {Table} nextTable
   * @returns {Pheno}
   */
  mutateSidebearings(nextTable) {
    const counts = vectorToObject(this.shortenLayers, () => ({ lsb: 0, rsb: 0 }))
    for (let name of this.shortenLayers) {
      const table = nextTable.select([ GLYPH, name + '.L', name + '.R' ])
      const metrics = this.metrics(shortToWeight(name))
      if (!metrics || table?.height < 1 || table?.width < 3) continue
      for (let [ glyph, lsb, rsb ] of table.rows) {
        const metric = metrics[glyph]
        if (!metrics) continue
        if (lsb?.trim()?.length && metric.relLSB !== lsb) { counts[name].lsb++, metric.relLSB = lsb }
        if (rsb?.trim()?.length && metric.relRSB !== rsb) { counts[name].rsb++, metric.relRSB = rsb }
      }
    }
    return counts
  }
}