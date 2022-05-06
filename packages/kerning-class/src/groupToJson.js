import { is1st,is2nd,_1ST, _2ND } from '@fontlab/enum-side'


export function groupToJson(group) {
  // group |> deco|> says['group']
  const o = {}
  if (is1st(group)) o[_1ST] = true
  if (is2nd(group)) o[_2ND] = true
  o.name = group.name
  o.names = group.slice()
  return o
}