import { asc } from '@fontlab/latin'

export const glyphGroupAscending = (a, b) => a.side === b.side ? asc(a.name, b.name) : a.side - b.side