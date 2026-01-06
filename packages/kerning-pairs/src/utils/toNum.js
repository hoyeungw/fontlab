import { parseNum } from '@typen/num-strict'

export function toNum(x, y, v) { return [ x, y, parseNum(v) ] }
