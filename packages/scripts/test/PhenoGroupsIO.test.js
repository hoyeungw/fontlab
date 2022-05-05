import { PhenoGroupsIO } from '../src/PhenoGroupsIO'

const SRC = './resources/custom'
const DEST = './static/custom'
const FILE = 'Chalene.vfm'

PhenoGroupsIO.exportRegrouped(SRC + '/' + FILE, DEST).then()