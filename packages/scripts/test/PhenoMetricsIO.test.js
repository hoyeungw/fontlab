import { PhenoMetricsIO } from '../src/PhenoMetricsIO'

const SRC = './resources/custom'
const DEST = './static/custom'
const FILE = 'DolceFut'

PhenoMetricsIO.exportSidebearings(SRC + '/' + FILE + '.vfm', DEST).then()
// PhenoMetricsIO.importSidebearings(SRC + '/' + FILE + '.vfm', DEST + '/' + FILE + '-sidebearings.xlsx').then()
// PhenoMetricsIO.readAlphabetGroups(SRC + '/' + FILE + '.vfm').then()

// const throughFolder = async (folder, dest) => {
//   for (let file of await subFiles(folder)) {
//     await PhenoMetricsIO.exportSidebearings(folder + '/' + file, dest)
//     console.log()
//   }
// }