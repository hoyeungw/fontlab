// noinspection JSBitwiseOperatorUsage,CommaExpressionJS,RegExpRedundantEscape

import { round }        from '@aryth/math'
import { parseNum }     from '@typen/num-strict'
import { isNumeric }    from '@typen/numeral'
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
  update(side, expr, dict) {
    side = (side & 1) ? 'l' : (side & 2) ? 'r' : ''
    const SBKEY = side + 'sb', PTKEY = side + 'pt'
    if (isNumeric(expr)) { return this[SBKEY] = parseNum(expr) }
    if (/\w/.test(expr = expr?.trim())) { // input !== '', input !== '=', input contains [a-zA-Z0-9_]
      this[PTKEY] = expr
      if (isNumeric(expr = calc.call(dict, expr))) { this[SBKEY] = round(expr) }
    }
    return this
  }
  toJson() { return metricToJson(this) }
  toString() {
    return `[sb] (${this.lsb},${this.rsb}) [wd] (${this.width}) [x] (${this.xlo},${this.xhi}) [y] (${this.ylo},${this.yhi})`
  }
}