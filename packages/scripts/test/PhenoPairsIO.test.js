import { PairsIO } from '../src/PairsIO.js'

const LAYER = 'Regular'
const SRC = './static'
const DEST = './static'

const BASE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + BASE + '.vfm'
const DEST_XLSX = DEST + '/' + BASE + '-pairs.xlsx'

const workflow = async () => {
  // await PairsIO.originToProcess(SRC_VFM, DEST_XLSX)
  await PairsIO.processToTarget(SRC_VFM, DEST_XLSX)
}

workflow().then()
