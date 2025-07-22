import { makeReplaceable } from '@spare/translator'

export const DEFINITION = [
  [ 'Hairline', 'HL' ],
  [ 'Thin', 'Th' ],
  [ 'ExtraLight', 'ExtLt' ],
  [ 'Light', 'Light' ],
  [ 'Regular', 'Reg' ],
  [ 'Medium', 'Med' ],
  [ 'SemiBold', 'SemBd' ],
  [ 'Bold', 'Bold' ],
  [ 'Black', 'Black' ],
]

const FLAG = 'gi'
export const WEIGHT_TO_INITIAL = makeReplaceable(DEFINITION.map(([ k, v ]) => [ new RegExp(k, FLAG), v ]))
export const INITIAL_TO_WEIGHT = makeReplaceable(DEFINITION.map(([ k, v ]) => [ new RegExp(v, FLAG), k ]))

export const weightToShort = (weight) => weight.replace(/\s+/g, '').replace(WEIGHT_TO_INITIAL)

export const shortToWeight = (short) => short.replace(/\s+/g, '').replace(INITIAL_TO_WEIGHT)