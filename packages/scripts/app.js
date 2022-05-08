import { GROUPS_CHALENE } from '../../resources/schemes/GROUPS_CHALENE'
import { PhenoGroupsIO }  from './src/PhenoGroupsIO'
import { PhenoIO }        from './src/PhenoIO'
import { PhenoMetricsIO } from './src/PhenoMetricsIO'
import { PhenoPairsIO }   from './src/PhenoPairsIO'

const SRC = './resources/metrics'
const DEST = './static'
const FILE = 'DolceFut'
const VFM = '.vfm'
const XLSX = '.xlsx'
const LAYER = 'Regular'

const SRC_VFM = SRC + '/' + FILE + VFM
const DEST_VFM = DEST + '/' + FILE + '-regrouped' + VFM
const DEST_SIDEBEARING_XLSX = DEST + '/' + FILE + '-regrouped' + '-sidebearings' + XLSX
const DEST_PAIRS_XLSX = DEST + '/' + FILE + '-regrouped' + '-pairs' + XLSX

export class Workflow {
  static async export() {
    await PhenoGroupsIO.exportRegrouped(SRC_VFM, DEST_VFM, GROUPS_CHALENE, LAYER)
    await PhenoIO.separateVfm(DEST_VFM)
    await PhenoMetricsIO.exportSidebearings(DEST_VFM, DEST_SIDEBEARING_XLSX)
    await PhenoPairsIO.exportPairs(DEST_VFM, DEST_PAIRS_XLSX, LAYER)
  }
  static async import() {
    await PhenoMetricsIO.importSidebearings(DEST_VFM, DEST_SIDEBEARING_XLSX)
    await PhenoPairsIO.importPairs(DEST_VFM, DEST_PAIRS_XLSX, LAYER)
    await PhenoIO.separateVfm(DEST_VFM)
  }
}

Workflow.export().then()
// Workflow.import().then()