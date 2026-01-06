import { VFMIO } from '../src/VFMIO.js'

const SRC = './static'

const BASE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + BASE + '.vfm'

VFMIO.separateVFM(SRC_VFM).then()