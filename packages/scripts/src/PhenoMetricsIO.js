import { readTableCollection, tableCollectionToWorkbook } from '@analys/excel'
import { Table }                                          from '@analyz/table'
import { FONTLAB, GLYPH, LABEL }                          from '@fontlab/constants'
import { Scope }                                          from '@fontlab/enum-scope'
import { deco, decoFlat, decoString, decoTable }          from '@spare/logger'
import { says }                                           from '@spare/xr'
import { indexed, indexedBy, mapKey, mutate }             from '@vect/object-mapper'
import xlsx                                               from 'xlsx'
import { PhenoIO }                                        from './PhenoIO'

const CLASS = 'PhenoMetricsIO'
const len3 = g => g.length <= 3

export class PhenoMetricsIO {
  static async exportSidebearings(srcVfm, destXlsx) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    const tableCollection = {
      upper: pheno.sidebearingTable(Scope.Upper),
      lower: pheno.sidebearingTable(Scope.Lower),
      other: pheno.sidebearingTable(Scope.Other)
    }
    const briefCollection = {
      upper_brief: tableCollection.upper.filter(GLYPH, len3),
      lower_brief: tableCollection.lower.filter(GLYPH, len3),
      other_brief: tableCollection.other.filter(LABEL, len3),
    }
    for (let [ title, table ] of indexed(briefCollection)) {
      table |> decoTable |> says[FONTLAB].br(CLASS).br('exportSidebearings').br(title)
    }
    const collection = mapKey({ ...tableCollection, ...briefCollection }, k => k.replace(/_/g, '-'))
    const workbook = tableCollectionToWorkbook(collection)
    xlsx.writeFile(workbook, destXlsx);
    `[dest] (${destXlsx |> decoString})` |> says[FONTLAB].br(CLASS).br('exportSidebearings')
  }

  static async importSidebearings(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    'as target' |> says[FONTLAB].br(CLASS).reading(destVfm)
    const tableCollection = mutate(readTableCollection(srcXlsx), Table.from)
    for (let [ scope, table ] of indexedBy(tableCollection, (k, tb) => !/\W/.test(k) && tb)) {
      const stat = pheno.updateMetrics(table)
      stat |> decoFlat |> says[FONTLAB].br(CLASS).br('importSidebearings').br(scope).p('changed')
    }
    const briefCollection = {
      upper_brief: pheno.sidebearingTable(Scope.Upper).filter(GLYPH, len3),
      lower_brief: pheno.sidebearingTable(Scope.Lower).filter(GLYPH, len3),
      other_brief: pheno.sidebearingTable(Scope.Other).filter(LABEL, len3),
    }
    for (let [ title, table ] of indexed(briefCollection)) {
      table |> decoTable |> says[FONTLAB].br(CLASS).br('importSidebearings').br(title)
    }
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }

  static async readAlphabetGroups(srcVfm) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    pheno.alphabetGrouped() |> deco |> says[FONTLAB].br(CLASS).br('alphabetGroups')
    // alphabetByLayer |> decoCrostab  |> says[FONTLAB].br(CLASS).br(ros('alphabetByLayer'))
    // await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
  }
}
