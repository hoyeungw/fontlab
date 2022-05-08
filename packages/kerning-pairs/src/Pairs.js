import { appendCell, indexed, simpleIndexed, updateCell } from '@vect/nested'

/** @typedef {Object<string,Object<string,*>>} Nested */

// noinspection DuplicatedCode
/** @type {Nested} */
export class Pairs {
  regroup(surX, surY, stat) {
    /** @type {Nested} */ const pairs = this, XY = {}, Xy = {}, xY = {}, xy = {}
    for (let [ x, y, v ] of indexed(pairs)) {
      x in surX
        ? y in surY ? appendCell.call(XY, surX[x], surY[y], v) : appendCell.call(Xy, surX[x], y, v)
        : y in surY ? appendCell.call(xY, x, surY[y], v) : updateCell.call(xy, x, y, v)
    }
    const target = {}
    for (let [ x, y, vec ] of simpleIndexed(XY)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, vec ] of simpleIndexed(Xy)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, vec ] of simpleIndexed(xY)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, val ] of simpleIndexed(xy)) updateCell.call(target, x, y, val)
    return target
  }
}