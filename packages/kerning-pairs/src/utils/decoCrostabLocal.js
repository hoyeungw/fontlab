import { BESQUE, NORSE, PINE } from '@palett/presets'
import { decoCrostab }         from '@spare/logger'
import { indexed }             from '@vect/object-mapper'
import { LF }                  from '@texting/enum-chars'
import { $ }                   from '@spare/xr'
import { splitCamel }          from '@texting/splitter'
import { decoXY }              from './decoXY.js'

// [number, rows-text, axis-text],
const PRESETS = { str: BESQUE, pos: PINE, neg: NORSE }


export const decoCrostabTitle = crostab => {
  const [ labelX, labelY ] = splitCamel(crostab.title)
  return decoXY(labelX, labelY)
}

/**
 *
 * @param {Crostab} crostab
 * @returns {*}
 */
export const decoCrostabLocal = crostab => {
  const options = { pres: PRESETS }
  if (crostab.width > 24 || crostab.height > 26) { Object.assign(options, { top: 18, bottom: 8, left: 16, right: 8 }) }
  const title = $.fontlab('kerning pairs').scope(decoCrostabTitle(crostab)).size(`${crostab.height} x ${crostab.width}`)
  const body = crostab.height && crostab.width ? decoCrostab.call(options, crostab) : '(ø)'
  return title + LF + body
}

export const decoCrostabIterable = crostabIterable => {
  let result = ''
  for (const [ key, crostab ] of indexed(crostabIterable)) {
    const [ labelX, labelY ] = splitCamel(key)
    result += $.fontlab('kerning pairs').scope(decoXY(labelX, labelY)).size(`${crostab.height} x ${crostab.width}`) + LF
    result += ((crostab.height && crostab.width) ? decoCrostabLocal(crostab) : '(ø)') + LF
  }
  return result
}