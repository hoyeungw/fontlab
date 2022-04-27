import { AVERAGE }                                    from '@analys/enum-pivot-mode'
import { Table }                                      from '@analys/table'
import { bound }                                      from '@aryth/bound-vector'
import { round }                                      from '@aryth/math'
import { Latin, Scope, stringAscending }              from '@fontlab/latin'
import { deco, decoTable, logger }                    from '@spare/logger'
import { head, indexed, indexedMutate, side, update } from '@vect/nested'
import { ob }                                         from '@vect/object-init'
import { merge }                                      from '@vect/vector-merge'
import { GLYPH, GROUP, LETTER }                       from '../asset/constants'
import { GROUPS_CHALENE }                             from '../asset/GROUPS_CHALENE'
import { is1st, is2nd, Side }                         from '../asset/Side'
import { DEFAULT_OPTIONS }                            from './convert/DEFAULT_OPTIONS'
import { groupsToSurject }                            from './convert/groupsToSurject'
import { masterToJson }                               from './convert/masterToJson'
import { pairsToTable }                               from './convert/pairsToTable'
import { Group }                                      from './Group'


const DEFAULT_MASTER_ANALYTICS_OPTIONS = {
  scope: { x: Scope.Upper, y: Scope.Upper },
  spec: { x: 'group.v', y: 'group.r', mode: AVERAGE },
  groups: GROUPS_CHALENE,
}

export function append(x, y, v) {
  const temp = this[x] ?? (this[x] = {})
  const list = temp[y] ?? (temp[y] = [])
  list.push(v)
}
function surjectToGrouped(surject) {
  const o = {}
  for (let x in surject) {
    const y = surject[x];
    (o[y] ?? (o[y] = [])).push(x)
  }
  return o
}

export class Master {
  groups
  pairs
  constructor(master) {
    this.groups = (master.kerningClasses ?? master.groups ?? [])
      .map(Group.build)
      .sort((a, b) => a.side === b.side ? stringAscending(a.name, b.name) : a.side - b.side)
    this.pairs = master.pairs
  }
  static build(fontlabKerning) { return new Master(fontlabKerning) }

  get kerningClasses() { return this.groups }
  versos(scope) { return side(this.pairs).filter(Latin.filterFactory(scope)) }
  rectos(scope) { return head(this.pairs).filter(Latin.filterFactory(scope)) }

  granularPairs() {
    const source = this.pairs
    const versos = Object.fromEntries(this.groups.filter(is1st).map(({ name, names }) => [name, names]))
    const rectos = Object.fromEntries(this.groups.filter(is2nd).map(({ name, names }) => [name, names]))
    const target = {}
    const fake = []
    let xGr, yGr
    for (let [xEl, yEl, v] of indexed(source)) {
      if ((xEl[0] === '@') && (xGr = xEl.slice(1))) {
        if ((yEl[0] === '@') && (yGr = yEl.slice(1))) {
          for (let x of (versos[xGr] ?? fake)) for (let y of (rectos[yGr] ?? fake)) update.call(target, x, y, v)
        } else {
          for (let x of (versos[xGr] ?? fake)) update.call(target, x, yEl, v)
        }
      } else {
        if ((yEl[0] === '@') && (yGr = yEl.slice(1))) {
          for (let y of (rectos[yGr] ?? fake)) update.call(target, xEl, y, v)
        } else {
          update.call(target, xEl, yEl, v)
        }
      }

    }
    return target
  }

  regroup(nextGroupScheme) {
    const NEXT_GROUP = 'next' + GROUP
    function groupTable(currGroups, nextGroupScheme, side) {
      const nextLetterToGroup = groupsToSurject(nextGroupScheme, side)
      const letterToGroup = letter => letter in nextLetterToGroup ? ('@' + nextLetterToGroup[letter]) : letter
      const table = Table
        .from({
          head: [GLYPH, GROUP],
          rows: Object.entries(groupsToSurject(currGroups, side)),
          title: GROUP
        })
        .proliferateColumn({ key: GLYPH, to: Latin.letter, as: LETTER }, { nextTo: GLYPH, mutate: true })
        .proliferateColumn({ key: LETTER, to: letterToGroup, as: NEXT_GROUP }, { nextTo: GROUP, mutate: true })
      table  |> decoTable|> logger
      return table
    }
    const tableVerso = groupTable(this.groups, nextGroupScheme, Side.Verso)
    const tableRecto = groupTable(this.groups, nextGroupScheme, Side.Recto)
    const versoGlyphToNextGroup = tableVerso.lookupTable(GLYPH, NEXT_GROUP, true)
    const rectoGlyphToNextGroup = tableRecto.lookupTable(GLYPH, NEXT_GROUP, true)
    const groups = merge(
      Object.entries(surjectToGrouped(versoGlyphToNextGroup))
        .map(([name, names]) => Group.build({ side: Side.Verso, name: name.replace(/@/g, ''), names })),
      Object.entries(surjectToGrouped(rectoGlyphToNextGroup))
        .map(([name, names]) => Group.build({ side: Side.Verso, name: name.replace(/@/g, ''), names }))
    )
    const target = {}
    const granularPairs = this.granularPairs()
    indexedMutate(granularPairs, (verso, recto, kern) => {
      const nextVerso = versoGlyphToNextGroup[verso] ?? verso
      const nextRecto = rectoGlyphToNextGroup[recto] ?? recto
      append.call(target, nextVerso, nextRecto, kern)
    })
    // target  |> deco  |> logger
    indexedMutate(target, (verso, recto, list) => {
      const { min, dif } = bound(list)
      if (dif === 0) {
        return min
      } else {
        // `[verso] (${ros(verso)}) [recto] (${ros(recto)}) [list] (${list}) `  |> logger
        return min
      }
    })
    target  |> deco  |> logger
    return new Master({ groups, pairs: target })
  }

  pairsToTable(options = DEFAULT_MASTER_ANALYTICS_OPTIONS) { return pairsToTable(this.pairs, options) }

  // { scope, spec, groups }
  crostab(options = DEFAULT_MASTER_ANALYTICS_OPTIONS) {
    const filter = tx => tx !== '-'
    const table = this.pairsToTable(options)
    const { spec: { x, y, mode } } = options
    return table.crosTab({
      side: x,
      banner: y,
      field: { kerning: mode },
      filter: ob([x, filter], [y, filter]),
      formula: mode === AVERAGE ? ({ value }) => round(value) : round
    })
  }

  toJson(options = DEFAULT_OPTIONS) { return masterToJson(this, options) }
}
