import { mapper }          from '@vect/object-mapper'
import { DEFAULT_OPTIONS } from './DEFAULT_OPTIONS'
import { masterToJson }    from './masterToJson'

/***
 *
 * @param {Profile} profile
 * @param options
 * @returns {{dataType: (string|string|string|*)}}
 */
export function profileToJson(profile, options = DEFAULT_OPTIONS) {
  const o = { dataType: profile.dataType, }
  if (options.groups || options.pairs) o.masters = mapper(profile.layerToKerning, kerning => masterToJson(kerning, options))
  if (options.metrics) o.metrics = mapper(profile.glyphLayerToMetrics, layerToMetrics => ({ layers: layerToMetrics }))
  o.upm = profile.upm
  return o
}