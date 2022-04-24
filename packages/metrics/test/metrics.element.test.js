import { parsePath, subFiles }      from '@acq/path'
import { Csv }                      from '@spare/csv'
import { decoCrostab, says }        from '@spare/logger'
import { promises }                 from 'fs'
import { ALPHABETS_UPPER, FONTLAB } from '../asset'
import { VFM }                      from '../src/VFM'

// ABChanel-PB-Regular-L.json
// ABChanelPB M Capital.json
const SRC = process.cwd() + '/packages/metrics/static/metrics'
const DEST = process.cwd() + '/packages/metrics/static/output'

const test = async (folder, dest) => {
  async function getAlphabetsByLayers(src, dest) {
    const { dir, base, ext } = parsePath(src)
    const vfm = await VFM.fromFile(src)
    const alphabetsByLayers = vfm.alphabetsByLayers(ALPHABETS_UPPER)
    alphabetsByLayers |> decoCrostab  |> says[FONTLAB]
    await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetsByLayers.toTable(base)))
  }
  for (let file of await subFiles(folder)) {
    await getAlphabetsByLayers(folder + '/' + file, dest)
    console.log()
  }
}

test(SRC, DEST).then()