import { makeReplaceable }     from '@spare/translator'
import { WEIGHTS_TO_INITIALS } from '@fontlab/metrics/asset/WEIGHTS.js'

const REPLACEABLE = Object.entries(WEIGHTS_TO_INITIALS)
  .map(([ k, v ]) => [ new RegExp(k, 'gi'), v ]) |> makeReplaceable

export const shortenWeight = (weight) => {
  weight = weight.replace(/\s+/g, '')
  // logger(weight)
  weight = weight.replace(REPLACEABLE)
  return weight
}