import {
  decoFlat,
  DecoObject,
  DecoVector,
} from '@spare/logger'

export const decoKerningClasses = DecoVector({ read: x => decoFlat(x?.toObject()) })
const decoGroupedEntries = DecoObject({ read: x => decoFlat(x?.toObject()) })
export const decoGrouped = o => decoGroupedEntries(o).replace(/ +/g, ' ')