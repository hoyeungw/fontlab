import { Table }                        from '@analys/table'
import { Latin, Scope }                 from '@fontlab/latin'
import { parseNum }                     from '@typen/numeral'
import { indexed }        from '@vect/nested'
import { GROUPS_CHALENE } from '../../asset/GROUPS_CHALENE'
import { Side }           from '../../asset/Side'
import { groupsToSurject }              from './groupsToSurject'

export function pairsToTable(source, {
  scope = { x: Scope.Upper, y: Scope.Upper },
  groupScheme = GROUPS_CHALENE
} = {}) {
  const [groupV, groupR] = [groupsToSurject(groupScheme, Side.Verso), groupsToSurject(groupScheme, Side.Recto)]
  const [filterV, filterR] = [Latin.filterFactory(scope.x), Latin.filterFactory(scope.y)]

  const enumerator = indexed(source, {
    by: (verso, recto, kern) => filterV(verso) && filterR(recto),
    to: (verso, recto, kern) => [verso, recto, parseNum(kern), Latin.letter(verso), Latin.letter(recto)]
  })

  const table = Table.from({
    head: ['glyph.v', 'glyph.r', 'kerning', 'letter.v', 'letter.r'],
    rows: [...enumerator],
    title: 'pairs'
  })

  table.proliferateColumn([
    { key: 'letter.v', to: x => groupV[x] ?? '-', as: 'group.v' },
    { key: 'letter.r', to: x => groupR[x] ?? '-', as: 'group.r' }
  ], { nextTo: 'letter.r', mutate: true })

  return table
}