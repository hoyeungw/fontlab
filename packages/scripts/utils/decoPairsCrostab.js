import { BESQUE, NORSE, PINE }                               from '@palett/presets'
import { DecoCrostab }                                       from '@spare/logger'
import { NUM_DICT, parseGlyph, REG_CURR, REG_NUM, REG_PUNC } from './desToReal'

// [number, rows-text, axis-text],
const PRESETS = [ BESQUE, PINE, NORSE ]

/**
 *
 * @param {Crostab} crostab
 * @returns {*}
 */
export const decoPairsCrostab = crostab => {
  const [ h, w ] = crostab.size
  function selectLabels(list) {
    const listS = list.filter(x => x.length <= 2)
    const listN = list.filter(x => REG_NUM.test(x)).sort((a, b) => NUM_DICT[a] - NUM_DICT[b])
    const listP = list.filter(x => REG_PUNC.test(x))
    const listC = list.filter(x => REG_CURR.test(x))
    return [ ...listS, ...listN, ...listP, ...listC, ]
  }
  const options = { presets: PRESETS }
  if (w > 32 || h > 48) {
    Object.assign(options, { top: 18, bottom: 8, left: 16, right: 12 })
    const side = selectLabels(crostab.side)
    const head = selectLabels(crostab.head)
    crostab = crostab.select({ side, head, mutate: false })
  }
  return crostab.mutateSide(parseGlyph).mutateBanner(parseGlyph) |> DecoCrostab(options)
}