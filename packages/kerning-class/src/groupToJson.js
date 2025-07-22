import { hasLeft, hasRight } from '@fontlab/enum-side'


export function groupToJson(group) {
  // group |> deco|> says['group']
  const o = {}
  if (hasLeft(group)) o['1st'] = true
  if (hasRight(group)) o['2nd'] = true
  o.name = group.name
  o.names = group.slice()
  return o
}