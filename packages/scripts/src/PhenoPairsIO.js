import { crostabToNested }                                    from '@analys/convert'
import { MIN }                                                from '@analys/enum-pivot-mode'
import { crostabCollectionToWorkbook, readCrostabCollection } from '@analys/excel'
import { round }                                              from '@aryth/math'
import { scopeName, SCOPES }                                  from '@fontlab/enum-scope'
import { FONTLAB }                                            from '@fontlab/pheno'
import { decoCrostab, decoFlat, decoString, logger }          from '@spare/logger'
import { says }                                               from '@spare/xr'
import { indexed }                                            from '@vect/object-mapper'
import xlsx                                                   from 'xlsx'
import { decoXY }                                             from '../utils/decoXY'
import { PhenoIO }                                            from './PhenoIO'

const REGULAR = 'Regular'
const CLASS = 'PhenoPairsIO'
// const size=({size:[h,w]})=>({ h, w })

// noinspection CommaExpressionJS
export class PhenoPairsIO {
  static async exportPairs(srcVfm, destXlsx, layer = REGULAR) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    const data = {}
    for (let x of SCOPES) {
      for (let y of SCOPES) {
        const xn = scopeName(x), yn = scopeName(y)
        const crostab = data[`${xn}_${yn}`] = pheno.master(layer).groupCrostab(MIN, x, y, x => isNaN(x) ? '' : round(x))
        const [ h, w ] = crostab.size;
        `${h} x ${w}` |> says[FONTLAB].br(CLASS).br('exportPairs').br(decoXY(xn, yn))
        crostab |> decoCrostab |> logger
      }
    }
    const workbook = crostabCollectionToWorkbook(data)
    xlsx.writeFile(workbook, destXlsx);
    `[dest] (${destXlsx |> decoString})` |> says[FONTLAB].br(CLASS).br('exportPairs')
  }

  static async importPairs(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const crostabCollection = readCrostabCollection(srcXlsx)
    for (let [ key, crostab ] of indexed(crostabCollection)) {
      if (!crostab) continue
      const layerToCount = pheno.mutatePairs(crostab|> crostabToNested)
      layerToCount |> decoFlat |> says[FONTLAB].br(CLASS).br('importPairs').p(decoXY(key))
    }
    for (let [ key, crostab ] of indexed(crostabCollection)) {
      if (!crostab) continue
      const [ h, w ] = crostab.size;
      ((h <= 48 && w <= 24) ? (crostab |> decoCrostab) : `${h} x ${w}`) |>  says[FONTLAB].br(CLASS).br('importPairs').p(decoXY(key))
    }
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }
}


