import { decoFlat, DecoObject, DecoVector } from '@spare/logger'

export const decoKerningClasses = DecoVector({ read: x => x.toObject() |> decoFlat })
const decoGroupedEntries = DecoObject({ read: x => x.toObject() |> decoFlat })
export const decoGrouped = o => decoGroupedEntries(o).replace(/ +/g, ' ')