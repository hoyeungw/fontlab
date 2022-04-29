import { mutate }             from '@vect/vector-mapper'
import { is1st, is2nd, Side } from '../asset/Side'

export const groupsToSurject = (groups, side) => {
  if (!groups?.length) return {}
  if (!(groups[0] instanceof Group)) mutate(groups, Group.build)
  if (side === Side.Verso) groups = groups.filter(is1st)
  if (side === Side.Recto) groups = groups.filter(is2nd)
  // groups  |> deco  |> logger
  const surject = {}
  for (let { side, name, names } of groups) {
    // `[side] (${side}) [name] (${name}) [names] (${names})`  |> console.log
    for (let glyph of names)
      surject[glyph] = name
  }
  return surject
}