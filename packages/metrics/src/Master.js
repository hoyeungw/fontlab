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

  update(groups) {

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
