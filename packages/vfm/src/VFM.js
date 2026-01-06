import { Master }            from '@fontlab/master'
import { Metric }            from '@fontlab/metric'
import { mapKeyVal, mapVal } from '@vect/object-mapper'
import { MetricSeries }      from '@fontlab/metric-series'

export class VFM {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Master>} */                                masters // layer → masters
  /** @type {Object<string,Object<string,Object<string,Metric>>>} */  metrics // glyph → attr → layer → metrics
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

  selectMetrics(layer) { return mapVal(this.metrics, metric => metric.layers[layer]) }

  metricSeries(layer) {
    const metrics = this.selectMetrics(layer)
    const master = this.masters[layer]
    const kerningPairs = master.pairs
    const kerningClasses = master.kerningClasses
    return new MetricSeries(metrics, kerningClasses, kerningPairs)
  }
}
