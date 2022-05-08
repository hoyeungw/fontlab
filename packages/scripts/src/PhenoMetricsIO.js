import { IMMUTABLE }                                      from '@analys/enum-mutabilities'
import { readTableCollection, tableCollectionToWorkbook } from '@analys/excel'
import { Scope }                                          from '@fontlab/enum-scope'
import { stringValue }                                    from '@fontlab/latin'
import { FONTLAB, GLYPH }                                 from '@fontlab/pheno'
import { deco, decoFlat, decoString, decoTable }          from '@spare/logger'
import { says }                                           from '@spare/xr'
import { indexed, indexedBy, mapEntry }                   from '@vect/object-mapper'
import xlsx                                               from 'xlsx'
import { PhenoIO }                                        from './PhenoIO'

const CLASS = 'PhenoMetricsIO'
function ascLocal(a, b) { return a.length === b.length ? stringValue(a) - stringValue(b) : a.length - b.length }

export class PhenoMetricsIO {
  static async exportSidebearings(srcVfm, destXlsx) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    const tableCollection = {
      upper: pheno.sidebearingTable(Scope.Upper).sort(GLYPH, ascLocal),
      lower: pheno.sidebearingTable(Scope.Lower).sort(GLYPH, ascLocal),
      other: pheno.sidebearingTable(Scope.Other),
    }
    const FILTER_SPEC = { field: GLYPH, filter(g) { return g.length <= 2} }
    const briefCollection = mapEntry(tableCollection, (scope, table) => [ scope + '-brief', table.filter(FILTER_SPEC, IMMUTABLE) ])
    for (let [ scope, table ] of indexed(briefCollection)) {
      table.filter({ field: GLYPH, filter(g) { return g.length <= 2} }, IMMUTABLE)
        |> decoTable |> says[FONTLAB].br(CLASS).br('exportSidebearings').br(scope)
    }
    const workbook = tableCollectionToWorkbook({ ...tableCollection, ...briefCollection })
    xlsx.writeFile(workbook, destXlsx);
    `[dest] (${destXlsx |> decoString})` |> says[FONTLAB].br(CLASS).br('exportSidebearings')
  }

  static async importSidebearings(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const tableCollection = readTableCollection(srcXlsx)
    for (let [ scope, table ] of indexedBy(tableCollection, (name, table) => /\W/.test(name) && table?.height)) {
      const layerToCount = pheno.mutateSidebearings(table)
      layerToCount |> decoFlat |> says[FONTLAB].br(CLASS).br('importSidebearings').br(scope).p('changed')
    }
    const readCollection = {
      upper: pheno.sidebearingTable(Scope.Upper),
      lower: pheno.sidebearingTable(Scope.Lower),
      other: pheno.sidebearingTable(Scope.Other),
    }
    for (let [ scope, table ] of indexed(readCollection)) {
      table.filter({ field: GLYPH, filter(g) { return g.length <= 2} }, IMMUTABLE)
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
