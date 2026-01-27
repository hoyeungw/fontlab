import { asc } from '@fontlab/latin'

export const kerningClassAscending = (a, b) => a.side === b.side ? asc(a.name, b.name) : a.side - b.side