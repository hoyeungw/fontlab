import { GROUPS_CHALENE } from '../../../resources/schemes/GROUPS_CHALENE'
import { PhenoGroupsIO }  from '../src/PhenoGroupsIO'

const SRC = './resources/metrics'
const DEST = './static'
const FILE = 'Chalene.vfm'

PhenoGroupsIO.exportRegrouped(SRC + '/' + FILE, DEST, GROUPS_CHALENE).then()