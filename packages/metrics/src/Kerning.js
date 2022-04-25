import { AVERAGE }                              from '@analys/enum-pivot-mode'
import { Table }                                from '@analys/table'
import { round }                                from '@aryth/math'
import { nullish }                              from '@typen/nullish'
import { parseNum }                             from '@typen/numeral'
import { head, indexed, side }          from '@vect/nested'
import { Scope }                        from '../asset/Scope'
import { KERNING_GROUP_SCHEME_CHALENE }   from '../asset/KERNING_GROUP_SCHEME_CHALENE'
import { stringValue }                    from '../../latin/util/stringValue'
import { DEFAULT_OPTIONS, kerningToJson } from './convert/kerningToVFM'
import { Latin }                          from '../../latin/src/Latin'
import { KerningClass }                   from './KerningClass'
import { schemeToDictRecto, schemeToDictVerso } from './scheme/schemeToDict'

const KERNING_CROSTAB_OPTIONS = {
  scope: { x: Scope.Upper, y: Scope.Upper },
  spec: { x: 'group.v', y: 'group.r', mode: AVERAGE },
  groupScheme: KERNING_GROUP_SCHEME_CHALENE,
}

export class Kerning {
  kerningClasses
  pairs
  constructor(kerning) {
    const classes = (kerning.kerningClasses ?? [])
      .map(KerningClass.build)
      .sort(({ name: a }, { name: b }) => stringValue(a) - stringValue(b))
    this.kerningClasses = [...classes.filter(({ _1st }) => _1st), ...classes.filter(({ _2nd }) => _2nd)]
    this.pairs = kerning.pairs
  }
  static build(fontlabKerning) { return new Kerning(fontlabKerning) }
  versos(category) { return Latin.filter(side(this.pairs), category) }
  rectos(category) { return Latin.filter(head(this.pairs), category) }
  classes() { return this.kerningClasses.map(kerningClass => kerningClass.toObject()) }

  pairsToTable({
                 scope = { x: Scope.Upper, y: Scope.Upper },
                 groupScheme = KERNING_GROUP_SCHEME_CHALENE
               } = {}) {
    const dictV = schemeToDictVerso(groupScheme)
    const dictR = schemeToDictRecto(groupScheme)
    const enumerator = indexed(this.pairs, {
      by: (verso, recto, kern) => true,
      to: (verso, recto, kern) => [verso, recto, parseNum(kern), Latin.glyph(verso), Latin.glyph(recto)]
    })
    const table = Table.from({
      head: ['glyph.v', 'glyph.r', 'kerning', 'letter.v', 'letter.r'],
      rows: [...enumerator],
      title: 'pairs'
    })
    table.filter([
      { field: 'letter.v', filter: Latin.make(scope.x), },
      { field: 'letter.r', filter: Latin.make(scope.y), },
    ], { mutate: true })
    table.proliferateColumn([
      { key: 'letter.v', to: x => dictV[x], as: 'group.v' },
      { key: 'letter.r', to: x => dictR[x], as: 'group.r' }
    ], { nextTo: 'letter.r', mutate: true })
    // table  |> decoTable  |> logger
    return table
  }

  crostab({ scope, spec, groupScheme } = KERNING_CROSTAB_OPTIONS) {
    // this.versos(scope.x)  |> deco  |> says['versos']
    // this.rectos(scope.y)  |> deco  |> says['rectos']
    const table = this.pairsToTable({ scope, groupScheme })
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

  toVFM(options = DEFAULT_OPTIONS) { return kerningToJson(this, options) }
}
