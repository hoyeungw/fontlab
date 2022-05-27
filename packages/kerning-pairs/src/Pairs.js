import { almostEqual }                                                       from '@aryth/math'
import { valid }                                                             from '@typen/nullish'
import { appendCell, head, indexed, indexedBy, indexedOf, side, updateCell } from '@vect/nested'
import { AT, offAT }                                                         from './texting'

/** @typedef {Object<string,Object<string,*>>} Nested */

// noinspection DuplicatedCode
/** @type {Nested} */
export class Pairs {
  constructor() {}
  regroup(surX, surY, stat) {
    /** @type {Nested} */ const nested = this, XY = {}, Xy = {}, xY = {}, xy = {}
    for (let [ x, y, v ] of indexed(nested)) {
      x in surX
        ? y in surY ? appendCell.call(XY, surX[x], surY[y], v) : appendCell.call(Xy, surX[x], y, v)
        : y in surY ? appendCell.call(xY, x, surY[y], v) : updateCell.call(xy, x, y, v)
    }
    const target = {}
    for (let [ x, y, vec ] of indexedOf(XY)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, vec ] of indexedOf(Xy)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, vec ] of indexedOf(xY)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, val ] of indexedOf(xy)) updateCell.call(target, x, y, val)
    return target
  }

  flatten(groupedX, groupedY) {
    /** @type {Nested} */ const nested = this
    const
      xG = groupedX,
      yG = groupedY,
      target = {}, fake = [], update = updateCell.bind(target)
    for (let [ xn, yn, kern ] of indexed(nested)) {
      if (AT.test(xn) && (xn = offAT(xn))) {
        if (AT.test(yn) && (yn = offAT(yn)))
          for (let x of (xG[xn] ?? fake)) for (let y of (yG[yn] ?? fake)) update(x, y, kern)
        else
          for (let x of (xG[xn] ?? fake)) update(x, yn, kern)
      }
      else {
        if (AT.test(yn) && (yn = offAT(yn)))
          for (let y of (yG[yn] ?? fake)) update(xn, y, kern)
        else
          update(xn, yn, kern)
      }
    }
    return target
  }

  side() { return side(this) }
  head() { return head(this) }
  cell(x, y) { return this[x] ? this[x][y] : null }

  update(nextPairs) {
    /** @type {Nested} */ const nested = this
    const cell = Pairs.prototype.cell.bind(nested)
    let n = 0
    for (let [ x, y, v ] of indexedBy(nextPairs, (x, y, v) => valid(v) && !almostEqual(cell(x, y), v, 0.1))) {
      updateCell.call(nested, x, y, v)
      n++
    }
    // for (let [ x, y, v ] of indexed(nested)) if (isNumeric(y)) delete nested[x][y]
    // for (let x in nested) if (isNumeric(x)) delete nested[x]
    return n
  }
}