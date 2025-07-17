import {
  readTableCollection,
  tableCollectionToWorkbook,
}                  from '@analys/excel'
import { Table }   from '@analyz/table'
import {
  FONTLAB,
  GLYPH,
  LABEL,
}                  from '@fontlab/constants'
import { Scope }   from '@fontlab/enum-scope'
import {
  deco,
  decoFlat,
  decoString,
  decoTable,
}                  from '@spare/logger'
import { says }    from '@spare/xr'
import {
  indexed,
  indexedBy,
  mapKey,
  mutate,
}                  from '@vect/object-mapper'
import xlsx        from 'xlsx'
import { PhenoIO } from './PhenoIO.js'

const CLASS = 'PhenoMetricsIO'
const len3 = g => g.length <= 3

export class PhenoMetricsIO {
  static async exportSidebearings(srcVfm, destXlsx) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    const tableCollection = {
      upper: pheno.sidebearingTable(Scope.Upper),
      lower: pheno.sidebearingTable(Scope.Lower),
      other: pheno.sidebearingTable(Scope.Other),
    }
    const briefCollection = {
      upper_brief: tableCollection.upper.filter(GLYPH, len3),
      lower_brief: tableCollection.lower.filter(GLYPH, len3),
      other_brief: tableCollection.other.filter(LABEL, len3),
    }
    for (let [title, table] of indexed(briefCollection)) {
      says[FONTLAB].br(CLASS).br('exportSidebearings').br(title)(decoTable(table))
    }
    const collection = mapKey({ ...tableCollection, ...briefCollection }, k => k.replace(/_/g, '-'))
    const workbook = tableCollectionToWorkbook(collection)
    xlsx.writeFile(workbook, destXlsx)
    says[FONTLAB].br(CLASS).br('exportSidebearings')(`[dest] (${(decoString(destXlsx))})`)
  }

  static async importSidebearings(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    says[FONTLAB].br(CLASS).reading(destVfm)('as target')
    const tableCollection = mutate(readTableCollection(srcXlsx), Table.from)
    for (let [scope, table] of indexedBy(tableCollection, (k, tb) => !/\W/.test(k) && tb)) {
      const stat = pheno.updateMetrics(table)
      says[FONTLAB].br(CLASS).br('importSidebearings').br(scope).p('changed')(decoFlat(stat))
    }
    const briefCollection = {
      upper_brief: pheno.sidebearingTable(Scope.Upper).filter(GLYPH, len3),
      lower_brief: pheno.sidebearingTable(Scope.Lower).filter(GLYPH, len3),
      other_brief: pheno.sidebearingTable(Scope.Other).filter(LABEL, len3),
    }
    for (let [title, table] of indexed(briefCollection)) {
      says[FONTLAB].br(CLASS).br('importSidebearings').br(title)(decoTable(table))
    }
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }

  static async readAlphabetGroups(srcVfm) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    says[FONTLAB].br(CLASS).br('alphabetGroups')(deco(pheno.alphabetGrouped()))
    // alphabetByLayer |> decoCrostab  |> says[FONTLAB].br(CLASS).br(ros('alphabetByLayer'))
    // await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
  }
}
