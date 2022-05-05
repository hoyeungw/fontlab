import { round }    from '@aryth/math'
import { NUM, STR } from '@typen/enum-data-types'

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
  get relLSB() { return this.metricsLeft ?? round(this.lsb) }
  get relRSB() { return this.metricsRight ?? round(this.rsb) }
  set relLSB(v) {
    if (typeof v === NUM) { return this.lsb = v }
    if (typeof v === STR) {
      let n = parseFloat(v.replace(/^=/g, ''))
      return isNaN(v - n) ? (this.metricsLeft = v) : (this.lsb = n)
    }
  }
  set relRSB(v) {
    if (typeof v === NUM) { return this.rsb = v }
    if (typeof v === STR) {
      let n = parseFloat(v.replace(/^=/g, ''))
      return isNaN(v - n) ? (this.metricsRight = v) : (this.rsb = n)
    }
  }
  relSB() { return { lsb: this.relLSB, rsb: this.relRSB } }
  absSB() { return { lsb: this.lsb, rsb: this.rsb } }
  toString() {
    return `[sb] (${this.lsb},${this.rsb}) [wd] (${this.width}) [bound] ({ xmin:${this.xmin},xmax:${this.xmax},ymin:${this.ymin},ymax:${this.ymax})`
  }
}