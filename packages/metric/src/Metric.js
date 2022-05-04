export class Metric {
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
  static build(metrics) { return new Metric(metrics) }
  relSB() { return { lsb: this.metricsLeft ?? this.lsb, rsb: this.metricsRight ?? this.rsb } }
  absSB() { return { lsb: this.lsb, rsb: this.rsb } }
  toString() {
    return `[sb] (${this.lsb},${this.rsb}) [wd] (${this.width}) [bound] ({ xmin:${this.xmin},xmax:${this.xmax},ymin:${this.ymin},ymax:${this.ymax})`
  }
}