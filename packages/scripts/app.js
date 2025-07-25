import { subFileInfos }                             from '@acq/path'
import { $ }                                        from '@spare/xr'
import { GroupsIO, MetricsIO, PairsIO, TypefaceIO } from './index.js'

import { REGROUPS }        from '../../resources/schemes/GROUPS_CHALENE.js'
import { originToProcess } from './service/originToProcess.js'
import { processToTarget } from './service/processToTarget.js'

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
      await Workflow.sourceToProcess(base, layer)
    }
  }
  static async sourceToProcess(fontName, layer) {
    const SRC_VFM = Workflow.SRC + '/' + fontName + VFM
    const DEST_VFM = Workflow.DEST + '/' + fontName + REGROUPED + VFM
    const DEST_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + fontName + REGROUPED + SIDEBEARINGS + XLSX
    const DEST_PAIRS_XLSX = Workflow.DEST + '/' + fontName + REGROUPED + PAIRS + XLSX
    console.log($.fontlab('sourceToProcess').font(fontName).layer(layer).from(SRC_VFM).dest(DEST_VFM))
    // says[FONTLAB].originToProcess(font)[LAYER](layer)(SRC_VFM)
    await GroupsIO.regroup(SRC_VFM, DEST_VFM, REGROUPS, layer)
    await TypefaceIO.sourceToProcessIntoPartition(DEST_VFM)
    await MetricsIO.sourceToProcess(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
    await PairsIO.sourceToProcess(DEST_VFM, DEST_PAIRS_XLSX, layer)
  }
  static async processToTarget(fontName) {
    const DEST_VFM = Workflow.DEST + '/' + fontName + REGROUPED + VFM
    const SRC_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + fontName + REGROUPED + SIDEBEARINGS + XLSX
    const SRC_PAIRS_XLSX = Workflow.DEST + '/' + fontName + REGROUPED + PAIRS + XLSX

    await MetricsIO.processToTarget(SRC_SIDEBEARINGS_XLSX, DEST_VFM)
    await PairsIO.processToTarget(SRC_PAIRS_XLSX, DEST_VFM)
    await TypefaceIO.sourceToProcessIntoPartition(DEST_VFM)
  }
}


// await Workflow.groupExport('SemiBold')
// await Workflow.originToProcess('DolceFut', 'Regular')
// await Workflow.processToTarget('Chalene')
const FONT_NAME = 'DolceFut'
await originToProcess(FONT_NAME)
// await processToTarget(FONT_NAME)