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
import { TypefaceIO }                                         from './TypefaceIO.js'

const REGULAR = 'Regular'
const CLASS = 'PairsIO'

// noinspection CommaExpressionJS
export class PairsIO {
  static async exportPairs(srcVFM, destXlsx, layer = REGULAR) {
    const typeface = await TypefaceIO.readTypeface(srcVFM)

    function po(x) {
      return isNaN(x) ? '' : round(x)
    }

    layer = layer in typeface.layerToMaster ? layer : typeface.face
    const crostabCollection = {}
    for (let x of SCOPES) {
      for (let y of SCOPES) {
        const xn = scopeName(x), yn = scopeName(y)
        const crostab = crostabCollection[`${xn}_${yn}`] = typeface.master(layer).groupCrostab(MIN, x, y, po).mutateKeys(glyphToLabel)
        crostab.sideward.sortKeys(labelAsc), crostab.headward.sortKeys(labelAsc)
        console.log($.fontlab(CLASS).export('pairs')[LAYER](layer).br(decoXY(xn, yn))(`${crostab.height} x ${crostab.width}`))
        logger(decoPairsCrostab(crostab))
      }
    }
    const workbook = crostabCollectionToWorkbook(crostabCollection)
    xlsx.writeFile(workbook, destXlsx)
    console.log($.fontlab(CLASS).export('pairs')(`[dest] (${(decoString(destXlsx))})`))
  }

  static async importPairs(destVFM, srcXlsx) {
    const typeface = await TypefaceIO.readTypeface(destVFM)
    const crostabCollection = mutate(readCrostabCollection(srcXlsx), Crostab.from)
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
    await TypefaceIO.saveTypeface(typeface, destVFM, { groups: true, pairs: true, metrics: true })
  }
}


