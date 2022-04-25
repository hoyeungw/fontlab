import { makeReplaceable } from '@spare/translator'

export const WEIGHTS_TO_INITIALS = {
  Hairline: 'HL',
  Thin: 'Th',
  ExtraLight: 'ExtLt',
  Light: 'Light',
  Regular: 'Reg',
  Medium: 'Med',
  SemiBold: 'SemBd',
  Bold: 'Bold',
  Black: 'Black',
}

const REPLACEABLE = Object.entries(WEIGHTS_TO_INITIALS)
  .map(([k, v]) => [new RegExp(k, 'gi'), v]) |> makeReplaceable

export const shortenWeight = (weight) => {
  weight = weight.replace(/\s+/g, '')
  // logger(weight)
  weight = weight.replace(REPLACEABLE)
  return weight
}