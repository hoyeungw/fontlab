import { KerningClassesIO } from '../src/KerningClassesIO.js'
import { VFMIO }            from '../src/VFMIO.js'
import { MetricsIO } from '../src/MetricsIO.js'
import { PairsIO }    from '../src/PairsIO.js'
import { $ }          from '@spare/xr'
import { resolve }    from 'path'

const GROUPING = '-grouping'
const REGROUPED = '-regrouped'
const GROUPS = '-kerningClasses'
const METRICS = '-metrics'
const SIDEBEARINGS = '-sidebearings'
const PAIRS = '-kerningPairs'
const JS = '.js'
const VFM = '.vfm'
const XLSX = '.xlsx'
const ROOT = 'C:/Users/leagy/gyrogit/js/fontlab'
const CONF = './playground/config'
const ORIG = './playground/origin'
const PROC = './playground/process'

export async function vfmToXlsx(fontName, layer) {
  const SPEC_JS = resolve(ROOT, CONF, fontName + GROUPING + JS)
  const SRC_VFM = resolve(ROOT, ORIG, fontName + VFM)
  const DEST_VFM = resolve(ROOT, PROC, fontName + REGROUPED + VFM)
  const DEST_SIDEBEARINGS_XLSX = resolve(ROOT, PROC, fontName + REGROUPED + SIDEBEARINGS + XLSX)
  const DEST_PAIRS_XLSX = resolve(ROOT, PROC, fontName + REGROUPED + PAIRS + XLSX)
  console.log($.fontlab('vfmToXlsx').font(fontName).layer(layer).from(SRC_VFM).dest(DEST_VFM))
  const { GROUPING: spec } = await import(new URL('file://' + SPEC_JS).href)
  await KerningClassesIO.regroup(SRC_VFM, DEST_VFM, spec, layer)
  await VFMIO.separateVFM(DEST_VFM)
  await MetricsIO.vfmToXlsx(DEST_VFM, DEST_SIDEBEARINGS_XLSX)
  await PairsIO.vfmToXlsx(DEST_VFM, DEST_PAIRS_XLSX, layer)
}