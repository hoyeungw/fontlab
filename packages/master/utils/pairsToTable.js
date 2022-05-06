import { groupedToSurject } from '@analys/convert'
import { Table }            from '@analys/table'
import { Scope }            from '@fontlab/enum-scope'
import { Side }             from '@fontlab/enum-side'
import { Grouped }          from '@fontlab/kerning-class'
import { Latin }            from '@fontlab/latin'
import { parseNum }         from '@typen/numeral'
import { indexed }          from '@vect/nested'

export function pairsToTableRegrouped(pairs, {
  scope = { x: Scope.Upper, y: Scope.Upper },
  groupScheme
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

  const regrouped = Grouped.from(groupScheme)
  const glyphToGroupX = Grouped.select(this.grouped, Side.Verso)|> groupedToSurject
  const glyphToGroupY = Grouped.select(this.grouped, Side.Recto)|> groupedToSurject
  table.proliferateColumn([
    { key: 'glyph.v', to: x => glyphToGroupX[x] ?? '', as: 'group.v' },
    { key: 'glyph.r', to: x => glyphToGroupY[x] ?? '', as: 'group.r' }
  ], { nextTo: 'letter.r', mutate: true })
  return table
}