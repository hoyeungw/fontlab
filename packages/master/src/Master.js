import { surjectToGrouped }                                           from '@analys/convert'
import { AVERAGE }                                                    from '@analys/enum-pivot-mode'
import { Table }                                                      from '@analys/table'
import { bound }                                                      from '@aryth/bound-vector'
import { round }                                                      from '@aryth/math'
import { Latin, Scope, stringAscending }                              from '@fontlab/latin'
import { deco, logger }                                               from '@spare/logger'
import { appendCell, head, indexed, indexedMutate, side, updateCell } from '@vect/nested'
import { ob }                                                         from '@vect/object-init'
import { mappedIndexed }                                              from '@vect/object-mapper'
import { GLYPH, GROUP, LETTER }                                       from '../asset/constants'
import { DEFAULT_OPTIONS }                                            from '../asset/DEFAULT_OPTIONS'
import { GROUPS_CHALENE }                                             from '../asset/GROUPS_CHALENE'
import { Side }                                                       from '../asset/Side'
import { masterToJson }                                               from '../utils/convert'
import { groupsToSurject }                                            from '../utils/groupsToSurject'
import { pairsToTable }                                               from '../utils/pairsToTable'
import { Group }                                                      from './Group'

const DEFAULT_MASTER_ANALYTICS_OPTIONS = {
  scope: { x: Scope.Upper, y: Scope.Upper },
  spec: { x: 'group.v', y: 'group.r', mode: AVERAGE },
  groups: GROUPS_CHALENE,
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
    const versos = ob(...this.groups.filter(is1st).map(({ name, names }) => [ name, names ]))
    const rectos = ob(...this.groups.filter(is2nd).map(({ name, names }) => [ name, names ]))
    const target = {}
    const fake = []
    let xGr, yGr
    for (let [ xEl, yEl, v ] of indexed(this.pairs)) {
      if ((xEl[0] === '@') && (xGr = xEl.slice(1))) {
        if ((yEl[0] === '@') && (yGr = yEl.slice(1))) {
          for (let x of (versos[xGr] ?? fake)) for (let y of (rectos[yGr] ?? fake)) updateCell.call(target, x, y, v)
        } else {
          for (let x of (versos[xGr] ?? fake)) updateCell.call(target, x, yEl, v)
        }
      } else {
        if ((yEl[0] === '@') && (yGr = yEl.slice(1))) {
          for (let y of (rectos[yGr] ?? fake)) updateCell.call(target, xEl, y, v)
        } else {
          updateCell.call(target, xEl, yEl, v)
        }
      }
    }
    return target
  }

  regroup(nextGroupScheme) {
    const CURR = 'curr', NEXT = 'next'
    const NEXT_GROUP = NEXT + GROUP
    function groupTable(currGroups, nextGroupScheme, side) {
      const letterToGroupNext = groupsToSurject(nextGroupScheme, side)
      const letterToGroup = letter => letter in letterToGroupNext ? ('@' + letterToGroupNext[letter]) : letter
      return Table
        .from({
          head: [ GLYPH, LETTER, CURR, NEXT ],
          rows: [ ...mappedIndexed(groupsToSurject(currGroups, side), (glyph, group) => {
            const letter = Latin.letter(glyph)
            return [ glyph, letter, group, letterToGroup(letter) ]
          }) ],
          title: GROUP
        })
    }
    const groupV = groupTable(this.groups, nextGroupScheme, Side.Verso)
    const groupR = groupTable(this.groups, nextGroupScheme, Side.Recto)
    const glyphToNextV = groupV.lookupTable(GLYPH, NEXT, true)
    const glyphToNextR = groupR.lookupTable(GLYPH, NEXT, true)
    const groups = [
      ...mappedIndexed(surjectToGrouped(glyphToNextV), (glyph, names) => Group.initVerso(glyph.replace(/@/g, ''), names)),
      ...mappedIndexed(surjectToGrouped(glyphToNextR), (glyph, names) => Group.initVerso(glyph.replace(/@/g, ''), names)),
    ]
    const pairs = {}
    const granularPairs = this.granularPairs()
    for (let [ verso, recto, kern ] of indexed(granularPairs)) {
      if (verso in glyphToNextV) {
        if (recto in glyphToNextR) {

        } else {

        }
      } else {
        if (recto in glyphToNextR) {

        } else {

        }
      }
      const versoNext = glyphToNextV[verso] ?? verso
      const rectoNext = glyphToNextR[recto] ?? recto
      appendCell.call(pairs, versoNext, rectoNext, kern)
      if ((verso in glyphToNextV) && (recto in glyphToNextR)) {
        delete granularPairs[verso][recto]
      } else {
      }
    }
    for (let k in granularPairs) if (isEmpty(granularPairs[k])) delete granularPairs[k]
    granularPairs  |> deco  |> logger
    // target  |> deco  |> logger
    indexedMutate(pairs, (verso, recto, list) => {
      const { min, dif } = bound(list)
      if (dif === 0) {
        return min
      } else {
        // `[verso] (${ros(verso)}) [recto] (${ros(recto)}) [list] (${list}) `  |> logger
        return min
      }
    })
    // target  |> deco  |> logger
    return new Master({ groups, pairs })
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
      filter: ob([ x, filter ], [ y, filter ]),
      formula: mode === AVERAGE ? ({ value }) => round(value) : round
    })
  }

  toJson(options = DEFAULT_OPTIONS) { return masterToJson(this, options) }
}
