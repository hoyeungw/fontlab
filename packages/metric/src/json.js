export function metricToJson(metric) {
  return {
    lsb: metric.lsb,
    rsb: metric.rsb,
    metricsLeft: metric.lpt,
    metricsRight: metric.rpt,
    width: metric.width,
    xmax: metric.xhi,
    xmin: metric.xlo,
    ymax: metric.yhi,
    ymin: metric.ylo,
  }
}