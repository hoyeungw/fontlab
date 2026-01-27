import { PairsIO } from '../src/PairsIO.js'

const LAYER = 'Regular'
const SRC = './static'
const DEST = './static'

const BASE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + BASE + '.vfm'
const DEST_XLSX = DEST + '/' + BASE + '-kerningPairs.xlsx'

const workflow = async () => {
  // await KerningPairsIO.vfmToXlsx(SRC_VFM, DEST_XLSX)
  await PairsIO.xlsxToVfm(SRC_VFM, DEST_XLSX)
}

workflow().then()
