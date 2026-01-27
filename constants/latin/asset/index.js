import { merge }              from '@vect/vector-algebra'
import { GROUP_SCHEME_LOWER } from './GROUP_SCHEME_LOWER.js'
import { GROUP_SCHEME_UPPER } from './GROUP_SCHEME_UPPER.js'

export { DIACRITICS }    from './DIACRITICS.js'
export { ORTHO_FRENCH }  from './ORTHO_FRENCH.js'
export { ORTHO_ITALIAN } from './ORTHO_ITALIAN.js'

export { GROUP_SCHEME_UPPER }
export { GROUP_SCHEME_LOWER }

export const ALPHABET_LOWER = Object.keys(GROUP_SCHEME_LOWER)
export const ALPHABET_UPPER = Object.keys(GROUP_SCHEME_UPPER)
export const ALPHABET = merge(ALPHABET_UPPER, ALPHABET_LOWER)
