import { AVERAGE }                   from '@analys/enum-pivot-mode'
import { round }                     from '@aryth/math'
import { Latin, Scope, stringValue } from '@fontlab/latin'
import { head, side }                from '@vect/nested'
import { ob }                        from '@vect/object-init'
import { GROUPS_CHALENE }            from '../asset/GROUPS_CHALENE'
import { DEFAULT_OPTIONS }           from './convert/DEFAULT_OPTIONS'
import { masterToJson }              from './convert/masterToJson'
import { pairsToTable }              from './convert/pairsToTable'
import { Group }                     from './Group'

const DEFAULT_MASTER_ANALYTICS_OPTIONS = {
  scope: { x: Scope.Upper, y: Scope.Upper },
  spec: { x: 'group.v', y: 'group.r', mode: AVERAGE },
  groups: GROUPS_CHALENE,
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
