import { BESQUE, NORSE, PINE } from '@palett/presets'
import { DecoCrostab }         from '@spare/logger'

// [number, rows-text, axis-text],
const PRESETS = [ BESQUE, PINE, NORSE ]

/**
 *
 * @param {Crostab} crostab
 * @returns {*}
 */
export const decoPairsCrostab = crostab => {
  const [ h, w ] = [ crostab.height, crostab.width ]
  const options = { presets: PRESETS }
  if (w > 24 || h > 26) {
    Object.assign(options, { top: 18, bottom: 8, left: 16, right: 8 })
  }
  return crostab |> DecoCrostab(options)
}