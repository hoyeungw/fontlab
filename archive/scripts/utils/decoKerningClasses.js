import { decoFlat, decoObject, decoVector } from '@spare/logger'
import { mapVal }                           from '@vect/object-mapper'
import { mapper }                           from '@vect/vector-mapper'

// vfmToXlsx const decoKerningClasses = DecoVector({ read: x => decoFlat(x?.toObject()) })
// vfmToXlsx const decoGroupsEntries = DecoObject({ read: x => decoFlat(x?.toObject()) })
// vfmToXlsx const decoGroups = o => decoGroupsEntries(o).replace(/ +/g, ' ')

export const decoKerningClasses = v => decoVector(mapper(v, v => decoFlat(v?.toObject())))
export const decoGroupsEntries = o => decoObject(mapVal(o, v => decoFlat(v?.toObject)))
export const decoGroups = o => decoGroupsEntries(o).replace(/ +/g, ' ')