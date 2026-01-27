import { MetricsIO }  from '../src/MetricsIO.js'
import { PairsIO } from '../src/PairsIO.js'
import { VFMIO }   from '../src/VFMIO.js'

const REGROUPED = '-regrouped'
const GROUPS = '-kerningClasses'
const METRICS = '-metrics'
const SIDEBEARINGS = '-sidebearings'
const PAIRS = '-kerningPairs'
const VFM = '.vfm'
const XLSX = '.xlsx'
const SRC = './playground/origin'
const PROC = './playground/process'
const DEST = './playground/target'

export async function xlsxToVfm(fontName) {
  const PROC_SIDEBEARINGS_XLSX = DEST + '/' + fontName + REGROUPED + SIDEBEARINGS + XLSX
  const PROC_PAIRS_XLSX = DEST + '/' + fontName + REGROUPED + PAIRS + XLSX
  const DEST_VFM = DEST + '/' + fontName + REGROUPED + VFM

  await MetricsIO.xlsxToVfm(PROC_SIDEBEARINGS_XLSX, DEST_VFM)
  await PairsIO.xlsxToVfm(PROC_PAIRS_XLSX, DEST_VFM)
  // await VFMIO.separate(DEST_VFM)
}