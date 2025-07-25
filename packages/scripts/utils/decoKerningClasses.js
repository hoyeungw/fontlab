import { decoFlat, decoObject, decoVector } from '@spare/logger'
import { mapVal }                           from '@vect/object-mapper'
import { mapper }                           from '@vect/vector-mapper'

// originToProcess const decoKerningClasses = DecoVector({ read: x => decoFlat(x?.toObject()) })
// originToProcess const decoGroupedEntries = DecoObject({ read: x => decoFlat(x?.toObject()) })
// originToProcess const decoGrouped = o => decoGroupedEntries(o).replace(/ +/g, ' ')

export const decoKerningClasses = v => decoVector(mapper(v, v => decoFlat(v?.toObject())))
export const decoGroupedEntries = o => decoObject(mapVal(o, v => decoFlat(v?.toObject)))
export const decoGrouped = o => decoGroupedEntries(o).replace(/ +/g, ' ')