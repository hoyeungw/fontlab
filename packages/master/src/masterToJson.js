import { groupToJson }     from '@fontlab/kerning-class'
import { CONVERT_OPTIONS } from '../asset'

/**
 * @param {Master} master
 * @returns {{}}
 */
export function masterToJson(master) {
  const { groups, pairs } = this ?? CONVERT_OPTIONS
  const o = {}
  if (groups) o.kerningClasses = master.kerningClasses.map(groupToJson)
  if (pairs) o.pairs = master.pairs
  return o
}

export function masterToClass(name, master) {
  return { name: name ?? master.name, kerningClasses: master.kerningClasses.map(groupToJson) }
}