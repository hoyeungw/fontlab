import { makeReplaceable } from '@spare/translator'
import { bracket }         from '@texting/bracket'

export const REG_NUM = /^(?:zero|one|two|three|four|five|six|seven|eight|nine|ten)$/g
export const REG_PUNC = /^(?:period|comma|quot|guil|brac|paren|hyph|under|exclam|quest)|(?:bar|slash|dash|colon|tilde)$/g
export const REG_CURR = /^(?:currency|dollar|Euro|sterling|yen|cent)$/g
export const REG_LEFT = /(?<=.)left/g
export const REG_RIGHT = /(?<=.)right/g
export const REG_BASE = /(?<=.)base/g
export const REG_SINGLE = /(?<=.)single?/g
export const REG_DOUBLE = /(?<=.)lemot|dbl/g
export const NUM_DICT = {
  'zero': 0,
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
}
export const CURR_DICT = {
  currency: '¤',
  dollar: '$',
  Euro: '€',
  sterling: '£',
  yen: '¥',
  cent: '¢',
}
export const BRAC_DICT = {
  paren: '()',
  bracket: '[]',
  brace: '{}',
  guilsingl: '<>',
  guillemot: '«»'
}
export const FREQ_PUNC_DICT = {
  at: '@',
  space: ' ',
  ellipsis: '…',
  period: '.',
  comma: ',',
  hyphen: '-',
  underscore: '_',
  endash: '–',
  emdash: '—',
  slash: '/',
  backslash: '\\',
  colon: ':',
  semicolon: ';',
  bar: '|'
}
export const chooseQuote = (match, key, tail) => {
  if (REG_DOUBLE.test(tail)) {
    if (REG_LEFT.test(tail)) return '“'
    if (REG_RIGHT.test(tail)) return '”'
    if (REG_BASE.test(tail)) return '„'
    return '"'
  }
  else {
    if (REG_LEFT.test(tail)) return '‘'
    if (REG_RIGHT.test(tail)) return '’'
    if (REG_BASE.test(tail)) return '‚'
    return '\''
  }
}
export const chooseBrac = (match, key, tail) => {
  let pair = BRAC_DICT[key]
  if (!pair) return match
  if (tail === 'left') return pair[0]
  if (tail === 'right') return pair[1]
  return match
}
export const chooseExclamQuest = (match, key, tail) => {
  if (key === 'exclam') return tail === 'down' ? '¡' : '!'
  if (key === 'quest') return tail === 'down' ? '¿' : '?'
  return match
}
export const PUNC_ENTS = [
  [ /^(quote)(.*)/g, chooseQuote ],
  [ /^((?:paren|brac|guil).*)(left|right)/g, chooseBrac ],
  [ /^(exclam|quest).*((?:down)?)/g, chooseExclamQuest ],
  [ /tilde$/g, '[~]' ],
  [ /(?<=.)single?/g, '.1' ],
  [ /(?<=.)lemot|dbl/g, '.2' ],
  [ /(?<=.)down/g, '.d' ],
  [ /(?<=.)left/g, '.l' ],
  [ /(?<=.)right/g, '.r' ],
  [ /(?<=.)base/g, '.bs' ],
  [ /greater/g, '>' ],
  [ /less/g, '<' ],
  [ /equal/g, '=' ],
] |> makeReplaceable

export const brOnPunc = tx => (/^[^a-zA-Z]$/.test(tx) ? bracket(tx) : tx)
export const parseGlyph = tx => {
  if (tx in NUM_DICT) return NUM_DICT[tx]
  if (tx in CURR_DICT) return CURR_DICT[tx]
  if (tx in FREQ_PUNC_DICT) return brOnPunc(FREQ_PUNC_DICT[tx])
  return tx.replace(PUNC_ENTS, brOnPunc)
}



