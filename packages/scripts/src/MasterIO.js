import { MIN }                         from '@analys/enum-pivot-mode'
import { crostabCollectionToWorkbook } from '@analys/excel'
import { scopeName, SCOPES }           from '@fontlab/latin'
import { decoCrostab }                 from '@spare/logger'
import { $, says }                     from '@spare/xr'
import xlsx                            from 'xlsx'

export class MasterIO {
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
        $[scopeName(x)](crostab.height)[scopeName(y)](crostab.width) |> says['MasterIO'].br('savePairsToExcel')
        crostab |> decoCrostab |> says['MasterIO']
        // .br(ros(camelToSnake('savePairsToExcel'))).br(ros(scopeName(x)) + '_' + ros(scopeName(y)))
      }
    }
    const workbook = crostabCollectionToWorkbook(crostabCollection)
    if (dest) xlsx.writeFile(workbook, dest)
  }
}