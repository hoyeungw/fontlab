import { parsePath }                   from '@acq/path'
import { groupedToSurject }            from '@analys/convert'
import { UNION }                       from '@analys/enum-join-modes'
import { tableCollectionToWorkbook }   from '@analys/excel'
import { Table }                       from '@analys/table'
import { merge }                       from '@analys/table-join'
import { Scope }                       from '@fontlab/enum-scope'
import { Side, sideName }              from '@fontlab/enum-side'
import { Grouped }                     from '@fontlab/kerning-class'
import { asc, Latin }                  from '@fontlab/latin'
import { getGlyph }                    from '@fontlab/master'
import { FONTLAB, GLYPH }              from '@fontlab/pheno'
import { deco, decoString, decoTable } from '@spare/logger'
import { says }                        from '@spare/xr'
import { indexed }                     from '@vect/object-mapper'
import xlsx                            from 'xlsx'
import { GROUPS_CHALENE }              from '../../../resources/schemes/GROUPS_CHALENE'
import { decoKerningClasses }          from '../utils/decoKerningClasses'
import { PhenoIO }                     from './PhenoIO'

const CLASS = 'PhenoGroupsIO'
const LAYER = 'Regular'

export class PhenoGroupsIO {
  static async exportRegrouped(srcVfm, destVfm, regroups = GROUPS_CHALENE, logLayer = LAYER) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    pheno.mutateGroups(regroups)
    pheno.master(logLayer).kerningClasses |> decoKerningClasses |> says[FONTLAB].br(CLASS).br('exportRegrouped').kerningClasses(logLayer)
    pheno.master(logLayer).pairs |> deco |> says[FONTLAB].br(CLASS).br('exportRegrouped').pairs(logLayer)
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
    const { dir, base } = parsePath(destVfm)
    await PhenoIO.saveClasses(pheno, dir + '/' + base + '.json',)
  }
  static async exportRegroupsScheme(groups, destXlsx) {
    const
      { Verso, Recto } = Side,
      { Lower, Upper } = Scope,
      JOIN_SPEC = { fields: [ GLYPH ], joinType: UNION, fillEmpty: '' }
    function groupsToTable(groups, side, scope) {
      const filter = Latin.factory(scope)
      const surject = Grouped.from(groups.filter(({ name }) => filter(getGlyph(name))), side)|> groupedToSurject
      return Table.from({ title: side = sideName(side), head: [ GLYPH, side ], rows: [ ...indexed(surject) ] })
    }
    const tableCollection = {
      upper: Table.from(merge.call(JOIN_SPEC, groupsToTable(groups, Verso, Upper), groupsToTable(groups, Recto, Upper))).sort(GLYPH, asc),
      lower: Table.from(merge.call(JOIN_SPEC, groupsToTable(groups, Verso, Lower), groupsToTable(groups, Recto, Lower))).sort(GLYPH, asc)
    }
    tableCollection.upper |> decoTable |> says[FONTLAB].br(CLASS).br('exportRegroupsScheme').br('upper')
    tableCollection.lower |> decoTable |> says[FONTLAB].br(CLASS).br('exportRegroupsScheme').br('lower')
    xlsx.writeFile(tableCollectionToWorkbook(tableCollection), destXlsx);
    `[dest] (${destXlsx |> decoString})` |> says[FONTLAB].br(CLASS).br('exportRegroupsScheme')
  }
}
