import { IMMUT }                                          from '@analys/enum-mutabilities'
import { readTableCollection, tableCollectionToWorkbook } from '@analys/excel'
import { FONTLAB, GLYPH, LABEL }                          from '@fontlab/constants'
import { Scope }                                          from '@fontlab/enum-scope'
import { deco, decoFlat, decoString, decoTable }          from '@spare/logger'
import { says }                                           from '@spare/xr'
import { indexedBy, mapKey }                              from '@vect/object-mapper'
import xlsx                                               from 'xlsx'
import { PhenoIO }                                        from './PhenoIO'

const CLASS = 'PhenoMetricsIO'
const len3 = g => g.length <= 3

export class PhenoMetricsIO {
  static async exportSidebearings(srcVfm, destXlsx) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    const
      upper = pheno.sidebearingTable(Scope.Upper),
      lower = pheno.sidebearingTable(Scope.Lower),
      other = pheno.sidebearingTable(Scope.Other)
    const
      upper_brief = upper.filter({ field: GLYPH, filter: len3 }, IMMUT),
      lower_brief = lower.filter({ field: GLYPH, filter: len3 }, IMMUT),
      other_brief = other.filter({ field: LABEL, filter: len3 }, IMMUT)

    upper_brief |> decoTable |> says[FONTLAB].br(CLASS).br('exportSidebearings').br('upper-brief')
    lower_brief |> decoTable |> says[FONTLAB].br(CLASS).br('exportSidebearings').br('lower-brief')
    other_brief |> decoTable |> says[FONTLAB].br(CLASS).br('exportSidebearings').br('other-brief')

    const tableCollection = mapKey({
      upper,
      lower,
      other,
      upper_brief,
      lower_brief,
      other_brief,
    }, k => k.replace(/_/g, '-'))
    const workbook = tableCollectionToWorkbook(tableCollection)
    xlsx.writeFile(workbook, destXlsx);
    `[dest] (${destXlsx |> decoString})` |> says[FONTLAB].br(CLASS).br('exportSidebearings')
  }

  static async importSidebearings(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const tableCollection = readTableCollection(srcXlsx)
    for (let [ scope, table ] of indexedBy(tableCollection, (name, table) => /\W/.test(name) && table?.height)) {
      const layerToCount = pheno.updateMetrics(table)
      layerToCount |> decoFlat |> says[FONTLAB].br(CLASS).br('importSidebearings').br(scope).p('changed')
    }
    const
      upper = pheno.sidebearingTable(Scope.Upper).filter({ field: GLYPH, filter: len3 }, IMMUT),
      lower = pheno.sidebearingTable(Scope.Lower).filter({ field: GLYPH, filter: len3 }, IMMUT),
      other = pheno.sidebearingTable(Scope.Other).filter({ field: LABEL, filter: len3 }, IMMUT)

    upper |> decoTable |> says[FONTLAB].br(CLASS).br('importSidebearings').br('upper-brief')
    lower |> decoTable |> says[FONTLAB].br(CLASS).br('importSidebearings').br('lower-brief')
    other |> decoTable |> says[FONTLAB].br(CLASS).br('importSidebearings').br('other-brief')
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }

  static async readAlphabetGroups(srcVfm) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    pheno.alphabetGrouped() |> deco  |>  says[FONTLAB].br(CLASS).br('alphabetGroups')
    // alphabetByLayer |> decoCrostab  |> says[FONTLAB].br(CLASS).br(ros('alphabetByLayer'))
    // await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
  }
}
