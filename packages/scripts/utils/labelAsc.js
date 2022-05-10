import { asc } from '@fontlab/latin'

const MARK = /^(?:[(.)]|@(.)\d?)$/
const MARK_G = new RegExp(MARK.source, 'g')
export const labelAsc = (a, b) => {
  const at = MARK.test(a), bt = MARK.test(b)
  if (at) {
    if (bt) {
      a = a.replace(MARK_G, (_, x) => x)
      b = b.replace(MARK_G, (_, x) => x)
      return a.localeCompare(b)
    }
    else {
      return asc(a, b)
    }
  }
  else {
    if (bt) {
      return asc(a, b)
    }
    else {
      return a.localeCompare(b)
    }
  }
}