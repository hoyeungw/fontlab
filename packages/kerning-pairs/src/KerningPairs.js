import { ACCUM, MIN }                       from '@analys/enum-pivot-mode'
import { Sparse, Stat }                     from '@analyz/sparse'
import { almostEqual, round }               from '@aryth/math'
import { scopeName, SCOPES }                from '@fontlab/enum-scope'
import { glyphToLabel, Latin }              from '@fontlab/latin'
import { Side }                             from '@fontlab/enum-side'
import { nullish, valid }                   from '@typen/nullish'
import { parseNum }                         from '@typen/num-strict'
import { acquire }                          from '@vect/vector-algebra'
import { Stat as VecStat }                  from '@vect/vector-stat'
import { labelAsc }                         from './utils/labelAsc.js'
import { AT, baseGlyph, trimAT, trimGlyph } from './utils/texting.js'
import { toNum }                            from './utils/toNum.js'
import {Crostab} from '@analyz/crostab'

/** @typedef {Object<string,Object<string,*>>} Nested */

// /** @type {KerningPairs|Nested} */
export class KerningPairs extends Sparse {
  constructor(fill, data) {
    super(fill, data)
  }

  /**
   * Creates a new KerningPairs instance with specified fill value and data
   * @param {*} [fill] - Default value to fill undefined cells
   * @param {Object} [data] - Initial data object (nested key-value pairs)
   * @returns {KerningPairs} New KerningPairs instance
   */
  static build(fill, data) { return new KerningPairs(fill, data) }

  /**
   * Creates a new KerningPairs instance from an existing data object without a fill value.
   * This factory method is a convenience shorthand for `new KerningPairs(null, data)`.
   *
   * @param {Object} data - Initial data structure containing kerning pairs.
   *        Expected to be a nested object where:
   *        - Top-level keys represent first glyphs/class names (left/side positions)
   *        - Nested keys represent second glyphs/class names (right/head positions)
   *        - Values represent kerning offsets
   * @returns {KerningPairs} New KerningPairs instance initialized with the provided data
   */
  static from(data) { return new KerningPairs(null, data) }

  /** @returns {number[]} An array containing [height, width] dimensions of the kerning pairs matrix. */
  size() {
    const fake = this.crostab(null, '')
    return [ fake.height, fake.width ]
  }

  /**
   * Collects all unique glyphs from either or both sides of kerning pairs
   * @param {number} side - Bitmask indicating which sides to collect from:
   *                        - 1 (Left/First glyph in pair)
   *                        - 2 (Right/Second glyph in pair)
   *                        - 3 (Both sides)
   * @returns {string[]} Array of trimmed glyph names from the specified side(s)
   */
  collectGlyphs(side) {
    const vec = []
    if (side & 1) acquire(vec, this.side.map(trimGlyph))
    if (side & 2) acquire(vec, this.head.map(trimGlyph))
    return vec
  }


  /**
   * Creates a filtered cross-table (crostab) of kerning pairs based on specified scopes
   * and aggregation mode, with optional value transformation.
   *
   * This method generates a structured cross-table that includes only kerning pairs
   * where both glyphs match their respective scope criteria. The resulting table
   * is aggregated using the specified pivot mode (defaulting to minimum value).
   *
   * @param {string} [mode=MIN] - Pivot aggregation mode from @analys/enum-pivot-mode. Defaults to MIN, which selects the minimum kerning value for each cell.
   * @param {number} scopeX - Scope definition for left-side (first) glyphs.
   * @param {number} scopeY - Scope definition for right-side (second) glyphs.
   * @param {Function} [into] - Optional transformation function applied to each kerning value in the resulting cross-table.
   *
   * @returns {Crostab} A Crostab instance from the @analyz/crostab package
   */
  subCrostab(mode = MIN, scopeX, scopeY, into) {
    const predX = Latin.factory(scopeX), predY = Latin.factory(scopeY)
    const iter = this.indexed((x, y) => predX(baseGlyph(x)) && predY(baseGlyph(y)), toNum)
    const crostab = Stat.of(mode).collect(iter).crostab(into, '')
    crostab.title = `${scopeName(scopeX)}_${scopeName(scopeY)}`
    return crostab
  }
  
  * intoCrostabs() {
    function format(x) { return isNaN(x) ? '' : round(x) }
    for (const scopeX of SCOPES) {
      for (const scopeY of SCOPES) {
        const crostab = this.subCrostab(MIN, scopeX, scopeY, format)
        crostab.mutateKeys(glyphToLabel)
        crostab.sideward.sortKeys(labelAsc)
        crostab.headward.sortKeys(labelAsc)
        yield crostab
      }
    }
  }

  crostabCollection() {
    const collection = {}
    for (const crostab of this.intoCrostabs()) collection[crostab.title] = crostab
    return collection
  }

  /**
   * Regroups kerning pairs based on surjective mappings and a statistical function
   * @param {KerningClasses} kerningClasses
   * @param {function([number]): number} stat - Statistical function that processes
   *        an array of kerning values and returns a single representative value
   *        (e.g., Stat.min for minimum value, Stat.avg for average)
   * @returns {KerningPairs} New KerningPairs instance with regrouped kerning values
   */
  regroup(kerningClasses, stat = VecStat.min) {
    const XY = Stat.of(ACCUM), Xy = Stat.of(ACCUM), xY = Stat.of(ACCUM), xy = Stat.of(ACCUM)
    const flattenPairs = this.flatten(kerningClasses)
    const surjectX = kerningClasses.toSurject(Side.Left, true)
    const surjectY = kerningClasses.toSurject(Side.Right, true)
    for (let [ glyphX, glyphY, v ] of flattenPairs.indexed())
      glyphX in surjectX
        ? glyphY in surjectY
          ? XY.update(surjectX[glyphX], surjectY[glyphY], v)
          : Xy.update(surjectX[glyphX], glyphY, v)
        : glyphY in surjectY
          ? xY.update(glyphX, surjectY[glyphY], v)
          : xy.update(glyphX, glyphY, v)
    const pairs = KerningPairs.build()
    for (let [ x, y, vec ] of XY.indexed()) pairs.update(x, y, stat(vec))
    for (let [ x, y, vec ] of Xy.indexed()) pairs.update(x, y, stat(vec))
    for (let [ x, y, vec ] of xY.indexed()) pairs.update(x, y, stat(vec))
    for (let [ x, y, vec ] of xy.indexed()) pairs.update(x, y, stat(vec))
    return pairs
  }

  /**
   * Expands class-based kerning pairs into individual glyph pairs.
   * For each pair in the current collection:
   * - If both sides are class references (starting with '@'), expands to all combinations of glyphs in those classes
   * - If only one side is a class reference, expands to all combinations with that class's glyphs
   * - If neither side is a class reference, keeps the original pair
   * @param {KerningClasses} groups - Mapping of class names to their glyph members
   * @returns {KerningPairs} New KerningPairs instance with all class references expanded to individual glyph pairs
   */
  flatten(groups) {
    const groupsX = groups.selectSide(Side.Left)
    const groupsY = groups.selectSide(Side.Right)
    const target = KerningPairs.build()
    const fake = []
    for (let [ x, y, v ] of this.indexed()) {
      if (AT.test(x) && (x = trimAT(x))) {
        if (AT.test(y) && (y = trimAT(y)))
          for (let cx of (groupsX[x] ?? fake)) for (let cy of (groupsY[y] ?? fake)) target.update(cx, cy, v)
        else
          for (let cx of (groupsX[x] ?? fake)) target.update(cx, y, v)
      } else {
        if (AT.test(y) && (y = trimAT(y)))
          for (let cy of (groupsY[y] ?? fake)) target.update(x, cy, v)
        else
          target.update(x, y, v)
      }
    }
    return target
  }

  delete(x, y) { if (x in this.data) delete this.data[x][y] }

  cleanUp() {
    let n = 0
    for (let [ x, y, _ ] of this.indexed((x, y, v) => nullish(v) || !(v = parseNum(v)) || isNaN(v))) {
      n++, this.delete(x, y)
    }
    console.log(`[clean up] (${n})`)
    return n
  }

  overwrite(nextPairs) {
    let n = this.cleanUp()
    // if (/@[AHOT]1/.test(x) && /@[AHOT]2/.test(y)) `[ '${x}', '${y}', ${v} ],` |> console.log
    for (let [ x, y, v ] of nextPairs.indexed()) {
      v && !almostEqual(v, this.cell(x, y), 0.1)
        ? this.update(x, y, v)
        : (valid(this.cell(x, y)) ? this.delete(x, y) : null)
    }
    return n
  }
}