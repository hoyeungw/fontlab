import { groupToJson }     from '@fontlab/group'
import { CONVERT_OPTIONS } from '../asset'

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