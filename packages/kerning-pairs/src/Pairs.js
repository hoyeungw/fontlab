import { appendCell, indexed, simpleIndexed, updateCell } from '@vect/nested'

/** @typedef {Object<string,Object<string,*>>} Nested */

// noinspection DuplicatedCode
/** @type {Nested} */
export class Pairs {
  regroup(surX, surY, stat) {
    /** @type {Nested} */ const pairs = this, GG = {}, GS = {}, SG = {}, SS = {}
    for (let [ x, y, v ] of indexed(pairs)) {
      x in surX
        ? y in surY ? appendCell.call(GG, surX[x], surY[y], v) : appendCell.call(GS, surX[x], y, v)
        : y in surY ? appendCell.call(SG, x, surY[y], v) : updateCell.call(SS, x, y, v)
    }
    const target = {}
    for (let [ x, y, vec ] of simpleIndexed(GG)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, vec ] of simpleIndexed(GS)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, vec ] of simpleIndexed(SG)) updateCell.call(target, x, y, stat(vec))
    for (let [ x, y, val ] of simpleIndexed(SS)) updateCell.call(target, x, y, val)
    return target
  }
}