import { MetricsIO } from '../src/MetricsIO.js'

const SRC = './static'
const DEST = './static'
const FILE = 'Chalene-regrouped'
const SRC_VFM = SRC + '/' + FILE + '.vfm'
const DEST_XLSX = DEST + '/' + FILE + '-sidebearings.xlsx'

MetricsIO.vfmToXlsx(SRC_VFM, DEST_XLSX).then()
// MetricsIO.xlsxToVfm(SRC_VFM, DEST_XLSX).then()
// MetricsIO.readAlphabetGroups(SRC_VFM).then()

// const throughFolder = async (folder, dest) => {
//   for (let file of await subFiles(folder)) {
//     await MetricsIO.vfmToXlsx(folder + '/' + file, dest)
//     console.log()
//   }
// }