import { groupedToSurject }     from '@analys/convert'
import { Table }                from '@analys/table'
import { Latin, Scope }         from '@fontlab/latin'
import { parseNum }             from '@typen/numeral'
import { indexed }              from '@vect/nested'
import { GROUPS_CHALENE, Side } from '../asset'
import { Grouped }              from '../src/Grouped'

export function pairsToTable(pairs, {
  scope = { x: Scope.Upper, y: Scope.Upper },
  groupScheme = GROUPS_CHALENE
} = {}) {
  const regrouped = Grouped.fromSamples(groupScheme)
  const [ groupedV, groupedR ] = [ Grouped.select(regrouped, Side.Verso), Grouped.select(regrouped, Side.Recto) ]
  const [ surjectV, surjectR ] = [ groupedToSurject(groupedV), groupedToSurject(groupedR) ]
  const [ filterV, filterR ] = [ Latin.filterFactory(scope.x), Latin.filterFactory(scope.y) ]

  const enumerator = indexed(pairs, {
    by: (verso, recto, kern) => filterV(verso) && filterR(recto),
    to: (verso, recto, kern) => [ verso, recto, parseNum(kern), Latin.letter(verso), Latin.letter(recto) ]
  })

  const table = Table.from({
    head: [ 'glyph.v', 'glyph.r', 'kerning', 'letter.v', 'letter.r' ],
    rows: [ ...enumerator ],
    title: 'pairs'
  })

  table.proliferateColumn([
    { key: 'letter.v', to: x => surjectV[x] ?? '', as: 'group.v' },
    { key: 'letter.r', to: x => surjectR[x] ?? '', as: 'group.r' }
  ], { nextTo: 'letter.r', mutate: true })

  return table
}