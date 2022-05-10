import { Table }                                                  from '@analys/table'
import { entryIndexed }                                           from '@analys/table-indexed'
import { merge }                                                  from '@analys/table-join'
import { distinct }                                               from '@aryth/distinct-vector'
import { GLYPH, JOIN_SPEC, L, LABEL, LETTER, R }                  from '@fontlab/constants'
import { Scope }                                                  from '@fontlab/enum-scope'
import { Side }                                                   from '@fontlab/enum-side'
import { asc, glyphToLabel, Latin, shortToWeight, weightToShort } from '@fontlab/latin'
import { Master }                                                 from '@fontlab/master'
import { Metric }                                                 from '@fontlab/metric'
import { decoFlat }                                               from '@spare/logger'
import { says }                                                   from '@spare/xr'
import { isNumeric, parseNum }                                    from '@typen/num-strict'
import { transpose }                                              from '@vect/nested'
import { gather, vectorToObject }                                 from '@vect/object-init'
import { indexed, indexedTo, mapKeyVal, mapVal, }                 from '@vect/object-mapper'
import { appendValue }                                            from '@vect/object-update'
import { acquire }                                                from '@vect/vector-merge'
import { getFace }                                                from '../asset'


// noinspection CommaExpressionJS,DuplicatedCode
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
    if (masters) this.layerToMaster = mapKeyVal(masters, Master.keyVFM)
    if (metrics) this.layerToMetrics = mapVal(metrics, ({ layers }) => mapVal(layers, Metric.build))|> transpose
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
    const toHead = name => [ GLYPH, name + '.' + L, name + '.' + R ]
    const toRow = (glyph, metric) => [ glyph, metric.relLSB, metric.relRSB ]
    const tables = indexedTo(this.layerToMetrics, (k, ms) => Table.gather(toHead(k), indexed(ms, Latin.factory(scope), toRow), k))
    return Table.from(merge.call(JOIN_SPEC, ...tables))
      .proliferateColumn([
        { key: GLYPH, to: glyphToLabel, as: LABEL, },
        { key: GLYPH, to: Latin.letterOrEmpty, as: LETTER, }
      ], { nextTo: GLYPH })
      .mutateHead(weightToShort)
  }

  updateMaster(regroups) {
    for (let layer in this.layerToMaster) {
      const master = this.layerToMaster[layer], metricGlyphs = this.glyphs(layer)
      const xGlyphs = acquire(master.glyphs(Side.Verso), metricGlyphs)|> distinct
      const yGlyphs = acquire(master.glyphs(Side.Verso), metricGlyphs)|> distinct
      this.layerToMaster[layer] = master.regroup(regroups, xGlyphs, yGlyphs)
    }
    return this
  }
  updatePairs(nextPairs) {
    return mapVal(this.layerToMaster, master => {
      return master.updatePairs(nextPairs)
      // let count = 0
      // for (let [ x, y, v ] of indexedBy(nextPairs, (x, y, v) => valid(v) && !zero(v) && cell.call(pairs, x, y) !== v)) {
      //   count++, updateCell.call(pairs, x, y, v)
      // } // if (layer === 'Regular') `layer ( ${ros(layer)} ) cell( ${x}, ${y} ) = (${raw}) -> (${v})` |> says['Pheno'].br('updatePairs')
      // return count // $[LAYER](layer)['updated'](num) |> says['Pheno'].br('updatePairs')
    })
  }

  updateMetrics(table) {
    const stat = vectorToObject(this.shortenLayers, () => ({ lsb: 0, rsb: 0 }))
    if (table?.height < 1 || table?.coin(GLYPH) <= 0) return stat
    for (let layer of this.shortenLayers) {
      const metrics = this.metrics(shortToWeight(layer))
      const LN = layer + '.' + L, RN = layer + '.' + R
      if (!metrics || table?.height < 1 || table?.coin(LN) <= 0 || table?.coin(RN) <= 0) continue
      const
        confL = { nums: entryIndexed(table, [ GLYPH, LN ], (k, v) => isNumeric(v), (k, v) => [ k, parseNum(v) ]) |> gather },
        confR = { nums: entryIndexed(table, [ GLYPH, RN ], (k, v) => isNumeric(v), (k, v) => [ k, parseNum(v) ]) |> gather }
      for (let [ glyph, lsb, rsb ] of table.rows) {
        const m = metrics[glyph]
        if (m && m.lsb !== parseNum(lsb)) { stat[layer].lsb++, m.update(Side.Verso, lsb, confL) }
        if (m && m.rsb !== parseNum(rsb)) { stat[layer].rsb++, m.update(Side.Recto, rsb, confR) }
      }
    }
    return stat
  }
}