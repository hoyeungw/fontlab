import { readTableCollection, tableCollectionToWorkbook } from '@analys/excel'
import { Table }                                          from '@analyz/table'
import { FONTLAB, GLYPH, LABEL }                          from '@fontlab/constants'
import { Scope }                                          from '@fontlab/enum-scope'
import { deco, decoFlat, decoString, decoTable }          from '@spare/logger'
import { $ }                                              from '@spare/xr'
import { indexed, indexedBy, mapKey, mutate }             from '@vect/object-mapper'
import xlsx      from 'xlsx'
import { VFMIO } from './VFMIO.js'

const CLASS = 'MetricsIO'
const steL3 = g => g.length <= 3

export class MetricsIO {
  static async vfmToXlsx(srcVFM, destXLSX) {
    const typeface = await VFMIO.readFile(srcVFM)
    const tableCollection = {
      upper: typeface.sidebearingTable(Scope.Upper),
      lower: typeface.sidebearingTable(Scope.Lower),
      other: typeface.sidebearingTable(Scope.Other),
    }
    const briefCollection = {
      upper_brief: tableCollection.upper.filter(GLYPH, steL3),
      lower_brief: tableCollection.lower.filter(GLYPH, steL3),
      other_brief: tableCollection.other.filter(LABEL, steL3),
    }
    for (let [ title, table ] of indexed(briefCollection)) {
      console.log($.fontlab('task')[CLASS]('vfmToXlsx')[title](decoTable(table)))
    }
    const collection = mapKey({ ...tableCollection, ...briefCollection }, k => k.replace(/_/g, '-'))
    const workbook = tableCollectionToWorkbook(collection)
    xlsx.writeFile(workbook, destXLSX)

    console.log($.fontlab('task')[CLASS]('vfmToXlsx sidebearings').dest(decoString(destXLSX)))
  }

  static async xlsxToVfm(srcXLSX, destVFM) {
    const typeface = await VFMIO.readFile(destVFM)
    console.log($[FONTLAB](CLASS).reading(destVFM).p('as target'))
    // says[FONTLAB]('as target') // .br(CLASS).reading(destVFM)
    const tableCollection = mutate(readTableCollection(srcXLSX), Table.from)
    for (let [ scope, table ] of indexedBy(tableCollection, (k, tb) => !/\W/.test(k) && tb)) {
      const stat = typeface.updateMetrics(table)
      // console.log($.fontlab('task')[CLASS]('xlsxToVfm')[scope]('changed').p(decoFlat(stat)))
      console.log($.fontlab('->')[CLASS]('xlsxToVfm sidebearings')[scope]('changed').p(decoFlat(stat)))
    }
    const briefCollection = {
      upper_brief: typeface.sidebearingTable(Scope.Upper).filter(GLYPH, steL3),
      lower_brief: typeface.sidebearingTable(Scope.Lower).filter(GLYPH, steL3),
      other_brief: typeface.sidebearingTable(Scope.Other).filter(LABEL, steL3),
    }
    for (let [ title, table ] of indexed(briefCollection)) {
      console.log($.fontlab('task')[CLASS]('xlsxToVfm sidebearings')[title](decoTable(table)))
    }
    await VFMIO.saveTypeface(typeface, destVFM, { kerningClasses: true, pairs: true, metrics: true })
  }

  static async readAlphabetGroups(srcVFM) {
    const typeface = await VFMIO.readFile(srcVFM)
    console.log($.fontlab(CLASS).read('alphabet kerningClasses')(deco(typeface.alphabetGrouped())))
    // alphabetByLayer |> decoCrostab  |> console.log($.fontlab(CLASS).calling(ros('alphabetByLayer'))
    // await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
  }
}
