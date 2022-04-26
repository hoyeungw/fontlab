import { Side } from '../../asset/Side'

export const groupsToSurject = (groups, side) => {
  if (side === Side.Verso) groups = groups.filter((group) => group['1st'])
  if (side === Side.Recto) groups = groups.filter((group) => group['2nd'])
  const surject = { '-': '-' }
  for (let { name, names } of groups)
    for (let glyph of names)
      surject[glyph] = name
  return surject
}