import { groupedToSurject }    from '@analys/convert'
import { toSideCheck }         from '@fontlab/enum-side'
import { Latin }               from '@fontlab/latin'
import { nullish, valid }      from '@typen/nullish'
import { filterByValue }       from '@vect/object-select'
import { glyphGroupAscending } from './glyphGroupAscending.js'
import { KerningClass }        from '../KerningClass.js'


/**
 *
 * @this {{['1st'],['2nd'],name,names}[]}
 * @param {number} [side]
 * @returns {{}}
 */
export function glyphGroupsToGrouped(side) {
  let groups = this
  if (valid(side)) groups = groups.filter(toSideCheck(side))
  const o = {}
  for (let group of groups.sort(glyphGroupAscending)) o[group.name] = KerningClass.build(group)
  return o
}

export function glyphGroupsSelectSide(side) {
  const groups = this
  return filterByValue(groups, toSideCheck(side))
}

/**
 * Converts this - a grouped object of glyphs to a surjective mapping of glyphs to class names.
 * @param {...string} inputGlyphs - List of glyph names to be mapped to classes
 * @returns {Object} Surjective mapping of input glyphs to class names
 */
export function glyphGroupedToSurject(...inputGlyphs) {
  const grouped = this
  const localSurject = groupedToSurject(grouped), surject = {}
  let letter, group
  for (let glyph of inputGlyphs) {
    if (nullish(letter = Latin.letterOrNull(glyph)) || nullish(group = localSurject[letter])) continue
    surject[glyph] = '@' + group
  }
  return surject
}

export function glyphGroupsToSurject(side) {
  let groups = this
  if (valid(side)) groups = groups.filter(toSideCheck(side))
  const o = {}
  for (let group of groups.sort(glyphGroupAscending)) o[group.name] = KerningClass.build(group)
  return o
}