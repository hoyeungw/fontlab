import { PhenoMetricsIO } from '../src/PhenoMetricsIO'

const SRC = './resources/custom'
const DEST = './static/custom'
const FILE = 'Chalene.vfm'

PhenoMetricsIO.saveSidebearingTable(SRC + '/' + FILE, DEST).then()

// const throughFolder = async (folder, dest) => {
//   for (let file of await subFiles(folder)) {
//     await PhenoMetricsIO.saveSidebearingTable(folder + '/' + file, dest)
//     console.log()
//   }
// }