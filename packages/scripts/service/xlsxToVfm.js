import { MetricsIO }      from '../src/MetricsIO.js'
import { KerningPairsIO } from '../src/KerningPairsIO.js'

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
  const SRC_SIDEBEARINGS_XLSX = DEST + '/' + fontName + REGROUPED + SIDEBEARINGS + XLSX
  const SRC_PAIRS_XLSX = DEST + '/' + fontName + REGROUPED + PAIRS + XLSX
  const DEST_REGROUPED_VFM = DEST + '/' + fontName + REGROUPED + VFM

  await MetricsIO.xlsxToVfm(SRC_SIDEBEARINGS_XLSX, DEST_REGROUPED_VFM)
  await KerningPairsIO.xlsxToVfm(SRC_PAIRS_XLSX, DEST_REGROUPED_VFM)
  // await VFMIO.separate(DEST_VFM)
}