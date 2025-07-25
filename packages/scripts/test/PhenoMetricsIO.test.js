import { MetricsIO } from '../src/MetricsIO.js'

const SRC = './static'
const DEST = './static'
const FILE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + FILE + '.vfm'
const DEST_XLSX = DEST + '/' + FILE + '-sidebearings.xlsx'

MetricsIO.sourceToProcess(SRC_VFM, DEST_XLSX).then()
// MetricsIO.processToTarget(SRC_VFM, DEST_XLSX).then()
// MetricsIO.readAlphabetGroups(SRC_VFM).then()

// const throughFolder = async (folder, dest) => {
//   for (let file of await subFiles(folder)) {
//     await MetricsIO.originToProcess(folder + '/' + file, dest)
//     console.log()
//   }
// }