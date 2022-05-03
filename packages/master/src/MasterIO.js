import { MIN }                                                from '@analys/enum-pivot-mode'
import { crostabCollectionToWorkbook, readCrostabCollection } from '@analys/excel'
import { scopeName, SCOPES }                                  from '@fontlab/latin'
import { decoCrostab, says }                                  from '@spare/logger'
import { cr }                                                 from '@spare/xr'
import xlsx                                                   from 'xlsx'

export class MasterIO {

  /**
   * @param {Master} master
   * @param {{['1st']:boolean,['2nd']:boolean,name,names}[]} regroupScheme
   * @param {string} [dest]
   */
  static regroup(master, regroupScheme, dest) {
    master.regroup(regroupScheme)
  }

  /**
   * @param {Master} master
   * @param {string} [dest]
   */
  static savePairsToExcel(master, dest) {
    const crostabCollection = {}
    const SPEC = { x: 'group.v', y: 'group.r', mode: MIN }
    for (let x of SCOPES) {
      for (let y of SCOPES) {
        const title = scopeName(x) + '_' + scopeName(y)
        const crostab = crostabCollection[title] = master.crostab({ scope: { x, y }, spec: SPEC, })
        cr('savePairsToExcel')[scopeName(x)](crostab.height)[scopeName(y)](crostab.width) |> says['MasterIO']
        crostab |> decoCrostab |> says['MasterIO']
        // .br(ros(camelToSnake('savePairsToExcel'))).br(ros(scopeName(x)) + '_' + ros(scopeName(y)))
      }
    }
    const workbook = crostabCollectionToWorkbook(crostabCollection)
    if (dest) xlsx.writeFile(workbook, dest)
  }

  /**
   *
   * @param {string} filename
   * @param {Master} master
   */
  static excelToPairsCrostabCollection(filename) {
    return readCrostabCollection(filename)
  }
}