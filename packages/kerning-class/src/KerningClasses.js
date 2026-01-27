import { groupedToSurject }      from '@analys/convert'
import { validator }             from '@fontlab/enum-side'
import { valid }                 from '@typen/nullish'
import { mapKey }                from '@vect/object-mapper'
import { KerningClass }          from './KerningClass.js'
import { kerningClassAscending } from './utils/kerningClassAscending.js'
import { intersect }             from '@vect/vector-algebra'

export class KerningClasses extends Array {
  /**
   * Creates a KerningClasses instance from an array of KerningClass objects
   * @param {KerningClass} [kerningClass] - Array of KerningClass objects to initialize the collection.
   *        Each KerningClass should have properties: side, name, and list of glyphs.
   *        If not provided, create an empty collection.
   */
  constructor(...kerningClass) {
    if (kerningClass) { super(...Array.from(kerningClass)) } else { super() }
  }

  static collect(...kerningClasses) {return new KerningClasses(...kerningClasses)}
  static build(kerningClasses) { return new KerningClasses(...kerningClasses) }
  static from(kerningClasses) { return new KerningClasses(...kerningClasses.map(KerningClass.build)) }

  clone() { return new KerningClasses(...this.map(v => v.clone())) }

  selectSide(side) { return new KerningClasses(...this.filter(validator(side))) }

  collectGlyphs(side) { return Object.keys(this.toSurject(side)) }

  /**
   * Expands abbreviated or base glyph listed in kerning class into related glyphs
   * based on the input multimap (of base glyph to related glyphs),
   * e.g., expand 'A' to include 'A','À','Á','Â','Ã','Ä','Å'; 'E' to include 'È','É','Ê','Ë'.
   *
   * @param {Object<string, string[]>} multimap - Mapping of base glyph to related glyphs.
   * @returns {KerningClasses} This KerningClasses instance.
   *
   * @example multimap = {
   *   A: ['A','Agrave','Aacute,'Acircumflex','Atilde','Adieresis','Aring'],
   *   E: ['E','Egrave','Eacute',Ecircumflex','Edieresis']
   * }
   */
  expand(multimap) {
    for (const kerningClass of this) {
      for (const key of kerningClass) {
        if (key in multimap) kerningClass.union(multimap[key])
      }
    }
    return this
  }

  toMultimap(side) {
    /** @type {KerningClass[]} */
    const kerningClasses = valid(side) ? this.filter(validator(side)) : this
    const multimap = {}
    for (let kerningClass of kerningClasses.sort(kerningClassAscending)) {
      multimap[kerningClass.name] = KerningClass.build(kerningClass)
    }
    return multimap
  }

  toSurject(side, addAT = false) {
    const grouped = this.toMultimap(side, addAT)
    return groupedToSurject(addAT ? mapKey(grouped, k => '@' + k) : grouped)
  }
}