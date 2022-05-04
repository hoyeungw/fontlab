import { parsePath }             from '@acq/path'
import { crostabToNested }       from '@analys/convert'
import { readCrostabCollection } from '@analys/excel'
import { FONTLAB }               from '@fontlab/pheno'
import { decoCrostab, says }     from '@spare/logger'
import { $ }                     from '@spare/xr'
import { indexed }               from '@vect/object-mapper'
import { existsSync, promises }  from 'fs'
import { MasterIO }              from './MasterIO'
import { PhenoIO }               from './PhenoIO'

const REGULAR = 'Regular'
const CLASS = 'PhenoPairsIO'

export class PhenoPairsIO {
  static async exportPairs(srcVfm, dest) {
    const { base } = parsePath(srcVfm)
    const pheno = await PhenoIO.readPheno(srcVfm)
    const target = dest + '/' + base + '.xlsx'
    MasterIO.savePairs(pheno.master(REGULAR), dest + '/' + base + '.xlsx')
    $['saved'](target) |> says[FONTLAB].br(CLASS).br('exportPairs')
  }

  static async importPairs(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const crostabs = readCrostabCollection(srcXlsx)
    for (let [ key, crostab ] of indexed(crostabs)) pheno.mutatePairs(crostab|> crostabToNested)
    for (let [ key, crostab ] of indexed(crostabs)) {
      const [ scopeX, scopeY ] = key.split('_')
      if (crostab.height <= 48 && crostab.width <= 24) {
        crostab |> decoCrostab |> says[FONTLAB].br(CLASS).br('importPairs').br(scopeX).br(scopeY)
      }
    }
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }
}


