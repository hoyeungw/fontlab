import { _1ST, _2ND, CONVERT_OPTIONS, is1st, is2nd } from '../asset'

/**
 * @param {Master} master
 * @param groups
 * @param pairs
 * @returns {{}}
 */
export function masterToJson(master, { groups, pairs } = CONVERT_OPTIONS) {
  const o = {}
  if (groups) { o.kerningClasses = Object.values(master.grouped).map(groupToJson) }
  if (pairs) { o.pairs = master.pairs }
  return o
}

export function groupToJson(group) {
  // group |> deco|> says['group']
  const o = {}
  if (is1st(group)) o[_1ST] = true
  if (is2nd(group)) o[_2ND] = true
  o.name = group.name
  o.names = group.slice()
  return o
}