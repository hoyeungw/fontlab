import { round }        from '@aryth/math'
import { NUM, STR }     from '@typen/enum-data-types'
import { parseNum }     from '@typen/num-strict'
import { calc }         from './calc'
import { metricToJson } from './json'


export class Metric {
  lsb
  rsb
  lpt
  rpt
  width
  xhi
  xlo
  yhi
  ylo
  constructor(metrics) {
    this.lsb = metrics.lsb
    this.rsb = metrics.rsb
    this.lpt = metrics.metricsLeft
    this.rpt = metrics.metricsRight
    this.width = metrics.width
    this.xhi = metrics.xmax
    this.xlo = metrics.xmin
    this.yhi = metrics.ymax
    this.ylo = metrics.ymin
  }
  static build(metrics) { return new Metric(metrics) }

  get relLSB() { return this.lpt?.length ? this.lpt : round(this.lsb) }
  get relRSB() { return this.rpt?.length ? this.rpt : round(this.rsb) }
  set sb(v) { this.lsb = v, this.rsb = v }
  set pt(v) { this.lpt = v, this.rpt = v }
  update(side, value, cfg) {
    const label = (side & 1) ? 'l' : (side & 2) ? 'r' : ''
    const SB = label + 'sb', PT = label + 'pt'
    if (typeof value === NUM) { return this[SB] = value }
    if (typeof value === STR && (value = value.trim()).length && /\w/.test(value)) {
      const [ eq, exp ] = /^=/g.test(value) ? [ '=', value.replace(/=/g, '') ] : [ null, value ]
      const tbd = /[a-z\+\-\*\/]/gi.test(exp)
      const val = tbd && cfg ? calc.call(cfg, exp) : parseNum(exp)
      if (!isNaN(val)) { this[SB] = round(parseNum(val)) }
      if (eq || tbd) { this[PT] = value }
    }
    return this
  }
  toJson() { return metricToJson(this) }
  toString() {
    return `[sb] (${this.lsb},${this.rsb}) [wd] (${this.width}) [x] (${this.xlo},${this.xhi}) [y] (${this.ylo},${this.yhi})`
  }
}