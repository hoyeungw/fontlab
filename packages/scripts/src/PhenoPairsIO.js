import { crostabToNested }                                    from '@analys/convert'
import { MIN }                                                from '@analys/enum-pivot-mode'
import { crostabCollectionToWorkbook, readCrostabCollection } from '@analys/excel'
import { round }                                              from '@aryth/math'
import { FONTLAB }                                            from '@fontlab/constants'
import { scopeName, SCOPES }                                  from '@fontlab/enum-scope'
import { glyphToLabel, labelToGlyph }                         from '@fontlab/latin'
import { decoFlat, decoString, logger }                       from '@spare/logger'
import { says }                                               from '@spare/xr'
import { indexed }                                            from '@vect/object-mapper'
import xlsx                                                   from 'xlsx'
import { decoPairsCrostab }                                   from '../utils/decoPairsCrostab'
import { decoXY }                                             from '../utils/decoXY'
import { labelAsc }                                           from '../utils/labelAsc'
import { PhenoIO }                                            from './PhenoIO'

const REGULAR = 'Regular'
const CLASS = 'PhenoPairsIO'

// noinspection CommaExpressionJS
export class PhenoPairsIO {
  static async exportPairs(srcVfm, destXlsx, layer = REGULAR) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    function po(x) { return isNaN(x) ? '' : round(x) }
    layer = layer in pheno.layerToMaster ? layer : pheno.face
    const crostabCollection = {}
    for (let x of SCOPES) {
      for (let y of SCOPES) {
        const xn = scopeName(x), yn = scopeName(y)
        const crostab = pheno.master(layer).groupCrostab(MIN, x, y, po)
        crostabCollection[`${xn}_${yn}`] = crostab
          .mutateSide(glyphToLabel)
          .mutateBanner(glyphToLabel)
          .sortByLabels({ direct: 1, comparer: labelAsc, mutate: true })
          .sortByLabels({ direct: 2, comparer: labelAsc, mutate: true })
        const [ h, w ] = crostab.size;
        `${h} x ${w}` |> says[FONTLAB].br(CLASS).br('exportPairs').br(decoXY(xn, yn))
        crostab |> decoPairsCrostab |> logger
      }
    }
    const workbook = crostabCollectionToWorkbook(crostabCollection)
    xlsx.writeFile(workbook, destXlsx);
    `[dest] (${destXlsx |> decoString})` |> says[FONTLAB].br(CLASS).br('exportPairs')
  }

  static async importPairs(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const crostabCollection = readCrostabCollection(srcXlsx)
    for (let [ s_h, crostab ] of indexed(crostabCollection)) {
      if (!crostab) continue
      crostab |> decoPairsCrostab |>  says[FONTLAB].br(CLASS).br('importPairs').p(decoXY(s_h))
      crostab.mutateSide(labelToGlyph).mutateBanner(labelToGlyph)
      const layerToCount = pheno.updatePairs(crostab|> crostabToNested)
      layerToCount |> decoFlat |> says[FONTLAB].br(CLASS).br('importPairs').p(decoXY(s_h))
    }
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }
}


