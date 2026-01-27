import { groupedToSurject } from '@analys/convert'
import { validator }        from '@fontlab/enum-side'
import { Latin }            from '@fontlab/latin'
import { nullish, valid }        from '@typen/nullish'
import { filterByValue }         from '@vect/object-select'
import { kerningClassAscending } from './kerningClassAscending.js'
import { KerningClass }          from '../KerningClass.js'


/**
 *
 * @this {{['1st'],['2nd'],name,names}[]}
 * @param {number} [side]
 * @returns {{}}
 */
export function kerningClassesToMultimap(side) {
  /** @type {KerningClass[]} */
  const kerningClasses = (valid(side)) ? this.filter(validator(side)) : this
  const groups = {}
  for (let kerningClass of kerningClasses.sort(kerningClassAscending)) {
    groups[kerningClass.name] = KerningClass.build(kerningClass)
  }
  return groups
}

export function kerningClassesSelectSide(side) {
  /** @type {KerningClass[]} */
  const kerningClasses = this
  return filterByValue(kerningClasses, validator(side))
}

/**
 * Converts this - a grouped object of glyphs to a surjective mapping of glyphs to class names.
 * @param {...string} inputGlyphs - List of glyph names to be mapped to classes
 * @returns {Object} Surjective mapping of input glyphs to class names
 */
export function kerningGroupsToSurject(...inputGlyphs) {
  /** @type {Object<string,string[]>} */
  const kerningGroups = this
  const surject = groupedToSurject(kerningGroups), target = {}
  let letter, group
  for (let glyph of inputGlyphs) {
    if (nullish(letter = Latin.letterOrNull(glyph)) || nullish(group = surject[letter])) continue
    target[glyph] = '@' + group
  }
  return target
}

export function kerningClassesToSurject(side) {
  /** @type {KerningClass[]} */
  const kerningClasses = (valid(side)) ? this.filter(validator(side)) : this
  const surject = {}
  for (let kerningClass of kerningClasses.sort(kerningClassAscending)) {
    surject[kerningClass.name] = KerningClass.build(kerningClass)
  }
  return surject
}