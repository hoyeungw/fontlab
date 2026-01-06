import { calculator } from '@aryth/calculator'
import { round }      from '@aryth/math'
import { valid }      from '@typen/nullish'

const FORMULA = /[a-zA-Z\+\-\*\/]/

export function calc(expr) {
  try {
    if (!this) return NaN
    if (!FORMULA.test(expr = expr.replace(/^=+/g, ''))) return NaN
    return valid(expr = calculator.call(this, expr)) ? round(expr) : NaN
  } catch (e) {
    return NaN
  }
}