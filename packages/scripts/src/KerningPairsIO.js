import { MIN }                                                from '@analys/enum-pivot-mode'
import { crostabCollectionToWorkbook, readCrostabCollection } from '@analys/excel'
import { crostabToSparse }                                    from '@analyz/convert'
import { Crostab }                                            from '@analyz/crostab'
import { round }                                              from '@aryth/math'
import { LAYER }                                              from '@fontlab/constants'
import { scopeName, SCOPES }                                  from '@fontlab/enum-scope'
import { glyphToLabel, labelToGlyph }                         from '@fontlab/latin'
import { decoFlat, decoString, logger }                       from '@spare/logger'
import { $ }                                                  from '@spare/xr'
import { gather }                                             from '@vect/object-init'
import { indexed, mutate }                                    from '@vect/object-mapper'
import xlsx                                                   from 'xlsx'
import { decoPairsCrostab }                                   from '../utils/decoPairsCrostab.js'
import { decoXY }                                             from '../utils/decoXY.js'
import { labelAsc }                                           from '../utils/labelAsc.js'
import { VFMIO }                                              from './VFMIO.js'

const REGULAR = 'Regular'
const CLASS = 'KerningPairsIO'

// noinspection CommaExpressionJS
export class KerningPairsIO {
  static async vfmToXlsx(srcVFM, destXLSX, layer = REGULAR) {
    const typeface = await VFMIO.readFile(srcVFM)
    function ro(x) { return isNaN(x) ? '' : round(x) }
    layer = layer in typeface.layerToMaster ? layer : typeface.face
    const crostabCollection = {}
    for (let x of SCOPES) {
      for (let y of SCOPES) {
        const xn = scopeName(x), yn = scopeName(y)
        const crostab = crostabCollection[`${xn}_${yn}`] = typeface.master(layer).groupCrostab(MIN, x, y, ro).mutateKeys(glyphToLabel)
        crostab.sideward.sortKeys(labelAsc), crostab.headward.sortKeys(labelAsc)
        console.log($.fontlab(CLASS).export('pairs')[LAYER](layer).br(decoXY(xn, yn))(`${crostab.height} x ${crostab.width}`))
        logger(decoPairsCrostab(crostab))
      }
    }
    const workbook = crostabCollectionToWorkbook(crostabCollection)
    xlsx.writeFile(workbook, destXLSX)
    console.log($.fontlab(CLASS).export('pairs').dest(decoString(destXLSX)))
  }

  static async xlsxToVfm(srcXLSX, destVFM) {
    const typeface = await VFMIO.readFile(destVFM)
    const crostabCollection = mutate(readCrostabCollection(srcXLSX), Crostab.from)
    const statCollection = gather(indexed(crostabCollection,
      (side_head, crostab) => /^\w+$/.test(side_head) && crostab,
      (side_head, crostab) => {
        console.log($.fontlab(CLASS).import('pairs')[decoXY(side_head)](decoPairsCrostab(crostab)))
        const sparse = crostabToSparse(crostab.mutateKeys(labelToGlyph), (x, y, v) => v?.trim()?.length)
        const updated = typeface.updatePairs(sparse)
        return [ side_head, updated ]
      }))
    for (let [ side_head, stat ] of indexed(statCollection)) {
      console.log($.fontlab(CLASS).import('pairs')[decoXY(side_head)](decoFlat(stat)))
    }
    await VFMIO.saveFile(typeface, destVFM, { kerningClasses: true, pairs: true, metrics: true })
  }
}


