import { DEFAULT_OPTIONS } from './DEFAULT_OPTIONS'
import { groupToJson }     from './groupToJson'

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
