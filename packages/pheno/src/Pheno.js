import { UNION }                                                  from '@analys/enum-join-modes'
import { Table }                                                  from '@analyz/table'
import { Algebra }                                                from '@analyz/table-algebra'
import { distinct }                                               from '@aryth/distinct-vector'
import { GLYPH, L, LABEL, LETTER, R }                             from '@fontlab/constants'
import { Scope }                                                  from '@fontlab/enum-scope'
import { Side }                                                   from '@fontlab/enum-side'
import { asc, glyphToLabel, Latin, shortToWeight, weightToShort } from '@fontlab/latin'
import { Master }                                                 from '@fontlab/master'
import { Metric }                                                 from '@fontlab/metric'
import { isNumeric, parseNum }                                    from '@typen/num-strict'
import { transpose }                                              from '@vect/nested'
import { gather, vectorToObject }                                 from '@vect/object-init'
import { indexed, indexedTo, mapKeyVal, mapVal, }                 from '@vect/object-mapper'
import { appendValue }                                            from '@vect/object-update'
import { acquire }                                                from '@vect/vector-algebra'
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
    const nameToHead = name => [ GLYPH, name + '.' + L, name + '.' + R ]
    const kvToRow = (glyph, metric) => [ glyph, metric.relLSB, metric.relRSB ]
    const tables = indexedTo(this.layerToMetrics, (k, ms) => Table.build(nameToHead(k), null, k)
      .collect(indexed(ms, Latin.factory(scope), kvToRow)))
    const table = Algebra.joins(UNION, [ GLYPH ], '', ...tables)
    table.headward
      .grow(GLYPH, glyphToLabel, LABEL, GLYPH)
      .grow(GLYPH, Latin.letterOrEmpty, LETTER, LABEL)
    return table.mutateKeys(weightToShort)
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
    return mapVal(this.layerToMaster, master => master.updatePairs(nextPairs))
  }

  /**
   *
   * @param {Table} table
   * @returns {*}
   */
  updateMetrics(table) {
    const stat = vectorToObject(this.shortenLayers, () => ({ lsb: 0, rsb: 0 }))
    if (table?.height <= 0 || table?.coin(GLYPH) < 0) return stat
    for (let layer of this.shortenLayers) {
      const metrics = this.metrics(shortToWeight(layer))
      const LN = layer + '.' + L, RN = layer + '.' + R
      if (!metrics || table?.height <= 0 || table?.coin(LN) < 0 || table?.coin(RN) < 0) continue
      const
        lDict = table.headward.entryIndexed([ GLYPH, LN ], valIsNum, valToNum)|> gather,
        rDict = table.headward.entryIndexed([ GLYPH, RN ], valIsNum, valToNum)|> gather
      for (let [ glyph, lsb, rsb ] of table.headward.tripletIndexed([ GLYPH, LN, RN ])) {
        if (!(glyph = metrics[glyph])) continue
        if (glyph.lpt === '') glyph.lpt = null
        if (glyph.rpt === '') glyph.rpt = null
        if (glyph.lsb !== parseNum(lsb)) { stat[layer].lsb++, glyph.update(Side.Verso, lsb, lDict) }
        if (glyph.rsb !== parseNum(rsb)) { stat[layer].rsb++, glyph.update(Side.Recto, rsb, rDict) }
      }
    }
    return stat
  }
}

export function valIsNum(_, v) { return isNumeric(v) }
export function valToNum(k, v) { return [ k, parseNum(v) ] }