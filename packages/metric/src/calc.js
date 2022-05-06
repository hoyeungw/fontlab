import { calculator } from '@aryth/calculator'
import { round }      from '@aryth/math'
import { valid }      from '@typen/nullish'

export function calc(exp) {
  try {
    return valid(exp = calculator.call(this, exp)) ? round(exp) : NaN
  } catch (e) {
    return NaN
  }
}