import { subFileInfos }   from '@acq/path'
import { FONTLAB, LAYER } from '@fontlab/constants'
import { says }           from '@spare/xr'
import { REGROUPS }       from '../../resources/schemes/GROUPS_CHALENE'
import { PhenoGroupsIO }  from './src/PhenoGroupsIO'
import { PhenoIO }        from './src/PhenoIO'
import { PhenoMetricsIO } from './src/PhenoMetricsIO'
import { PhenoPairsIO }   from './src/PhenoPairsIO'

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
      await Workflow.export(base, layer)
    }
  }
  static async export(font, layer) {
    const SRC_VFM = Workflow.SRC + '/' + font + VFM
    const DEST_VFM = Workflow.DEST + '/' + font + REGROUPED + VFM
    const DEST_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + font + REGROUPED + SIDEBEARINGS + XLSX
    const DEST_PAIRS_XLSX = Workflow.DEST + '/' + font + REGROUPED + PAIRS + XLSX

    SRC_VFM |> says[FONTLAB].export(font)[LAYER](layer)
    await PhenoGroupsIO.exportRegrouped(SRC_VFM, DEST_VFM, REGROUPS, layer)
    await PhenoIO.separateVfm(DEST_VFM)
    await PhenoMetricsIO.exportSidebearings(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
    await PhenoPairsIO.exportPairs(DEST_VFM, DEST_PAIRS_XLSX, layer)
  }
  static async import(font) {
    const DEST_VFM = Workflow.DEST + '/' + font + REGROUPED + VFM
    const DEST_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + font + REGROUPED + SIDEBEARINGS + XLSX
    const DEST_PAIRS_XLSX = Workflow.DEST + '/' + font + REGROUPED + PAIRS + XLSX

    // await PhenoMetricsIO.importSidebearings(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
    await PhenoPairsIO.importPairs(DEST_VFM, DEST_PAIRS_XLSX)
    // await PhenoIO.separateVfm(DEST_VFM)
  }
}

// Workflow.groupExport('SemiBold').then()
// Workflow.export('DolceFut', 'Regular').then()
Workflow.import('Chalene').then()
