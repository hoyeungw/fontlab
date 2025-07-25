import { MetricsIO }  from '../src/MetricsIO.js'
import { PairsIO }    from '../src/PairsIO.js'
import { TypefaceIO } from '../src/TypefaceIO.js'

const REGROUPED = '-regrouped'
const GROUPS = '-groups'
const METRICS = '-metrics'
const SIDEBEARINGS = '-sidebearings'
const PAIRS = '-pairs'
const VFM = '.vfm'
const XLSX = '.xlsx'
const SRC = './playground/origin'
const PROC = './playground/process'
const DEST = './playground/target'

export async function processToTarget(fontName) {
  const PROC_SIDEBEARINGS_XLSX = DEST + '/' + fontName + REGROUPED + SIDEBEARINGS + XLSX
  const PROC_PAIRS_XLSX = DEST + '/' + fontName + REGROUPED + PAIRS + XLSX
  const DEST_VFM = DEST + '/' + fontName + REGROUPED + VFM

  await MetricsIO.processToTarget(PROC_SIDEBEARINGS_XLSX, DEST_VFM)
  await PairsIO.processToTarget(PROC_PAIRS_XLSX, DEST_VFM)
  // await TypefaceIO.sourceToProcessIntoPartition(DEST_VFM)
}