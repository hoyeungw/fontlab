import { PhenoPairsIO } from '../src/PhenoPairsIO'

const LAYER = 'Regular'
const SRC = './static'
const DEST = './static'

const BASE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + BASE + '.vfm'
const DEST_XLSX = DEST + '/' + BASE + '-pairs.xlsx'

const workflow = async () => {
  // await PhenoPairsIO.exportPairs(SRC_VFM, DEST_XLSX)
  await PhenoPairsIO.importPairs(SRC_VFM, DEST_XLSX)
}

workflow().then()
