export const schemeToDictVerso = (classes) => {
  const o = {}
  for (let { name, names } of classes.filter((_) => _['1st'])) {
    for (let alphabet of names) o[alphabet] = name
  }
  return o
}

export const schemeToDictRecto = (classes) => {
  const o = {}
  for (let { name, names } of classes.filter((_) => _['2nd'])) {
    for (let alphabet of names) o[alphabet] = name
  }
  return o
}