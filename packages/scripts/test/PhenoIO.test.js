import { TypefaceIO } from '../src/TypefaceIO'

const SRC = './static'

const BASE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + BASE + '.vfm'

TypefaceIO.separateTypeface(SRC_VFM).then()