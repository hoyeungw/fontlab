import { groupedToSurject }       from '@analys/convert'
import { Latin, stringAscending } from '@fontlab/latin'
import { valid }                  from '@typen/nullish'
import { mapKeyValue }            from '@vect/object-mapper'
import { filterByValue }          from '@vect/object-select'
import { SideUtil }               from '../asset'
import { Group }                  from './Group'

export class Grouped {
  static fromSamples(samples) {
    samples.sort((a, b) => a.side === b.side ? stringAscending(a.name, b.name) : a.side - b.side)
    return Object.fromEntries(samples.map((group) => [ group.name, Group.build(group) ]))
  }
  static makeGlyphToRegroup(grouped, regroupScheme) {
    const glyphToPrevGroup = grouped|> groupedToSurject
    const letterToNextGroup = regroupScheme |> groupedToSurject
    // glyphToPrevGroup |> deco |> says['Grouped'].br('glyphToPrevGroup')
    // letterToNextGroup |> deco |> says['Grouped'].br('letterToNextGroup')
    const toGroup = letter => valid(letterToNextGroup[letter]) ? ('@' + letterToNextGroup[letter]) : letter
    return mapKeyValue(glyphToPrevGroup, glyph => glyph|> Latin.letter|> toGroup)
  }
  static select(grouped, side) { return filterByValue(grouped, SideUtil.filterFactory(side)) }
}