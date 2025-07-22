import { readTableCollection, tableCollectionToWorkbook } from '@analys/excel'
import { Table }                                          from '@analyz/table'
import { FONTLAB, GLYPH, LABEL }                          from '@fontlab/constants'
import { Scope }                                          from '@fontlab/enum-scope'
import { deco, decoFlat, decoString, decoTable }          from '@spare/logger'
import { $ }                                              from '@spare/xr'
import { indexed, indexedBy, mapKey, mutate }             from '@vect/object-mapper'
import xlsx                                               from 'xlsx'
import { TypefaceIO }                                     from './TypefaceIO.js'

const CLASS = 'MetricsIO'
const len3 = g => g.length <= 3

export class MetricsIO {
  static async exportSidebearings(srcVFM, destXlsx) {
    const typeface = await TypefaceIO.readTypeface(srcVFM)
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
    for (let [ title, table ] of indexed(briefCollection)) {
      console.log($.fontlab('task')[CLASS]('exportSidebearings')[title](decoTable(table)))
    }
    const collection = mapKey({ ...tableCollection, ...briefCollection }, k => k.replace(/_/g, '-'))
    const workbook = tableCollectionToWorkbook(collection)
    xlsx.writeFile(workbook, destXlsx)

    console.log($.fontlab('task')[CLASS]('export sidebearings').dest(decoString(destXlsx)))
  }

  static async importSidebearings(destVFM, srcXlsx) {
    const typeface = await TypefaceIO.readTypeface(destVFM)
    console.log($[FONTLAB](CLASS).reading(destVFM).p('as target'))
    // says[FONTLAB]('as target') // .br(CLASS).reading(destVFM)
    const tableCollection = mutate(readTableCollection(srcXlsx), Table.from)
    for (let [ scope, table ] of indexedBy(tableCollection, (k, tb) => !/\W/.test(k) && tb)) {
      const stat = typeface.updateMetrics(table)
      // console.log($.fontlab('task')[CLASS]('importSidebearings')[scope]('changed').p(decoFlat(stat)))
      console.log($.fontlab('->')[CLASS]('import sidebearings')[scope]('changed').p(decoFlat(stat)))
    }
    const briefCollection = {
      upper_brief: typeface.sidebearingTable(Scope.Upper).filter(GLYPH, len3),
      lower_brief: typeface.sidebearingTable(Scope.Lower).filter(GLYPH, len3),
      other_brief: typeface.sidebearingTable(Scope.Other).filter(LABEL, len3),
    }
    for (let [ title, table ] of indexed(briefCollection)) {
      console.log($.fontlab('task')[CLASS]('import sidebearings')[title](decoTable(table)))
    }
    await TypefaceIO.saveTypeface(typeface, destVFM, { groups: true, pairs: true, metrics: true })
  }

  static async readAlphabetGroups(srcVFM) {
    const typeface = await TypefaceIO.readTypeface(srcVFM)
    console.log($.fontlab(CLASS).read('alphabet groups')(deco(typeface.alphabetGrouped())))
    // alphabetByLayer |> decoCrostab  |> console.log($.fontlab(CLASS).calling(ros('alphabetByLayer'))
    // await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
  }
}
