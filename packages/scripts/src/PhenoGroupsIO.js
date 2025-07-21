import { parsePath }                 from '@acq/path'
import { groupedToSurject }          from '@analys/convert'
import { UNION }                     from '@analys/enum-join-modes'
import { tableCollectionToWorkbook } from '@analys/excel'
import { Table }                     from '@analyz/table'
import { Algebra }                   from '@analyz/table-algebra'
import { FONTLAB, GLYPH }            from '@fontlab/constants'
import { Scope }                     from '@fontlab/enum-scope'
import { Side, sideName }            from '@fontlab/enum-side'
import { Grouped }                   from '@fontlab/kerning-class'
import { getGlyph }                  from '@fontlab/kerning-pairs'
import { asc, Latin }                from '@fontlab/latin'
import { decoString, decoTable } from '@spare/logger'
import { $, says }               from '@spare/xr'
import { indexed }               from '@vect/object-mapper'
import { decoKerningClasses }        from '../utils/decoKerningClasses.js'
import { PhenoIO }                   from './PhenoIO.js'
import xlsx                          from 'xlsx'

const CLASS = 'PhenoGroupsIO'
const LAYER = 'Regular'

export class PhenoGroupsIO {
  static async exportRegrouped(srcVfm, destVfm, regroups, logLayer = LAYER) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    const layer = logLayer in pheno.layerToMaster ? logLayer : pheno.face
    pheno.updateMaster(regroups)
    console.log($.fontlab(CLASS).calling('export regrouped').br('kerning classes').pr(logLayer)(decoKerningClasses(pheno.master(layer).kerningClasses)))
    // pheno.master(layer).pairs |> deco |> console.log($.fontlab(CLASS).calling('exportRegrouped').br('pairs').pr(logLayer)
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
    const { dir, base } = parsePath(destVfm)
    await PhenoIO.saveClasses(pheno, dir + '/' + base + '.json')
  }
  static async exportRegroupsScheme(groups, destXlsx) {
    const { Verso, Recto } = Side, { Lower, Upper } = Scope

    function groupsToTable(groups, side, scope) {
      const filter = Latin.factory(scope)
      const surject = groupedToSurject(Grouped.from(groups.filter(({ name }) => filter(getGlyph(name))), side))
      return Table.build([GLYPH, side = sideName(side)], [...indexed(surject)], side)
    }

    const tableCollection = {
      upper: Algebra.join(UNION, [GLYPH], '', groupsToTable(groups, Verso, Upper), groupsToTable(groups, Recto, Upper)).sort(GLYPH, asc),
      lower: Algebra.join(UNION, [GLYPH], '', groupsToTable(groups, Verso, Lower), groupsToTable(groups, Recto, Lower)).sort(GLYPH, asc),
    }
    console.log($.fontlab(CLASS).calling('export regroups scheme').br('upper')(decoTable(tableCollection.upper)))
    console.log($.fontlab(CLASS).calling('export regroups scheme').br('lower')(decoTable(tableCollection.lower)))
    xlsx.writeFile(tableCollectionToWorkbook(tableCollection), destXlsx)
    console.log($.fontlab(CLASS).calling('export regroups scheme')(`[dest] (${(decoString(destXlsx))})`))
  }
}
