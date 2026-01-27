import { KerningClassesIO }   from '../src/KerningClassesIO.js'
import { VFMIO }              from '../src/VFMIO.js'
import { MetricsIO }          from '../src/MetricsIO.js'
import { KerningPairsIO }     from '../src/KerningPairsIO.js'
import { $ }                  from '@spare/xr'
import { resolve }            from 'path'
import { exists, pathToInfo } from '@iohub/pathinfo'
import { mkdir }              from 'fs/promises'

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
  const SRC_SPEC_JS = resolve(ROOT, CONF, fontName + GROUPING + JS)
  const SRC_RAW_VFM = resolve(ROOT, ORIG, fontName + VFM)
  const DEST_REGROUPED_VFM = resolve(ROOT, PROC, fontName + REGROUPED + VFM)
  const DEST_SIDEBEARINGS_XLSX = resolve(ROOT, PROC, fontName + REGROUPED + SIDEBEARINGS + XLSX)
  const DEST_PAIRS_XLSX = resolve(ROOT, PROC, fontName + REGROUPED + PAIRS + XLSX)

  console.log($.fontlab('vfmToXlsx').font(fontName).layer(layer).from(SRC_RAW_VFM).dest(DEST_REGROUPED_VFM))
  const { GROUPING: spec } = await import(new URL('file://' + SRC_SPEC_JS).href)

  const { dir, base, ext } = pathToInfo(filePath)
  const vfm = await VFMIO.readFile(filePath)
  if (!destDir) destDir = dir + '/' + base
  if (!await exists(destDir)) await mkdir(destDir, { recursive: true })
  await VFMIO.saveFile(vfm, destDir + '/' + base + '-kerningClasses' + ext, { kerningClasses: true })
  await VFMIO.saveFile(vfm, destDir + '/' + base + '-kerningPairs' + ext, { kerningPairs: true })
  await VFMIO.saveFile(vfm, destDir + '/' + base + '-metrics' + ext, { metrics: true })

  await KerningClassesIO.regroup(SRC_RAW_VFM, DEST_REGROUPED_VFM, spec, layer)
  await VFMIO.separate(DEST_REGROUPED_VFM)
  await MetricsIO.vfmToXlsx(DEST_REGROUPED_VFM, DEST_SIDEBEARINGS_XLSX)
  await KerningPairsIO.vfmToXlsx(DEST_REGROUPED_VFM, DEST_PAIRS_XLSX, layer)
}