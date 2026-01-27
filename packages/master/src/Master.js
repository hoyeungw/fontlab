import { surjectToGrouped }                             from '@analys/convert'
import { MIN }                                          from '@analys/enum-pivot-mode'
import { indexed as indexedNested, Stat as SparseStat } from '@analyz/sparse'
import { CONVERT_OPTIONS }                              from '@fontlab/constants'
import { Side }                                         from '@fontlab/enum-side'
import { KerningClass, KerningClasses }                 from '@fontlab/kerning-class'
import { AT, baseGlyph, KerningPairs, trimAT }          from '@fontlab/kerning-pairs'
import { Latin }                                        from '@fontlab/latin'
import { parseNum }                                     from '@typen/numeral'
import { ob }                                           from '@vect/object-init'
import { indexed }                                      from '@vect/object-mapper'
import { union }                                        from '@vect/vector-algebra'
import { Stat }                                         from '@vect/vector-stat'
import { masterToJson }                                 from './masterToJson.js'

export class Master {
  /** @type {string}         */ name
  /** @type {KerningClasses} */ kerningClasses
  /** @type {KerningPairs}   */ kerningPairs

  constructor(name, kerningClasses, kerningPairs) {
    this.name = name
    this.kerningClasses = kerningClasses
    this.kerningPairs = kerningPairs
  }
  static build(name, kerningClasses, kerningPairs) {
    return new Master(name, kerningClasses, kerningPairs)
  }
  static from(name, master) {
    const kerningClasses = KerningClasses.from(master.kerningClasses)
    const pairs = KerningPairs.from(master.kerningPairs ?? {})
    return new Master(name, kerningClasses, pairs)
  }

  slice({ kerningClasses, kerningPairs } = CONVERT_OPTIONS) {
    return new Master(
      this.name,
      kerningClasses ? this.kerningClasses : null,
      kerningPairs ? this.kerningPairs : null,
    )
  }

  get pairs() { return this.kerningPairs}
  set pairs(kerningPairs) { this.kerningPairs = kerningPairs }

  collectGlyphs(side) {
    const definedGlyphs = this.kerningClasses.collectGlyphs(side)
    const pairedGlyphs = this.kerningPairs.collectGlyphs(side)
    return union(definedGlyphs, pairedGlyphs)
  }

  /**
   * Gets flattened kerning kerningPairs by combining individual kerningPairs with class-based kerningPairs.
   * For left-side kerningClasses, it uses glyph kerningClasses selected by Side.Left.
   * For right-side kerningClasses, it uses glyph kerningClasses selected by Side.Right.
   * @returns {KerningPairs} Flattened kerning kerningPairs combining individual and class-based kerningPairs
   */
  get flatPairs() { return this.kerningPairs.flat(this.kerningClasses) }

  updatePairs(kerningPairs) { return this.kerningPairs.overwrite(kerningPairs) }

  /**
   * @param {KerningClasses} kerningClasses
   */
  regroup(kerningClasses) {
    const xGlyphs = this.collectGlyphs(Side.Left)
    const yGlyphs = this.collectGlyphs(Side.Right)
    const xMap = kerningClasses.toMultimap(Side.Left)
    const yMap = kerningClasses.toMultimap(Side.Right)
    const xtc = kerningClasses.toSurject(Side.Left, true)
    const ytc = kerningClasses.toSurject(Side.Right, true)
    const groupedX = surjectToGrouped(xtc)
    const groupedY = surjectToGrouped(ytc)
    const filter = (k, v) => AT.test(k) && v?.length
    const toLeft = (k, v) => [ k = trimAT(k), KerningClass.left(k, v) ]
    const toRight = (k, v) => [ k = trimAT(k), KerningClass.right(k, v) ]
    return Master.build(
      this.name,
      ob(...indexed(groupedX, filter, toLeft), ...indexed(groupedY, filter, toRight)),
      this.flatPairs.regroup(kerningClasses, Stat.min),
    )
  }

  groupCrostab(mode = MIN, scopeX, scopeY, into) {
    const filterX = Latin.factory(scopeX), filterY = Latin.factory(scopeY)
    const iter = indexedNested(this.kerningPairs, (x, y) => filterX(baseGlyph(x)) && filterY(baseGlyph(y)), coordToNum)
    return SparseStat.of(mode).collect(iter).crostab(into, '')
  }

  flattenCrostab(mode = MIN, scopeX, scopeY, po) {
    const xBy = Latin.factory(scopeX), yBy = Latin.factory(scopeY)
    const iter = indexedNested(this.flatPairs, (x, y) => xBy(x) && yBy(y), coordToNum)
    return SparseStat.of(mode).collect(iter).crostab(po, '')
  }

  toJson(options = CONVERT_OPTIONS) {
    return masterToJson.call(options, this)
  }
}

export function coordToNum(x, y, v) {
  return [ x, y, parseNum(v) ]
}
