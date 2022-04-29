import { mapValues }                from '@vect/object-mapper'
import { _1ST, _2ND, is1st, is2nd } from '../../../master/asset/Side'
import { DEFAULT_OPTIONS }          from './DEFAULT_OPTIONS'

/***
 *
 * @param {Profile} profile
 * @param options
 * @returns {{dataType: (string|string|string|*)}}
 */
export function profileToJson(profile, options = DEFAULT_OPTIONS) {
  const o = { dataType: profile.dataType, }
  if (options.groups || options.pairs) o.masters = mapValues(profile.layerToMaster, master => masterToJson(master, options))
  if (options.metrics) o.metrics = mapValues(profile.glyphLayerToMetric, layerToMetrics => ({ layers: layerToMetrics }))
  o.upm = profile.upm
  return o
}
