import { PhenoGroupsIO }              from '../src/PhenoGroupsIO.js'
import { REGROUPS as GROUPS_CHALENE } from '../../../resources/schemes/GROUPS_CHALENE.js'

const SRC = './resources/metrics'
const DEST = './static'
const FILE = 'Chalene'
const VFM = '.vfm'
const XLSX = '.xlsx'

// PhenoGroupsIO
//   .exportRegrouped(SRC + '/' + FILE + VFM, DEST + '/' + FILE + '-regrouped' + VFM, GROUPS_CHALENE)
//   .then()

PhenoGroupsIO
  .exportRegroupsScheme(GROUPS_CHALENE, DEST + '/' + FILE + '-regroups-scheme' + XLSX)
  .then()