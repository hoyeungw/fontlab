import { MIN }              from '@analys/enum-pivot-mode'
import {
  crostabCollectionToWorkbook,
  readCrostabCollection,
}                           from '@analys/excel'
import { crostabToSparse }  from '@analyz/convert'
import { Crostab }          from '@analyz/crostab'
import { round }            from '@aryth/math'
import {
  FONTLAB,
  LAYER,
}                           from '@fontlab/constants'
import {
  scopeName,
  SCOPES,
}                           from '@fontlab/enum-scope'
import {
  glyphToLabel,
  labelToGlyph,
}                           from '@fontlab/latin'
import {
  decoFlat,
  decoString,
  logger,
}                           from '@spare/logger'
import { says }             from '@spare/xr'
import { gather }           from '@vect/object-init'
import {
  indexed,
  mutate,
}                           from '@vect/object-mapper'
import xlsx                 from 'xlsx'
import { decoPairsCrostab } from '../utils/decoPairsCrostab.js'
import { decoXY }           from '../utils/decoXY.js'
import { labelAsc }         from '../utils/labelAsc.js'
import { PhenoIO }          from './PhenoIO.js'

const REGULAR = 'Regular'
const CLASS = 'PhenoPairsIO'

// noinspection CommaExpressionJS
export class PhenoPairsIO {
  static async exportPairs(srcVfm, destXlsx, layer = REGULAR) {
    const pheno = await PhenoIO.readPheno(srcVfm)

    function po(x) {
      return isNaN(x) ? '' : round(x)
    }

    layer = layer in pheno.layerToMaster ? layer : pheno.face
    const crostabCollection = {}
    for (let x of SCOPES) {
      for (let y of SCOPES) {
        const xn = scopeName(x), yn = scopeName(y)
        const crostab = crostabCollection[`${xn}_${yn}`] = pheno.master(layer).groupCrostab(MIN, x, y, po).mutateKeys(glyphToLabel)
        crostab.sideward.sortKeys(labelAsc), crostab.headward.sortKeys(labelAsc)
        says[FONTLAB].br(CLASS).br('exportPairs')[LAYER](layer).br(decoXY(xn, yn))(`${crostab.height} x ${crostab.width}`)
        logger(decoPairsCrostab(crostab))
      }
    }
    const workbook = crostabCollectionToWorkbook(crostabCollection)
    xlsx.writeFile(workbook, destXlsx)
    says[FONTLAB].br(CLASS).br('exportPairs')(`[dest] (${(decoString(destXlsx))})`)
  }

  static async importPairs(destVfm, srcXlsx) {
    const pheno = await PhenoIO.readPheno(destVfm)
    const crostabCollection = mutate(readCrostabCollection(srcXlsx), Crostab.from)
    const statCollection = gather(indexed(crostabCollection,
      (side_head, crostab) => /^\w+$/.test(side_head) && crostab,
      (side_head, crostab) => {
        says[FONTLAB].br(CLASS).br('importPairs').p(decoXY(side_head))(decoPairsCrostab(crostab))
        const sparse = crostabToSparse(crostab.mutateKeys(labelToGlyph), (x, y, v) => v?.trim()?.length)
        const updated = pheno.updatePairs(sparse)
        return [side_head, updated]
      }))
    for (let [side_head, stat] of indexed(statCollection)) {
      says[FONTLAB].br(CLASS).br('importPairs').p(decoXY(side_head))(decoFlat(stat))
    }
    await PhenoIO.savePheno(pheno, destVfm, { groups: true, pairs: true, metrics: true })
  }
}


