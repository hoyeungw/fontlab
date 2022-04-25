import { mapper } from '@vect/object-mapper'

export const DEFAULT_OPTIONS = { kerningClasses: true, pairs: true, metrics: true }
/***
 *
 * @param {Profile} vfm
 * @param options
 * @returns {{dataType: (string|string|string|*)}}
 */
export function vfmToJson(vfm, options = DEFAULT_OPTIONS) {
  const o = { dataType: vfm.dataType, }
  if (options.kerningClasses || options.pairs) o.masters = mapper(vfm.layerToKerning, kerning => kerningToJson(kerning, options))
  if (options.metrics) o.metrics = mapper(vfm.glyphLayerToMetrics, layerToMetrics => ({ layers: layerToMetrics }))
  o.upm = vfm.upm
  return o
}


/**
 * @param {Kerning} kerning
 * @param kerningClasses
 * @param pairs
 * @returns {{}}
 */
export function kerningToJson(kerning, { kerningClasses, pairs } = DEFAULT_OPTIONS) {
  const o = {}
  if (kerningClasses) { o.kerningClasses = kerning.kerningClasses.map(kerningClassToJson) }
  if (pairs) { o.pairs = kerning.pairs }
  return o
}

export function kerningClassToJson(kerningClass) {
  const o = {}
  if (kerningClass._1st) o['1st'] = kerningClass._1st
  if (kerningClass._2nd) o['2nd'] = kerningClass._2nd
  o.name = kerningClass.name
  o.names = kerningClass.names
  return o
}