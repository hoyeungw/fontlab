import { parsePath }              from '@acq/path'
import { readCrostabCollection }  from '@analys/excel'
import { MasterIO }               from '@fontlab/master'
import { decoCrostab, ros, says } from '@spare/logger'
import { camelToSnake }           from '@texting/phrasing'
import { indexed }                from '@vect/object-mapper'
import { promises }               from 'fs'
import { Profile }                from '../Profile'

const LAYER = 'Regular'
const SRC = './resources'
const DEST = './static'

export class Scripts {
  static async exportPairs(sourceVfm, targetXlsx) {
    const { base } = parsePath(sourceVfm)
    const profile = await Profile.fromFile(sourceVfm)
    const target = DEST + '/' + base + '.xlsx'
    MasterIO.savePairsToExcel(profile.master(LAYER), targetXlsx);
    `[saved] (${target})` |> console.log
  }
  static async importPairs(targetVfm, sourceXlsx) {
    const profile = await Profile.fromFile(targetVfm)
    const crostabs = readCrostabCollection(sourceXlsx)
    for (let [ key, crostab ] of indexed(crostabs)) profile.updatePairsByCrostab(crostab)
    for (let [ key, crostab ] of indexed(crostabs)) {
      const [ scopeX, scopeY ] = key.split('_')
      if (crostab.height <= 48 && crostab.width <= 24) {
        crostab |> decoCrostab |> says[camelToSnake('excelToMasterPairs')].br(ros(scopeX) + '_' + ros(scopeY))
      }
    }
    await profile.save(targetVfm, { groups: true, pairs: true, metrics: true })
  }
  static async separateVfm(sourceVfm) {
    const { dir, base, ext } = parsePath(sourceVfm)
    const profile = await Profile.fromFile(sourceVfm)
    await promises.mkdir(dir + '/' + base)
    await profile.save(dir + '/' + base + '/' + base + '-groups' + ext, { groups: true })
    await profile.save(dir + '/' + base + '/' + base + '-pairs' + ext, { pairs: true })
    await profile.save(dir + '/' + base + '/' + base + '-metrics' + ext, { metrics: true })
  }
}


const BASE = 'Chalene'
// Scripts.separateVfm(SRC + '/' + BASE + '.vfm').then()
Scripts.exportPairs(SRC + '/' + BASE + '.vfm', DEST + '/' + BASE + '.xlsx').then()
// Scripts.importPairs(SRC + '/' + BASE + '.vfm', DEST + '/' + BASE + '.xlsx').then()
