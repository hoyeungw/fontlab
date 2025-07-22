import { isNumeric, parseNum } from '@typen/num-strict'

export function valIsNum(_, v) { return isNumeric(v) }

export function valToNum(k, v) { return [ k, parseNum(v) ] }