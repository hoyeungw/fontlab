import { PhenoPairsIO } from '../src/PhenoPairsIO'

const LAYER = 'Regular'
const SRC = './resources/custom'
const DEST = './static/custom'

const BASE = 'Chalene'
const SRC_VFM = SRC + '/' + BASE + '.vfm'

const workflow = async () => {

  await PhenoPairsIO.exportPairs(SRC_VFM, DEST)
  await PhenoPairsIO.importPairs(SRC_VFM, DEST + '/' + BASE + '.xlsx')
}

workflow().then()
