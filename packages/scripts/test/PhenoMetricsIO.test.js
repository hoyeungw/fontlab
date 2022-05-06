import { PhenoMetricsIO } from '../src/PhenoMetricsIO'

const SRC = './static'
const DEST = './static'
const FILE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + FILE + '.vfm'
const DEST_XLSX = DEST + '/' + FILE + '-sidebearings.xlsx'

PhenoMetricsIO.exportSidebearings(SRC_VFM, DEST_XLSX).then()
// PhenoMetricsIO.importSidebearings(SRC_VFM, DEST_XLSX).then()
// PhenoMetricsIO.readAlphabetGroups(SRC_VFM).then()

// const throughFolder = async (folder, dest) => {
//   for (let file of await subFiles(folder)) {
//     await PhenoMetricsIO.exportSidebearings(folder + '/' + file, dest)
//     console.log()
//   }
// }