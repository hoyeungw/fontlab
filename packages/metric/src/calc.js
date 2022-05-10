import { calculator } from '@aryth/calculator'
import { round }      from '@aryth/math'
import { valid }      from '@typen/nullish'

export function calc(expr) {
  try {
    return valid(expr = calculator.call(this, expr)) ? round(expr) : NaN
  } catch (e) {
    return NaN
  }
}