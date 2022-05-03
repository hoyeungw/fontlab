import { groupedToSurject }       from '@analys/convert'
import { Latin, stringAscending } from '@fontlab/latin'
import { valid }                  from '@typen/nullish'
import { vectorToObject }         from '@vect/object-init'
import { filterByValue }          from '@vect/object-select'
import { SideUtil }               from '../asset'
import { Group }                  from './Group'

export class Grouped {
  static fromSamples(samples) {
    samples.sort((a, b) => a.side === b.side ? stringAscending(a.name, b.name) : a.side - b.side)
    return Object.fromEntries(samples.map((group) => [ group.name, Group.build(group) ]))
  }
  static select(grouped, side) { return filterByValue(grouped, SideUtil.filterFactory(side)) }
  static glyphsToSurject(glyphs, letterGrouped) {
    const letterToNextGroup = letterGrouped|> groupedToSurject
    const toGroup = letter => valid(letterToNextGroup[letter]) ? ('@' + letterToNextGroup[letter]) : letter
    return vectorToObject(glyphs, glyph => glyph|> Latin.letterOrSelf|> toGroup)
  }
}