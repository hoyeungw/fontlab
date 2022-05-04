import { parsePath }                                          from '@acq/path'
import { crostabToNested }                                    from '@analys/convert'
import { MIN }                                                from '@analys/enum-pivot-mode'
import { crostabCollectionToWorkbook, readCrostabCollection } from '@analys/excel'
import { scopeName, SCOPES }                                  from '@fontlab/latin'
import { FONTLAB }                                            from '@fontlab/pheno'
import { decoCrostab, decoFlat, decoString, logger }          from '@spare/logger'
import { says }                                               from '@spare/xr'
import { indexed }                                            from '@vect/object-mapper'
import xlsx                                                   from 'xlsx'
import { decoXY }                                             from '../utils/decoXY'
import { PhenoIO }                                            from './PhenoIO'

const REGULAR = 'Regular'
const CLASS = 'PhenoPairsIO'

// noinspection CommaExpressionJS
export class PhenoPairsIO {
  static async exportPairs(srcVfm, dest, layer = REGULAR) {
    const { base } = parsePath(srcVfm)
    const pheno = await PhenoIO.readPheno(srcVfm)
    const data = {}
    for (let x of SCOPES) {
      for (let y of SCOPES) {
        const verso = scopeName(x), recto = scopeName(y)
        const crostab = data[`${verso}_${recto}`] = pheno.master(layer).crostab(
          { scope: { x, y }, spec: { x: 'group.v', y: 'group.r', mode: MIN } }
        )
        const [ h, w ] = crostab.size;
        `${h} x ${w}` |> says[FONTLAB].br(CLASS).br('exportPairs').br(decoXY([ verso, recto ]))
        crostab |> decoCrostab |> logger
      }
    }
    const workbook = crostabCollectionToWorkbook(data)
    const destXlsx = dest + '/' + base + '.xlsx'
    xlsx.writeFile(workbook, destXlsx);
    `[dest] (${destXlsx |> decoString})` |> says[FONTLAB].br(CLASS).br('exportPairs')
  }

  static async importPairs(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const crostabCollection = readCrostabCollection(srcXlsx)
    for (let [ key, crostab ] of indexed(crostabCollection)) {
      const layerToCount = pheno.mutatePairs(crostab|> crostabToNested)
      layerToCount |> decoFlat |> says[FONTLAB].br(CLASS).br('importPairs').p(decoXY(key))
    }
    for (let [ key, crostab ] of indexed(crostabCollection)) {
      const [ h, w ] = crostab.size;
      ((h <= 48 && w <= 24) ? (crostab |> decoCrostab) : `${h} x ${w}`) |>  says[FONTLAB].br(CLASS).br('importPairs').p(decoXY(key))
    }
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }
}


