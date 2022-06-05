import { ACCUM, LAST }          from '@analys/enum-pivot-mode'
import { Sparse, Stat }         from '@analyz/sparse'
import { almostEqual }          from '@aryth/math'
import { valid }                from '@typen/nullish'
import { indexedBy, indexedOf } from '@vect/nested'
import { AT, offAT }            from './texting'

/** @typedef {Object<string,Object<string,*>>} Nested */

// noinspection DuplicatedCode
/** @type {Nested} */
export class Pairs extends Sparse {
  constructor(data) {
    super()
    if (data) this.data = data
  }
  static from(data) { return new Pairs(data) }
  regroup(surX, surY, stat) {
    const XY = Stat.of(ACCUM), Xy = Stat.of(ACCUM), xY = Stat.of(ACCUM), xy = Stat.of(LAST)
    for (let [ x, y, v ] of this.indexed())
      x in surX
        ? y in surY ? XY.update(surX[x], surY[y], v) : Xy.update(surX[x], y, v)
        : y in surY ? xY.update(x, surY[y], v) : xy.update(x, y, v)
    const next = new Pairs()
    for (let [ x, y, vec ] of indexedOf(XY)) next.update(x, y, stat(vec))
    for (let [ x, y, vec ] of indexedOf(Xy)) next.update(x, y, stat(vec))
    for (let [ x, y, vec ] of indexedOf(xY)) next.update(x, y, stat(vec))
    for (let [ x, y, val ] of indexedOf(xy)) next.update(x, y, val)
    return next
  }

  flatten(groupedX, groupedY) {
    const
      xG = groupedX,
      yG = groupedY,
      next = new Pairs(), fake = []
    for (let [ xn, yn, kern ] of this.indexed()) {
      if (AT.test(xn) && (xn = offAT(xn))) {
        if (AT.test(yn) && (yn = offAT(yn)))
          for (let x of (xG[xn] ?? fake)) for (let y of (yG[yn] ?? fake)) next.update(x, y, kern)
        else
          for (let x of (xG[xn] ?? fake)) next.update(x, yn, kern)
      }
      else {
        if (AT.test(yn) && (yn = offAT(yn)))
          for (let y of (yG[yn] ?? fake)) next.update(xn, y, kern)
        else
          next.update(xn, yn, kern)
      }
    }
    return next
  }

  sigDif(x, y, v) { return valid(v) && !almostEqual(this.cell(x, y), v, 0.1) }

  overwrite(nextPairs) {
    let n = 0
    for (let [ x, y, v ] of indexedBy(nextPairs, this.sigDif.bind(this))) { n++, this.update(x, y, v) }
    return n
  }
}