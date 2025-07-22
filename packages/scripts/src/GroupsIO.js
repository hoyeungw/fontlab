import { parsePath }                 from '@acq/path'
import { groupedToSurject }          from '@analys/convert'
import { UNION }                     from '@analys/enum-join-modes'
import { tableCollectionToWorkbook } from '@analys/excel'
import { Table }                     from '@analyz/table'
import { Algebra }                   from '@analyz/table-algebra'
import { GLYPH }                     from '@fontlab/constants'
import { Scope }                     from '@fontlab/enum-scope'
import { Side, sideName }            from '@fontlab/enum-side'
import { Grouped }                   from '@fontlab/kerning-class'
import { getGlyph }                  from '@fontlab/kerning-pairs'
import { asc, Latin }                from '@fontlab/latin'
import { decoString, decoTable }     from '@spare/logger'
import { $ }                         from '@spare/xr'
import { indexed }                   from '@vect/object-mapper'
import { decoKerningClasses }        from '../utils/decoKerningClasses.js'
import { TypefaceIO }                from './TypefaceIO.js'
import xlsx                          from 'xlsx'

const CLASS = 'GroupsIO'
const LAYER = 'Regular'

export class GroupsIO {
  static async exportRegrouped(srcVFM, destVFM, regroups, logLayer = LAYER) {
    const typeface = await TypefaceIO.readTypeface(srcVFM)
    const layer = logLayer in typeface.layerToMaster ? logLayer : typeface.face
    typeface.updateMaster(regroups)
    console.log($.fontlab(CLASS).export('regrouped').br('kerning classes').pr(logLayer)(decoKerningClasses(typeface.master(layer).kerningClasses)))
    // typeface.master(layer).pairs |> deco |> console.log($.fontlab(CLASS).calling('exportRegrouped').br('pairs').pr(logLayer)
    await TypefaceIO.saveTypeface(typeface, destVFM, { groups: true, pairs: true, metrics: true })
    const { dir, base } = parsePath(destVFM)
    await TypefaceIO.saveClasses(typeface, dir + '/' + base + '.json')
  }

  static async exportRegroupsScheme(groups, destXlsx) {
    const { Left, Right } = Side, { Lower, Upper } = Scope

    function groupsToTable(groups, side, scope) {
      const filter = Latin.factory(scope)
      const surject = groupedToSurject(Grouped.from(groups.filter(({ name }) => filter(getGlyph(name))), side))
      return Table.build([ GLYPH, side = sideName(side) ], [ ...indexed(surject) ], side)
    }

    const tableCollection = {
      upper: Algebra.join(UNION, [ GLYPH ], '', groupsToTable(groups, Left, Upper), groupsToTable(groups, Right, Upper)).sort(GLYPH, asc),
      lower: Algebra.join(UNION, [ GLYPH ], '', groupsToTable(groups, Left, Lower), groupsToTable(groups, Right, Lower)).sort(GLYPH, asc),
    }
    console.log($.fontlab(CLASS).export('regroups scheme').br('upper')(decoTable(tableCollection.upper)))
    console.log($.fontlab(CLASS).export('regroups scheme').br('lower')(decoTable(tableCollection.lower)))
    xlsx.writeFile(tableCollectionToWorkbook(tableCollection), destXlsx)
    console.log($.fontlab(CLASS).export('regroups scheme')(`[dest] (${(decoString(destXlsx))})`))
  }
}
