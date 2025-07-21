import { readTableCollection, tableCollectionToWorkbook } from '@analys/excel'
import { Table }                                          from '@analyz/table'
import { FONTLAB, GLYPH, LABEL }                          from '@fontlab/constants'
import { Scope }                                          from '@fontlab/enum-scope'
import { deco, decoFlat, decoString, decoTable }          from '@spare/logger'
import { $, says }                                        from '@spare/xr'
import { indexed, indexedBy, mapKey, mutate }             from '@vect/object-mapper'
import xlsx                                               from 'xlsx'
import { PhenoIO }                                        from './PhenoIO.js'

const CLASS = 'PhenoMetricsIO'
const len3 = g => g.length <= 3

export class PhenoMetricsIO {
  static async exportSidebearings(srcVfm, destXlsx) {
    const typeface = await PhenoIO.readPheno(srcVfm)
    const tableCollection = {
      upper: typeface.sidebearingTable(Scope.Upper),
      lower: typeface.sidebearingTable(Scope.Lower),
      other: typeface.sidebearingTable(Scope.Other),
    }
    const briefCollection = {
      upper_brief: tableCollection.upper.filter(GLYPH, len3),
      lower_brief: tableCollection.lower.filter(GLYPH, len3),
      other_brief: tableCollection.other.filter(LABEL, len3),
    }
    for (let [title, table] of indexed(briefCollection)) {
      says[FONTLAB]($[CLASS]('exportSidebearings')[title](decoTable(table)))
    }
    const collection = mapKey({ ...tableCollection, ...briefCollection }, k => k.replace(/_/g, '-'))
    const workbook = tableCollectionToWorkbook(collection)
    xlsx.writeFile(workbook, destXlsx)

    says[FONTLAB]($[CLASS]('export sidebearings').dest(decoString(destXlsx)))
  }

  static async importSidebearings(destVfm, srcXlsx) {
    const typeface2 = await PhenoIO.readPheno(destVfm)
    console.log($[FONTLAB](CLASS).reading(destVfm).p('as target'))
    // says[FONTLAB]('as target') // .br(CLASS).reading(destVfm)
    const tableCollection = mutate(readTableCollection(srcXlsx), Table.from)
    for (let [scope, table] of indexedBy(tableCollection, (k, tb) => !/\W/.test(k) && tb)) {
      const stat = typeface2.updateMetrics(table)
      // says[FONTLAB]($[CLASS]('importSidebearings')[scope]('changed').p(decoFlat(stat)))
      console.log($.fontlab('->')[CLASS]('import sidebearings')[scope]('changed').p(decoFlat(stat)))
    }
    const briefCollection = {
      upper_brief: typeface2.sidebearingTable(Scope.Upper).filter(GLYPH, len3),
      lower_brief: typeface2.sidebearingTable(Scope.Lower).filter(GLYPH, len3),
      other_brief: typeface2.sidebearingTable(Scope.Other).filter(LABEL, len3),
    }
    for (let [title, table] of indexed(briefCollection)) {
      says[FONTLAB]($[CLASS]('import sidebearings')[title](decoTable(table)))
    }
    await PhenoIO.savePheno(typeface2, destVfm, { groups: true, pairs: true, metrics: true })
  }

  static async readAlphabetGroups(srcVfm) {
    const typeface3 = await PhenoIO.readPheno(srcVfm)
    console.log($.fontlab(CLASS).calling('alphabet groups')(deco(typeface3.alphabetGrouped())))
    // alphabetByLayer |> decoCrostab  |> console.log($.fontlab(CLASS).calling(ros('alphabetByLayer'))
    // await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
  }
}
