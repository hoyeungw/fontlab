import { parsePath }              from '@acq/path'
import { readCrostabCollection }  from '@analys/excel'
import { MasterIO }               from '@fontlab/master'
import { decoCrostab, ros, says } from '@spare/logger'
import { camelToSnake }           from '@texting/phrasing'
import { indexed }                from '@vect/object-mapper'
import { promises }               from 'fs'
import { PhenoIO }                from './PhenoIO'

const LAYER = 'Regular'
const SRC = './resources'
const DEST = './static'

export class PhenoPairsIO {
  static async exportPairs(srcVfm, destXlsx) {
    const { base } = parsePath(srcVfm)
    const pheno = await PhenoIO.readPheno(srcVfm)
    const target = DEST + '/' + base + '.xlsx'
    MasterIO.savePairsToExcel(pheno.master(LAYER), destXlsx);
    `[saved] (${target})` |> console.log
  }
  static async importPairs(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const crostabs = readCrostabCollection(srcXlsx)
    for (let [ key, crostab ] of indexed(crostabs)) pheno.updatePairsByCrostab(crostab)
    for (let [ key, crostab ] of indexed(crostabs)) {
      const [ scopeX, scopeY ] = key.split('_')
      if (crostab.height <= 48 && crostab.width <= 24) {
        crostab |> decoCrostab |> says[camelToSnake('excelToMasterPairs')].br(ros(scopeX) + '_' + ros(scopeY))
      }
    }
    await pheno.save(destVfm, { groups: true, pairs: true, metrics: true })
  }
  static async separateVfm(srcVfm) {
    const { dir, base, ext } = parsePath(srcVfm)
    const pheno = await PhenoIO.readPheno(srcVfm)
    await promises.mkdir(dir + '/' + base)
    await pheno.save(dir + '/' + base + '/' + base + '-groups' + ext, { groups: true })
    await pheno.save(dir + '/' + base + '/' + base + '-pairs' + ext, { pairs: true })
    await pheno.save(dir + '/' + base + '/' + base + '-metrics' + ext, { metrics: true })
  }
}


const BASE = 'Chalene'
// Scripts.separateVfm(SRC + '/' + BASE + '.vfm').then()
PhenoPairsIO.exportPairs(SRC + '/' + BASE + '.vfm', DEST + '/' + BASE + '.xlsx').then()
// Scripts.importPairs(SRC + '/' + BASE + '.vfm', DEST + '/' + BASE + '.xlsx').then()
