import { groupedToSurject, surjectToGrouped }    from '@analys/convert'
import { MIN }                                   from '@analys/enum-pivot-mode'
import { indexed as indexedNested, Stat }        from '@analyz/sparse'
import { CONVERT_OPTIONS }                       from '@fontlab/constants'
import { Side }                                  from '@fontlab/enum-side'
import { Group, Grouped, LetterGrouped }         from '@fontlab/kerning-class'
import { AT, getGlyph, glyphTrim, offAT, Pairs } from '@fontlab/kerning-pairs'
import { Latin }                                 from '@fontlab/latin'
import { parseNum }                              from '@typen/numeral'
import { ob }                                    from '@vect/object-init'
import { indexed }                               from '@vect/object-mapper'
import { union }                                 from '@vect/vector-algebra'
import { Stat as ListStat }                      from '@vect/vector-stat'
import { masterToJson }                          from './masterToJson'

export class Master {
  /** @type {string}                                      */ name
  /** @type {Object<string,Group>}                        */ grouped
  /** @type {Object<string,Object<string,string|number>>} */ pairs

  constructor(name, grouped, pairs) {
    this.name = name
    this.grouped = grouped
    this.pairs = pairs
  }
  static build(name, grouped, body) { return new Master(name, grouped, body) }
  static keyVFM(name, vfm) { return new Master(name, Grouped.from(vfm.kerningClasses ?? []), vfm.pairs ?? {}) }

  get kerningClasses() { return Object.values(this.grouped) }

  glyphs(side) {
    let glyphs = Object.keys(groupedToSurject(Grouped.select(this.grouped, side)))
    if (side & 1) glyphs = union(glyphs, Pairs.prototype.head.call(this.pairs).map(glyphTrim))
    if (side & 2) glyphs = union(glyphs, Pairs.prototype.side.call(this.pairs).map(glyphTrim))
    return glyphs
  }

  get flattenPairs() {
    const groupedX = Grouped.select(this.grouped, Side.Verso)
    const groupedY = Grouped.select(this.grouped, Side.Recto)
    return Pairs.prototype.flatten.call(this.pairs, groupedX, groupedY)
  }
  updatePairs(nextPairs) {
    return Pairs.prototype.update.call(this.pairs, nextPairs)
  }
  regroup(regroups, xGlyphs, yGlyphs) {
    const { Verso, Recto } = Side, { toSurject } = LetterGrouped.prototype
    if (!xGlyphs) xGlyphs = this.glyphs(Verso)
    if (!yGlyphs) yGlyphs = this.glyphs(Recto)
    const surjV = toSurject.apply(Grouped.from(regroups, Verso), xGlyphs)  // ...master.glyphs(Verso), ...pheno.glyphs(layer)
    const surjR = toSurject.apply(Grouped.from(regroups, Recto), yGlyphs)  // ...master.glyphs(Recto), ...pheno.glyphs(layer)
    const groupedV = surjectToGrouped(surjV)
    const groupedR = surjectToGrouped(surjR)
    const
      by = (k, v) => AT.test(k) && v?.length,
      toVerso = (k, v) => [ k = offAT(k), Group.verso(k, v) ],
      toRecto = (k, v) => [ k = offAT(k), Group.recto(k, v) ]
    return Master.build(
      this.name,
      ob(...indexed(groupedV, by, toVerso), ...indexed(groupedR, by, toRecto)),
      Pairs.prototype.regroup.call(this.flattenPairs, surjV, surjR, ListStat.min)
    )
  }

  groupCrostab(mode = MIN, scopeX, scopeY, po) {
    const xBy = Latin.factory(scopeX), yBy = Latin.factory(scopeY)
    const iter = indexedNested(this.pairs, (x, y) => xBy(getGlyph(x)) && yBy(getGlyph(y)), coordToNum)
    return Stat.of(mode).collect(iter).crostab(po, '')
  }
  flattenCrostab(mode = MIN, scopeX, scopeY, po) {
    const xBy = Latin.factory(scopeX), yBy = Latin.factory(scopeY)
    const iter = indexedNested(this.flattenPairs, (x, y) => xBy(x) && yBy(y), coordToNum)
    return Stat.of(mode).collect(iter).crostab(po, '')
  }

  toJson(options = CONVERT_OPTIONS) { return masterToJson.call(options, this) }
}

export function coordToNum(x, y, v) { return [ x, y, parseNum(v) ] }
