import { groupedToSurject }    from '@analys/convert'
import { toSideCheck }         from '@fontlab/enum-side'
import { valid }               from '@typen/nullish'
import { mapKey }              from '@vect/object-mapper'
import { KerningClass }        from './KerningClass.js'
import { glyphGroupAscending } from './utils/glyphGroupAscending.js'

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

  selectSide(side) {
    return new KerningClasses(...this.filter(toSideCheck(side)))
  }

  collectGlyphs(side) {
    return Object.keys(this.toSurject(side))
  }

  /**
   * Expands each kerning class in the collection by adding glyphs from a provided group scheme.
   * For each glyph key in every kerning class, if the key exists in the group scheme, all glyphs
   * from the corresponding group scheme entry are added to the kerning class.
   * 
   * This method is useful for expanding abbreviated or base glyph references into complete sets
   * of related glyphs based on a predefined grouping scheme (e.g., expanding 'A' to include
   * 'Aacute', 'Acircumflex', etc.).
   * 
   * @param {Object<string, Array<string>>} expandable - A mapping of base glyphs or keys to arrays of glyphs.
   *        For example: { 'A': ['A', 'Aacute', 'Acircumflex', 'Adieresis'], 'B': ['B', 'Bhook'] }
   * @returns {KerningClasses} The current KerningClasses instance, modified in place for method chaining.
   * 
   * @example
   * // Create a simple KerningClasses collection
   * const kerningClasses = KerningClasses.build([
   *   new KerningClass(Side.Left, '@A_GROUP', ['A']),
   *   new KerningClass(Side.Right, '@B_GROUP', ['B'])
   * ]);
   * 
   * // Define a group scheme for expansion
   * const groupScheme = {
   *   'A': ['A', 'Aacute', 'Acircumflex', 'Adieresis'],
   *   'B': ['B', 'Bhook', 'Bmacron']
   * };
   * 
   * // Expand the kerning classes
   * const expandedClasses = kerningClasses.expand(groupScheme);
   * 
   * // Result: Each kerning class now contains all related glyphs from the group scheme
   * // @A_GROUP will contain: ['A', 'Aacute', 'Acircumflex', 'Adieresis']
   * // @B_GROUP will contain: ['B', 'Bhook', 'Bmacron']
   */
  expand(expandable) {
    for (const kerningClass of this) {
      for (const key of kerningClass) {
        if (key in expandable) kerningClass.union(expandable[key])
      }
    }
    return this
  }

  toGrouped(side) {
    const groups = valid(side) ? this.filter(toSideCheck(side)) : this
    const target = {}
    for (let group of groups.sort(glyphGroupAscending)) target[group.name] = KerningClass.build(group)
    return target
  }

  toSurject(side, addAT = false) {
    const grouped = this.toGrouped(side, addAT)
    return groupedToSurject(addAT ? mapKey(grouped, k => '@' + k) : grouped)
  }
}