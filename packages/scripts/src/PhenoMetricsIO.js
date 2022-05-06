import { readTableCollection, tableCollectionToWorkbook } from '@analys/excel'
import { Scope }                                          from '@fontlab/enum-scope'
import { FONTLAB, GLYPH }                                 from '@fontlab/pheno'
import { deco, decoString, decoTable }                    from '@spare/logger'
import { says }                                           from '@spare/xr'
import { filterIndexed, indexed }                         from '@vect/object-mapper'
import xlsx                                               from 'xlsx'
import { PhenoIO }                                        from './PhenoIO'

const CLASS = 'PhenoMetricsIO'

export class PhenoMetricsIO {
  static async exportSidebearings(srcVfm, destXlsx) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    const tableCollection = {
      upper: pheno.sidebearingTable(Scope.Upper),
      lower: pheno.sidebearingTable(Scope.Lower),
      other: pheno.sidebearingTable(Scope.Other),
    }
    for (let [ scope, table ] of filterIndexed(tableCollection, (_, table) => table?.height)) {
      table.filter({ field: GLYPH, filter(g) { return g.length <= 2} }, { mutate: false })
        |> decoTable |> says[FONTLAB].br(CLASS).br('exportSidebearings').br(scope)
    }
    const workbook = tableCollectionToWorkbook(tableCollection)
    xlsx.writeFile(workbook, destXlsx);
    `[dest] (${destXlsx |> decoString})` |> says[FONTLAB].br(CLASS).br('exportSidebearings')
  }

  static async importSidebearings(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const tableCollection = readTableCollection(srcXlsx)
    for (let [ scope, table ] of filterIndexed(tableCollection, (_, table) => table?.height)) {
      const layerToCount = pheno.mutateSidebearings(table)
      layerToCount |> deco |> says[FONTLAB].br(CLASS).br('importSidebearings').br(scope).p('changed')
    }
    const readCollection = {
      upper: pheno.sidebearingTable(Scope.Upper),
      lower: pheno.sidebearingTable(Scope.Lower),
      other: pheno.sidebearingTable(Scope.Other),
    }
    for (let [ scope, table ] of indexed(readCollection)) {
      table.filter({ field: GLYPH, filter(g) { return g.length <= 2} }, { mutate: false })
        |> decoTable |> says[FONTLAB].br(CLASS).br('importSidebearings').br(scope)
    }
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }

  static async readAlphabetGroups(srcVfm) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    pheno.alphabetGrouped() |> deco  |>  says[FONTLAB].br(CLASS).br('alphabetGroups')
    // alphabetByLayer |> decoCrostab  |> says[FONTLAB].br(CLASS).br(ros('alphabetByLayer'))
    // await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
  }
}
