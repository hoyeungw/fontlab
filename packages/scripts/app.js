import { subFileInfos }   from '@acq/path'
import { Verse }          from '@spare/verse'
import { promises }       from 'fs'
import { REGROUPS }       from '../../resources/schemes/GROUPS_CHALENE'
import { PhenoGroupsIO }  from './src/PhenoGroupsIO'
import { PhenoIO }        from './src/PhenoIO'
import { PhenoMetricsIO } from './src/PhenoMetricsIO'
import { PhenoPairsIO }   from './src/PhenoPairsIO'
import { GLYPH_DICT }     from './utils/desToReal'

const REGROUPED = '-regrouped'
const GROUPS = '-groups'
const METRICS = '-metrics'
const SIDEBEARINGS = '-sidebearings'
const PAIRS = '-pairs'
const VFM = '.vfm'
const XLSX = '.xlsx'

export class Workflow {
  static SRC = './resources/metrics'
  static DEST = './static'
  static async groupExport(layer) {
    for (let { id, dir, base, ext } of await subFileInfos(Workflow.SRC)) {
      base |> console.log
      await Workflow.export(base, layer)
      const tx = Verse.object(GLYPH_DICT)
      await promises.writeFile(Workflow.DEST + '/' + 'glyphDict.js', 'export const GLYPH_DICT = ' + tx)
    }
  }
  static async export(font, layer) {
    const SRC_VFM = Workflow.SRC + '/' + font + VFM
    const DEST_VFM = Workflow.DEST + '/' + font + REGROUPED + VFM
    const DEST_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + font + REGROUPED + SIDEBEARINGS + XLSX
    const DEST_PAIRS_XLSX = Workflow.DEST + '/' + font + REGROUPED + PAIRS + XLSX

    await PhenoGroupsIO.exportRegrouped(SRC_VFM, DEST_VFM, REGROUPS, layer)
    await PhenoIO.separateVfm(DEST_VFM)
    await PhenoMetricsIO.exportSidebearings(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
    await PhenoPairsIO.exportPairs(DEST_VFM, DEST_PAIRS_XLSX)
  }
  static async import(font) {
    const DEST_VFM = Workflow.DEST + '/' + font + REGROUPED + VFM
    const DEST_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + font + REGROUPED + SIDEBEARINGS + XLSX
    const DEST_PAIRS_XLSX = Workflow.DEST + '/' + font + REGROUPED + PAIRS + XLSX

    await PhenoMetricsIO.importSidebearings(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
    await PhenoPairsIO.importPairs(DEST_VFM, DEST_PAIRS_XLSX)
    await PhenoIO.separateVfm(DEST_VFM)
  }
}

// Workflow.groupExport('Regular').then()
// Workflow.export('LoVirgil', 'Regular').then()
Workflow.import('LoVirgil').then()
