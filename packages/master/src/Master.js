import { surjectToGrouped }                from '@analys/convert'
import { AVERAGE }                         from '@analys/enum-pivot-mode'
import { bound }                           from '@aryth/bound-vector'
import { round }                           from '@aryth/math'
import { head, indexed, side, updateCell } from '@vect/nested'
import { ob }                              from '@vect/object-init'
import { mapEntries }                      from '@vect/object-mapper'

import { CONVERT_OPTIONS, Side, TABULAR_OPTIONS } from '../asset'

import { lookupRegroup, masterToJson, pairsToTable } from '../utils'
import { Group }                                     from './Group'
import { Grouped }                                   from './Grouped'


export class Master {
  /** @type {Object<string,Group>} */
  grouped
  /** @type {Object<string,Object<string,string|number>>} */
  pairs
  constructor(grouped, pairs) {
    this.grouped = grouped
    // this.grouped  |> deco  |> says['this.grouped']
    this.pairs = pairs
  }
  static build({ kerningClasses = [], pairs = {} } = {}) {
    return new Master(Grouped.fromSamples(kerningClasses), pairs)
  }

  get kerningClasses() { return Object.values(this.grouped) }
  get pairsSide() { return side(this.pairs) }
  get pairsHead() { return head(this.pairs) }

  granularPairs() {
    const groupedV = Grouped.select(this.grouped, Side.Verso)
    const groupedR = Grouped.select(this.grouped, Side.Recto)
    const target = {}
    const fake = []
    let xg, yg
    for (let [ xn, yn, v ] of indexed(this.pairs)) {
      if ((xn[0] === '@') && (xg = xn.slice(1))) {
        if ((yn[0] === '@') && (yg = yn.slice(1))) {
          for (let x of (groupedV[xg] ?? fake)) for (let y of (groupedR[yg] ?? fake)) updateCell.call(target, x, y, v)
        } else {
          for (let x of (groupedV[xg] ?? fake)) updateCell.call(target, x, yn, v)
        }
      } else {
        if ((yn[0] === '@') && (yg = yn.slice(1))) {
          for (let y of (groupedR[yg] ?? fake)) updateCell.call(target, xn, y, v)
        } else {
          updateCell.call(target, xn, yn, v)
        }
      }
    }

    return target
  }

  regroup(regroupScheme) {
    const regrouped = regroupScheme|> Grouped.fromSamples
    const dictV = Grouped.makeGlyphToRegroup(Grouped.select(this.grouped, Side.Verso), Grouped.select(regrouped, Side.Verso))
    const dictR = Grouped.makeGlyphToRegroup(Grouped.select(this.grouped, Side.Recto), Grouped.select(regrouped, Side.Recto))
    const pairs = lookupRegroup(this.granularPairs(), dictV, dictR, list => {
      const { min, dif } = bound(list)
      return dif === 0 ? min : min
    })
    return new Master(
      {
        ...mapEntries(surjectToGrouped(dictV), ([ name, list ]) => [ name = name.replace(/@/g, ''), new Group(Side.Verso, name, list) ]),
        ...mapEntries(surjectToGrouped(dictR), ([ name, list ]) => [ name = name.replace(/@/g, ''), new Group(Side.Recto, name, list) ]),
      },
      pairs
    )
  }

  updatePairs(newPairs) {
    for (let [ x, y, v ] of indexed(newPairs)) {
      updateCell.call(this.pairs, x, y, v)
    }
    return this
  }

  pairsToTable(options = TABULAR_OPTIONS) { return pairsToTable(this.pairs, options) }

  // { scope, spec, groups }
  crostab(options = TABULAR_OPTIONS) {
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

  toJson(options = CONVERT_OPTIONS) { return masterToJson(this, options) }
}
