import { surjectToGrouped }                                                   from '@analys/convert'
import { MIN }                                                                from '@analys/enum-pivot-mode'
import { indexed as indexedNested, Stat as SparseStat }                       from '@analyz/sparse'
import { CONVERT_OPTIONS }                                                    from '@fontlab/constants'
import { Side }                                                                      from '@fontlab/enum-side'
import { glyphGroupedToSurject, glyphGroupsToGrouped, KerningClass, KerningClasses } from '@fontlab/kerning-class'
import { AT, baseGlyph, KerningPairs, trimAT }                                       from '@fontlab/kerning-pairs'
import { Latin }                                                                     from '@fontlab/latin'
import { parseNum }                                                           from '@typen/numeral'
import { ob }                                                                 from '@vect/object-init'
import { indexed }                                                            from '@vect/object-mapper'
import { union }                                                              from '@vect/vector-algebra'
import { Stat }                                                               from '@vect/vector-stat'
import { masterToJson }                                                       from './masterToJson.js'

export class Master {
  /** @type {string}         */ name
  /** @type {KerningClasses} */ kerningClasses
  /** @type {KerningPairs}          */ pairs

  constructor(name, kerningClasses, pairs) {
    this.name = name
    this.kerningClasses = kerningClasses
    this.pairs = pairs
  }
  static build(name, kerningClasses, pairs) {
    return new Master(name, kerningClasses, pairs)
  }
  static from(name, master) {
    const kerningClasses = KerningClasses.from(master.kerningClasses)
    const pairs = KerningPairs.from(master.pairs ?? {})
    return new Master(name, kerningClasses, pairs)
  }

  get groups() { return this.kerningClasses }

  collectGlyphs(side) {
    const groupGlyphs = this.kerningClasses.collectGlyphs(side)
    const pairsGlyphs = this.pairs.collectGlyphs(side)
    return union(groupGlyphs, pairsGlyphs)
  }

  /**
   * Gets flattened kerning pairs by combining individual pairs with class-based pairs.
   * For left-side kerningClasses, it uses glyph kerningClasses selected by Side.Left.
   * For right-side kerningClasses, it uses glyph kerningClasses selected by Side.Right.
   * @returns {KerningPairs} Flattened kerning pairs combining individual and class-based pairs
   */
  get flatPairs() {
    return this.pairs.flatten(this.kerningClasses)
  }

  updatePairs(nextPairs) {
    return this.pairs.overwrite(nextPairs)
  }

  regroup(groups, xGlyphs, yGlyphs) {
    if (!xGlyphs) xGlyphs = this.collectGlyphs(Side.Left)
    if (!yGlyphs) yGlyphs = this.collectGlyphs(Side.Right)
    const groupedLeft = glyphGroupsToGrouped.call(groups, Side.Left)
    const groupedRight = glyphGroupsToGrouped.call(groups, Side.Right)
    const surjectLeft = glyphGroupedToSurject.apply(groupedLeft, xGlyphs)  // ...master.glyphs(Left), ...typeface.glyphs(layer)
    const surjectRight = glyphGroupedToSurject.apply(groupedRight, yGlyphs)  // ...master.glyphs(Right), ...typeface.glyphs(layer)
    const groupedX = surjectToGrouped(surjectLeft)
    const groupedY = surjectToGrouped(surjectRight)
    const filter = (k, v) => AT.test(k) && v?.length
    const toLeft = (k, v) => [ k = trimAT(k), KerningClass.left(k, v) ]
    const toRight = (k, v) => [ k = trimAT(k), KerningClass.right(k, v) ]
    return Master.build(
      this.name,
      ob(...indexed(groupedX, filter, toLeft), ...indexed(groupedY, filter, toRight)),
      this.flatPairs.regroup(surjectLeft, surjectRight, Stat.min),
    )
  }

  groupCrostab(mode = MIN, scopeX, scopeY, into) {
    const filterX = Latin.factory(scopeX), filterY = Latin.factory(scopeY)
    const iter = indexedNested(this.pairs, (x, y) => filterX(baseGlyph(x)) && filterY(baseGlyph(y)), coordToNum)
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
