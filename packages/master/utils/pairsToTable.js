import { groupedToSurject }     from '@analys/convert'
import { Table }                from '@analys/table'
import { Latin, Scope }         from '@fontlab/latin'
import { parseNum }             from '@typen/numeral'
import { indexed }              from '@vect/nested'
import { GROUPS_CHALENE, Side } from '../asset'
import { Grouped }              from '../src/Grouped'

const trimKey = x => x.replace(/@?([A-Za-z_]+)\d*/, (_, ph) => ph)

export function pairsToTable(scopeX = Scope.Upper, scopeY = Scope.Upper) {
  const filterX = Latin.filterFactory(scopeX)
  const filterY = Latin.filterFactory(scopeY)
  const enumerator = indexed(this.pairs, {
    by: (x, y, kern) => filterX(trimKey(x)) && filterY(trimKey(y)),
    to: (x, y, kern) => [ x, y, parseNum(kern) ]
  })

  const table = Table.from({
    head: [ 'group.v', 'group.r', 'kerning' ],
    rows: [ ...enumerator ],
    title: 'pairs'
  })
  // table  |> decoTable  |> logger

  return table
}

export function pairsToTableRegrouped(pairs, {
  scope = { x: Scope.Upper, y: Scope.Upper },
  groupScheme = GROUPS_CHALENE
} = {}) {
  const filterX = Latin.filterFactory(scope.x)
  const filterY = Latin.filterFactory(scope.y)
  const enumerator = indexed(pairs, {
    by: (verso, recto, kern) => filterX(verso) && filterY(recto),
    to: (verso, recto, kern) => [ verso, recto, parseNum(kern), Latin.letterOrSelf(verso), Latin.letterOrSelf(recto) ]
  })

  const table = Table.from({
    head: [ 'glyph.v', 'glyph.r', 'kerning', 'letter.v', 'letter.r' ],
    rows: [ ...enumerator ],
    title: 'pairs'
  })

  const regrouped = Grouped.fromSamples(groupScheme)
  const glyphToGroupX = Grouped.select(this.grouped, Side.Verso)|> groupedToSurject
  const glyphToGroupY = Grouped.select(this.grouped, Side.Recto)|> groupedToSurject
  table.proliferateColumn([
    { key: 'glyph.v', to: x => glyphToGroupX[x] ?? '', as: 'group.v' },
    { key: 'glyph.r', to: x => glyphToGroupY[x] ?? '', as: 'group.r' }
  ], { nextTo: 'letter.r', mutate: true })

  return table
}