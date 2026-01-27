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
import { parseNum }                                               from '@typen/num-strict'
import { transpose }                                              from '@vect/nested'
import { gather, vectorToObject }                                 from '@vect/object-init'
import { indexed, indexedTo, mapKeyVal, mapVal }                  from '@vect/object-mapper'
import { appendValue }                                            from '@vect/object-update'
import { acquire }                                                from '@vect/vector-algebra'
import { getFace }                                                from '../asset/index.js'
import { valIsNum, valToNum }                                     from './utils.js'


// noinspection CommaExpressionJS,DuplicatedCode
export class Typeface {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Master>}                */ layerToMaster // LayersToKerning
  /** @type {Object<string,Object<string,Metric>>} */ layerToMetrics // GlyphsToLayersToMetrics
  upm

  /** @param {FontlabJson} profile */
  constructor(profile) {
    this.dataType = profile.dataType
    if (profile.masters) {
      this.layerToMaster = mapKeyVal(profile.masters, Master.from)
    }
    if (profile.metrics) {
      const glyphToLayerToMetrics = mapVal(profile.metrics, ({ layers }) => mapVal(layers, Metric.build))
      this.layerToMetrics = transpose(glyphToLayerToMetrics) // layerToGlyphToMetrics
    }
    this.upm = profile.upm
  }
  static build(fontlabJson) { return new Typeface(fontlabJson) }

  get layers() { return Object.keys(this.layerToMaster) }
  get shortenLayers() { return this.layers.map(weightToShort) }
  get face() { return getFace(this.layerToMaster) }
  get glyphLayerToMetric() { return transpose(this.layerToMetrics) }

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

  alphabetGroups(layer) {
    let groups = {}, x
    for (let g of this.glyphs(layer)) if ((x = Latin.letterOrNull(g))) appendValue.call(groups, x, g)
    for (let x in groups) groups[x].sort(asc)
    return groups
  }

  sidebearingTable(scope = Scope.Upper) {
    const initHead = name => [ GLYPH, name + '.' + L, name + '.' + R ]
    const initRow = (glyph, metric) => [ glyph, metric.relLSB, metric.relRSB ]
    const iterTables = indexedTo(
      this.layerToMetrics,
      (layer, metrics) => Table
        .build(initHead(layer), null, layer)
        .collect(indexed(metrics, Latin.factory(scope), initRow)),
    )
    const table = Algebra.joins(UNION, [ GLYPH ], '', ...iterTables)
    table.headward
      .grow(GLYPH, glyphToLabel, LABEL, GLYPH)
      .grow(GLYPH, Latin.letterOrEmpty, LETTER, LABEL)
    return table.mutateKeys(weightToShort)
  }

  updateMaster(groups) {
    for (let layer in this.layerToMaster) {
      const master = this.layerToMaster[layer], glyphs = this.glyphs(layer)
      const xGlyphs = distinct(acquire(master.glyphs(Side.Left), glyphs))
      const yGlyphs = distinct(acquire(master.glyphs(Side.Left), glyphs))
      this.layerToMaster[layer] = master.regroup(groups, xGlyphs, yGlyphs)
    }
    return this
  }
  updatePairs(nextPairs) { return mapVal(this.layerToMaster, master => master.updatePairs(nextPairs)) }

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
      const lDict = gather(table.headward.entryIndexed([ GLYPH, LN ], valIsNum, valToNum)),
        rDict = gather(table.headward.entryIndexed([ GLYPH, RN ], valIsNum, valToNum))
      for (let [ glyph, lsb, rsb ] of table.headward.tripletIndexed([ GLYPH, LN, RN ])) {
        if (!(glyph = metrics[glyph])) continue
        if (glyph.lpt === '') glyph.lpt = null
        if (glyph.rpt === '') glyph.rpt = null
        if (glyph.lsb !== parseNum(lsb)) { stat[layer].lsb++, glyph.update(Side.Left, lsb, lDict) }
        if (glyph.rsb !== parseNum(rsb)) { stat[layer].rsb++, glyph.update(Side.Right, rsb, rDict) }
      }
    }
    return stat
  }
}