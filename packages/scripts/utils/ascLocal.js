import { stringValue } from '@fontlab/latin'

export function ascLocal(a, b) { return a.length === b.length ? stringValue(a) - stringValue(b) : a.length - b.length }