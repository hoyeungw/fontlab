export const schemeToLex = scheme => {
  const o = {}
  for (let y in scheme) {
    if (Array.isArray(scheme[y])) for (let x of scheme[y]) {
      if (!(x in o)) o[x] = y
    }
  }
  return o
}