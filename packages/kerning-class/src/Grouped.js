import { groupedToSurject } from '@analys/convert'
import { SideUtil }         from '@fontlab/enum-side'
import { asc, Latin }       from '@fontlab/latin'
import { nullish, valid }   from '@typen/nullish'
import { filterByValue }    from '@vect/object-select'
import { Group }            from './Group'

export const groupAscending = (a, b) => a.side === b.side ? asc(a.name, b.name) : a.side - b.side

export class Grouped {
  /**
   *
   * @param {{['1st'],['2nd'],name,names}[]} groups
   * @param {number} [side]
   * @returns {{}}
   */
  static from(groups, side) {
    if (valid(side)) groups = groups.filter(SideUtil.filterFactory(side))
    const o = {}
    for (let group of groups.sort(groupAscending)) o[group.name] = Group.build(group)
    return o
  }
  static select(grouped, side) { return filterByValue(grouped, SideUtil.filterFactory(side)) }
}

export class LetterGrouped {
  toSurject(...sourceGlyphs) {
    let medium = groupedToSurject(this), surject = {}, letter, group
    for (let glyph of sourceGlyphs) {
      if (nullish(letter = Latin.letterOrNull(glyph)) || nullish(group = medium[letter])) continue
      surject[glyph] = '@' + group
    }
    return surject
  }
}