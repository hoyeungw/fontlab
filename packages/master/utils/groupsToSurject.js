export const groupsToSurject = (groups) => {
  if (!groups?.length) return {}
  const surject = {}
  for (let { name, names } of groups) {
    for (let glyph of names)
      surject[glyph] = name
  }
  return surject
}