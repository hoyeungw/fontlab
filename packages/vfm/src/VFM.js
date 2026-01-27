import { Master }                                        from '@fontlab/master'
import { Metric }                                        from '@fontlab/metric'
import { MetricSeries }                                  from '@fontlab/metric-series'
import { CONVERT_OPTIONS, GLYPH, L, LABEL, LETTER, R }   from '@fontlab/constants'
import { indexed, indexedTo, mapKeyVal, mapper, mapVal } from '@vect/object-mapper'
import { readFile }                                      from 'fs/promises'
import { Scope, scopeName }                              from '@fontlab/enum-scope'
import { glyphToLabel, Latin, weightToShort }            from '@fontlab/latin'
import { UNION }                                         from '@analys/enum-join-modes'
import { Table }                                         from '@analyz/table'
import { Algebra }                                       from '@analyz/table-algebra'
import { collect }                                       from '@vect/vector-init'


export class VFM {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Master>} */                                masters // layer → masters
  /** @type {Object<string,Object<string,Object<string,Metric>>>} */  metrics // glyph → [layers] → layer → metrics
  upm

  /** @param {Object} json */
  constructor(json = {}) {
    const { dataType, masters, metrics, upm } = json
    this.dataType = dataType
    if (masters) { this.masters = mapKeyVal(masters, Master.from) }
    if (metrics) { this.metrics = mapVal(metrics, metric => ({ layers: mapVal(metric.layers, Metric.build) })) }
    this.upm = upm
  }

  static build(vfm) { return new VFM(vfm) }
  static async read(file) {
    const data = await readFile(file, 'utf8')
    const json = await JSON.parse(data)
    return VFM.build(json)
  }

  get layers() { return Object.keys(this.masters) }

  /***
   * { layer = 'Regular', kerningClasses = true, kerningPairs = true, metrics = true }
   * @param {{[kerningClasses]:boolean,[kerningPairs]:boolean,[metrics]:boolean}} options
   * @returns {VFM} vfm
   */
  slice(options = CONVERT_OPTIONS) {
    const json = { datatype: this.dataType, upm: this.upm }
    if (options.metrics) json.metrics = this.metrics
    if (options.kerningClasses || options.kerningPairs)
      json.masters = mapper(this.masters, master => master.slice(options))
    return new VFM(json)
  }

  selectMetrics(layer) { return mapVal(this.metrics, ({ layers }) => layers[layer]) }

  metricSeries(layer) {
    const metrics = this.selectMetrics(layer)
    const kerningClasses = this.masters[layer]?.kerningClasses
    const kerningPairs = this.masters[layer]?.kerningPairs
    return new MetricSeries(metrics, kerningClasses, kerningPairs)
  }

  metricTable(scope = Scope.Upper, headMapper, rowSelector) {
    const layers = this.layers
    const head = [ GLYPH ].concat(layers.map(headMapper)) // [ layer + '.' + L, layer + '.' + R ]
    const rowsIter = indexed(
      this.metrics,
      Latin.factory(scope),
      (glyph, layerBodies) => layers.map(
        layer => [ glyph ].concat(rowSelector(layerBodies[layer])),
      ),
    )
    return Table.build(head, collect(rowsIter), scopeName(scope))
  }

  sidebearingTable2(scope = Scope.Upper) {
    const table = this.metricTable(
      scope,
      layer => [ layer + '.' + L, layer + '.' + R ],
      metric => [ metric.relLSB, metric.relRSB ],
    )
    table.head = table.head.flat().map(weightToShort)
    table.rows = table.rows.map(row => row.flat())
    table.headward.grow(GLYPH, glyphToLabel, LABEL, GLYPH)
    table.headward.grow(GLYPH, Latin.letterOrEmpty, LETTER, LABEL)
    return table
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
}
