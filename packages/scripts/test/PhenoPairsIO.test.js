import { PhenoPairsIO } from '../src/PhenoPairsIO'

const LAYER = 'Regular'
const SRC = './static'
const DEST = './static'

const BASE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + BASE + '.vfm'

const workflow = async () => {
  // await PhenoPairsIO.exportPairs(SRC_VFM, DEST)
  await PhenoPairsIO.importPairs(SRC_VFM, DEST + '/' + BASE + '-pairs.xlsx')
}

workflow().then()
