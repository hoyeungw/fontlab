import { groupedToSurject, surjectToGrouped }                        from '@analys/convert'
import { AVERAGE }                                                   from '@analys/enum-pivot-mode'
import { bound }                                                     from '@aryth/bound-vector'
import { round }                                                     from '@aryth/math'
import { head as rectoKeys, indexed, side as versoKeys, updateCell } from '@vect/nested'
import { ob }                                                        from '@vect/object-init'
import { mapEntries }                                                from '@vect/object-mapper'

import { CONVERT_OPTIONS, Side, TABULAR_OPTIONS } from '../asset'

import { lookupRegroup, masterToJson, pairsToTable } from '../utils'
import { trimToGlyph }                               from '../utils/trimToGlyph'
import { Group }                                     from './Group'
import { Grouped }                                   from './Grouped'

function unionAcquire(vector, list) {
  for (let x of list) if (!vector.includes(x)) vector.push(x)
  return vector
}

// noinspection JSBitwiseOperatorUsage
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
  pairKeys(side) {
    const list = []
    if (side & 1) unionAcquire(list, versoKeys(this.pairs))
    if (side & 2) unionAcquire(list, rectoKeys(this.pairs))
    return list
  }
  pairGlyphs(side) {
    let glyphs = Grouped.select(this.grouped, side)|> groupedToSurject |> Object.keys
    if (side & 1) unionAcquire(glyphs, versoKeys(this.pairs).map(trimToGlyph))
    if (side & 2) unionAcquire(glyphs, versoKeys(this.pairs).map(trimToGlyph))
    return glyphs
  }

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
  /**
   * @param {{['1st']:boolean,['2nd']:boolean,name,names}[]} regroupScheme
   * @return {Master}
   */
  regroup(regroupScheme) {
    const regrouped = regroupScheme|> Grouped.fromSamples
    const dictV = Grouped.glyphsToSurject(this.pairGlyphs(Side.Verso), Grouped.select(regrouped, Side.Verso))
    const dictR = Grouped.glyphsToSurject(this.pairGlyphs(Side.Recto), Grouped.select(regrouped, Side.Recto))
    // filter(dictV, Latin.isLetter) |> decoObject|> says['regroup'].br('glyphToPrevGroup'|> camelToSnake |> ros).br('verso')
    const pairs = lookupRegroup(this.granularPairs(), dictV, dictR, list => {
      const { min, dif } = bound(list)
      return dif === 0 ? min : min
    })
    return new Master(
      {
        ...mapEntries(surjectToGrouped(dictV), ([ name, list ]) => [ name = trimToGlyph(name), new Group(Side.Verso, name, list) ]),
        ...mapEntries(surjectToGrouped(dictR), ([ name, list ]) => [ name = trimToGlyph(name), new Group(Side.Recto, name, list) ]),
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

  pairsToTable(scopeX, scopeY) { return pairsToTable.call(this, scopeX, scopeY) }

  // { scope, spec, groups }
  crostab(options = TABULAR_OPTIONS) {
    const valid = tx => tx?.length
    const { scope, spec } = options
    const table = this.pairsToTable(scope.x, scope.y)
    return table.crosTab({
      side: spec.x,
      banner: spec.y,
      field: { kerning: spec.mode },
      filter: ob([ spec.x, valid ], [ spec.y, valid ]),
      formula: spec.mode === AVERAGE ? ({ value }) => round(value) : round
    })
  }

  toJson(options = CONVERT_OPTIONS) { return masterToJson(this, options) }
}
