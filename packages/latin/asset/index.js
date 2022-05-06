import { merge }              from '@vect/vector-merge'
import { GROUP_SCHEME_LOWER } from './GROUP_SCHEME_LOWER'
import { GROUP_SCHEME_UPPER } from './GROUP_SCHEME_UPPER'

export { DIACRITICS }    from './DIACRITICS'
export { ORTHO_FRENCH }  from './ORTHO_FRENCH'
export { ORTHO_ITALIAN } from './ORTHO_ITALIAN'

export { GROUP_SCHEME_UPPER }
export { GROUP_SCHEME_LOWER }
export const ALPHABET_LOWER = Object.keys(GROUP_SCHEME_LOWER)
export const ALPHABET_UPPER = Object.keys(GROUP_SCHEME_UPPER)
export const ALPHABET = merge(ALPHABET_UPPER, ALPHABET_LOWER)

// export { ALPHABET_LOWER }     from './ALPHABET_LOWER'
// export { ALPHABET_UPPER }     from './ALPHABET_UPPER'