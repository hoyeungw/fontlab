import { GroupsIO }   from '../src/GroupsIO.js'
import { TypefaceIO } from '../src/TypefaceIO.js'
import { MetricsIO }  from '../src/MetricsIO.js'
import { PairsIO }    from '../src/PairsIO.js'
import { $ }          from '@spare/xr'
import { resolve }    from 'path'

const GROUPING = '-grouping'
const REGROUPED = '-regrouped'
const GROUPS = '-groups'
const METRICS = '-metrics'
const SIDEBEARINGS = '-sidebearings'
const PAIRS = '-pairs'
const JS = '.js'
const VFM = '.vfm'
const XLSX = '.xlsx'
const ROOT = 'C:/Users/leagy/gyrogit/js/fontlab'
const CONF = './playground/config'
const ORIG = './playground/origin'
const PROC = './playground/process'

export async function originToProcess(fontName, layer) {
  const SPEC_JS = resolve(ROOT, CONF, fontName + GROUPING + JS)
  const SRC_VFM = resolve(ROOT, ORIG, fontName + VFM)
  const PROC_VFM = resolve(ROOT, PROC, fontName + REGROUPED + VFM)
  const PROC_SIDEBEARINGS_XLSX = resolve(ROOT, PROC, fontName + REGROUPED + SIDEBEARINGS + XLSX)
  const PROC_PAIRS_XLSX = resolve(ROOT, PROC, fontName + REGROUPED + PAIRS + XLSX)
  console.log($.fontlab('originToProcess').font(fontName).layer(layer).from(SRC_VFM).dest(PROC_VFM))
  const { GROUPING: spec } = await import(new URL('file://' + SPEC_JS).href)
  await GroupsIO.regroup(SRC_VFM, PROC_VFM, spec, layer)
  await TypefaceIO.sourceToProcessIntoPartition(PROC_VFM)
  await MetricsIO.sourceToProcess(PROC_VFM, PROC_SIDEBEARINGS_XLSX)
  await PairsIO.sourceToProcess(PROC_VFM, PROC_PAIRS_XLSX, layer)
}