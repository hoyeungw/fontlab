import { DEFAULT_OPTIONS }          from '../asset/DEFAULT_OPTIONS'
import { _1ST, _2ND, is1st, is2nd } from '../asset/Side'

/**
 * @param {Master} master
 * @param groups
 * @param pairs
 * @returns {{}}
 */
export function masterToJson(master, { groups, pairs } = DEFAULT_OPTIONS) {
  const o = {}
  if (groups) { o.kerningClasses = master.groups.map(groupToJson) }
  if (pairs) { o.pairs = master.pairs }
  return o
}

export function groupToJson(group) {
  const o = {}
  if (is1st(group)) o[_1ST] = true
  if (is2nd(group)) o[_2ND] = true
  o.name = group.name
  o.names = group.names
  return o
}