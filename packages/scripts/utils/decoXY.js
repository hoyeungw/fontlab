import { ros } from '@spare/xr'
import { STR } from '@typen/enum-data-types'

const REG = /(?<=[a-z\d])[\W_](?=[a-z\d])/gi

export const decoXY = (xy) => {
  if (Array.isArray(xy)) return `${ros(xy[0])} x ${ros(xy[1])}`
  if (typeof xy === STR && (xy = xy.split(REG))) return `${ros(xy[0])} x ${ros(xy[1])}`
}