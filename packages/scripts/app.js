import { subFileInfos }                             from '@acq/path'
import { $ }                                        from '@spare/xr'
import { GroupsIO, MetricsIO, PairsIO, TypefaceIO } from './index.js'

import { REGROUPS } from '../../resources/schemes/GROUPS_CHALENE.js'

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
  static async export(fontName, layer) {
    const SRC_VFM = Workflow.SRC + '/' + fontName + VFM
    const DEST_VFM = Workflow.DEST + '/' + fontName + REGROUPED + VFM
    const DEST_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + fontName + REGROUPED + SIDEBEARINGS + XLSX
    const DEST_PAIRS_XLSX = Workflow.DEST + '/' + fontName + REGROUPED + PAIRS + XLSX
    console.log($.fontlab('export').font(fontName).layer(layer).from(SRC_VFM).dest(DEST_VFM))
    // says[FONTLAB].export(font)[LAYER](layer)(SRC_VFM)
    await GroupsIO.exportRegrouped(SRC_VFM, DEST_VFM, REGROUPS, layer)
    await TypefaceIO.separateTypeface(DEST_VFM)
    await MetricsIO.exportSidebearings(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
    await PairsIO.exportPairs(DEST_VFM, DEST_PAIRS_XLSX, layer)
  }
  static async import(font) {
    const DEST_VFM = Workflow.DEST + '/' + font + REGROUPED + VFM
    const DEST_SIDEBEARINGS_XLSX = Workflow.DEST + '/' + font + REGROUPED + SIDEBEARINGS + XLSX
    const DEST_PAIRS_XLSX = Workflow.DEST + '/' + font + REGROUPED + PAIRS + XLSX

    await MetricsIO.importSidebearings(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
    await PairsIO.importPairs(DEST_VFM, DEST_PAIRS_XLSX)
    await TypefaceIO.separateTypeface(DEST_VFM)
  }
}

// Workflow.groupExport('SemiBold').then()
// Workflow.export('DolceFut', 'Regular').then()
Workflow.import('Chalene').then()
