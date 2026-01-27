import { CONVERT_OPTIONS }    from '@fontlab/constants'
import { kerningClassToJson } from '@fontlab/kerning-class'

/**
 * @param {Master} master
 * @returns {{}}
 */
export function masterToJson(master) {
  const { kerningClasses, pairs } = this ?? CONVERT_OPTIONS
  const o = {}
  if (kerningClasses) o.kerningClasses = master.kerningClasses.map(kerningClassToJson)
  if (pairs) o.pairs = master.pairs.data
  return o
}

export function masterToClass(name, master) {
  return { name: name ?? master.name, kerningClasses: master.kerningClasses.map(kerningClassToJson) }
}