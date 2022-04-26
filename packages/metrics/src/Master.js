import { AVERAGE }                              from '@analys/enum-pivot-mode'
import { Table }                                from '@analys/table'
import { round }                                from '@aryth/math'
import { Latin, Scope, stringValue }            from '@fontlab/latin'
import { nullish }                              from '@typen/nullish'
import { parseNum }                             from '@typen/numeral'
import { head, indexed, side }                  from '@vect/nested'
import { KERNING_GROUP_SCHEME_CHALENE }         from '../asset/KERNING_GROUP_SCHEME_CHALENE'
import { DEFAULT_OPTIONS }                      from './convert/DEFAULT_OPTIONS'
import { masterToJson }                         from './convert/masterToJson'
import { Group }                                from './Group'
import { schemeToDictRecto, schemeToDictVerso } from './scheme/schemeToDict'

const KERNING_CROSTAB_OPTIONS = {
  scope: { x: Scope.Upper, y: Scope.Upper },
  spec: { x: 'group.v', y: 'group.r', mode: AVERAGE },
  groupScheme: KERNING_GROUP_SCHEME_CHALENE,
}

export class Master {
  groups
  pairs
  constructor(kerning) {
    const classes = (kerning.kerningClasses ?? [])
      .map(Group.build)
      .sort(({ name: a }, { name: b }) => stringValue(a) - stringValue(b))
    this.groups = [...classes.filter(({ _1st }) => _1st), ...classes.filter(({ _2nd }) => _2nd)]
    this.pairs = kerning.pairs
  }
  static build(fontlabKerning) { return new Master(fontlabKerning) }

  get kerningClasses() { return this.groups }
  classes() { return this.groups.map(group => group.toObject()) }
  versos(scope) { return side(this.pairs).filter(Latin.filterFactory(scope)) }
  rectos(scope) { return head(this.pairs).filter(Latin.filterFactory(scope)) }

  pairsToTable({
                 scope = { x: Scope.Upper, y: Scope.Upper },
                 groupScheme = KERNING_GROUP_SCHEME_CHALENE
               } = {}) {
    const [groupV, groupR] = [schemeToDictVerso(groupScheme), schemeToDictRecto(groupScheme)]
    const [filterV, filterR] = [Latin.filterFactory(scope.x), Latin.filterFactory(scope.y)]
    const enumerator = indexed(this.pairs, {
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
    // table  |> decoTable  |> logger
    return table
  }

  crostab({ scope, spec, groupScheme } = KERNING_CROSTAB_OPTIONS) {
    // this.versos(scope.x)  |> deco  |> says['versos']
    // this.rectos(scope.y)  |> deco  |> says['rectos']
    const table = this.pairsToTable({ scope, groupScheme })
    // table  |> decoTable  |> logger
    const crostab = table.crosTab({
      side: spec.x,
      banner: spec.y,
      field: { kerning: spec.mode },
      formula: spec.mode === AVERAGE ? ({ value }) => round(value) : round
    })
    if (nullish(crostab.head[0])) crostab.shiftColumn()
    if (nullish(crostab.side[0])) crostab.shiftRow()
    return crostab
  }

  toJson(options = DEFAULT_OPTIONS) { return masterToJson(this, options) }
}
