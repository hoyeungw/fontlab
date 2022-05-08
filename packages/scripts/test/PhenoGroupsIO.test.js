import { PhenoGroupsIO }  from '../src/PhenoGroupsIO'

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