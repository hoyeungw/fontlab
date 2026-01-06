import { ros } from '@spare/xr'
import { STR } from '@typen/enum-data-types'

const REG = /(?<=[a-z\d])[\W_](?=[a-z\d])/gi

export const decoXY = (a, b) => {
  if (Array.isArray(a)) return `${ros(a[0].toString())} x ${ros(a[1].toString())}`
  if (typeof b === STR) return `${ros(a)} x ${ros(b)}`
  if (typeof a === STR && (a = a.split(REG))) return `${ros(a[0])} x ${ros(a[1])}`
}