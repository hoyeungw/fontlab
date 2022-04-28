export class Metrics {
  lsb
  rsb
  metricsLeft
  metricsRight
  width
  xmax
  xmin
  ymax
  ymin
  constructor(metrics) {
    this.lsb = metrics.lsb
    this.rsb = metrics.rsb
    this.metricsLeft = metrics.metricsLeft
    this.metricsRight = metrics.metricsRight
    this.width = metrics.width
    this.xmax = metrics.xmax
    this.xmin = metrics.xmin
    this.ymax = metrics.ymax
    this.ymin = metrics.ymin
  }
  static build(metrics) { return new Metrics(metrics) }
  toString() {
    return `[sb] (${this.lsb},${this.rsb}) [wd] (${this.width}) [bound] ({ xmin:${this.xmin},xmax:${this.xmax},ymin:${this.ymin},ymax:${this.ymax})`
  }
}