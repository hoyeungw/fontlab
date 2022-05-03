import { masterToJson }    from '@fontlab/master'
import { mapValues }       from '@vect/object-mapper'
import { CONVERT_OPTIONS } from '../../asset'

/***
 *
 * @param {Profile} profile
 * @param options
 * @returns {{dataType: (string|string|string|*)}}
 */
export function profileToJson(profile, options = CONVERT_OPTIONS) {
  const o = { dataType: profile.dataType, }
  if (options.groups || options.pairs) o.masters = mapValues(profile.layerToMaster, master => masterToJson(master, options))
  if (options.metrics) o.metrics = mapValues(profile.glyphLayerToMetric, layerToMetrics => ({ layers: layerToMetrics }))
  o.upm = profile.upm
  return o
}
