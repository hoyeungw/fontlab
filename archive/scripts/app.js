import { subFileInfos }                             from '@acq/path'
import { $ }                                           from '@spare/xr'
import { KerningClassesIO, MetricsIO, PairsIO, VFMIO } from './index.js'

import { REGROUPS }        from '../../resources/schemes/GROUPS_CHALENE.js'
import { vfmToXlsx } from './service/vfmToXlsx.js'
import { xlsxToVfm } from './service/xlsxToVfm.js'

const REGROUPED = '-regrouped'
const GROUPS = '-kerningClasses'
const METRICS = '-metrics'
const SIDEBEARINGS = '-sidebearings'
const PAIRS = '-kerningPairs'
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
    // says[FONTLAB].vfmToXlsx(font)[LAYER](layer)(SRC_VFM)
    await KerningClassesIO.regroup(SRC_VFM, DEST_VFM, REGROUPS, layer)
    await VFMIO.separateVFM(DEST_VFM)
    await MetricsIO.vfmToXlsx(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
    await PairsIO.vfmToXlsx(DEST_VFM, DEST_PAIRS_XLSX, layer)
  }
  static async processToTarget(fontName) {
    const DEST_VFM = Workflow.DEST + '/' + fontName + REGROUPED + VFM
    const SRC_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + fontName + REGROUPED + SIDEBEARINGS + XLSX
    const SRC_PAIRS_XLSX = Workflow.DEST + '/' + fontName + REGROUPED + PAIRS + XLSX

    await MetricsIO.xlsxToVfm(SRC_SIDEBEARINGS_XLSX, DEST_VFM)
    await PairsIO.xlsxToVfm(SRC_PAIRS_XLSX, DEST_VFM)
    await VFMIO.separateVFM(DEST_VFM)
  }
}


// await Workflow.groupExport('SemiBold')
// await Workflow.vfmToXlsx('DolceFut', 'Regular')
// await Workflow.xlsxToVfm('Chalene')
const FONT_NAME = 'DolceFut'
await vfmToXlsx(FONT_NAME)
// await xlsxToVfm(FONT_NAME)