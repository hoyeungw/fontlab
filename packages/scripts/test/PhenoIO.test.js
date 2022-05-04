import { PhenoIO } from '../src/PhenoIO'

const LAYER = 'Regular'
const SRC = './resources/custom'
const DEST = './static/custom'

const BASE = 'Chalene'
const SRC_VFM = SRC + '/' + BASE + '.vfm'

await PhenoIO.separateVfm(SRC_VFM)