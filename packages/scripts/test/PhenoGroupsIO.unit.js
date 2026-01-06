import { KerningClassesIO }           from '../src/KerningClassesIO.js'
import { REGROUPS as GROUPS_CHALENE } from '../../../resources/schemes/GROUPS_CHALENE.js'

const SRC = './resources/metrics'
const DEST = './static'
const FILE = 'Chalene'
const VFM = '.vfm'
const XLSX = '.xlsx'

// KerningClassesIO
//   .regroup(SRC + '/' + FILE + VFM, DEST + '/' + FILE + '-regrouped' + VFM, GROUPS_CHALENE)
//   .then()

KerningClassesIO
  .exportRegroupsScheme(GROUPS_CHALENE, DEST + '/' + FILE + '-regroups-scheme' + XLSX)
  .then()