import { mapVal } from '@vect/object-mapper'

export function metricToJson(metric) {
  let json = {
    lsb: metric.lsb,
    rsb: metric.rsb,
    width: metric.width,
    xmax: metric.xhi,
    xmin: metric.xlo,
    ymax: metric.yhi,
    ymin: metric.ylo,
  }
  if (metric.lpt?.length) json.metricsLeft = metric.lpt
  if (metric.rpt?.length) json.metricsRight = metric.rpt
  return json
}

export function embedLayerToMetrics(layerToMetrics) {
  return {
    layers: mapVal(layerToMetrics, metricToJson)
  }
}