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

const extractSimplyAlphabetsByLayers = async (src, dest) => {
  const { dir, base, ext } = parsePath(src)
  const vfm = await VFM.fromFile(src)
  const alphabetsByLayers = vfm.alphabetsByLayers(ALPHABETS_UPPER)
  alphabetsByLayers |> decoCrostab  |> says[FONTLAB]
  await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetsByLayers.toTable(base)))
}

const extractSimplyAlphabetsByLayersUnderFolder = async (folder, dest) => {
  for (let file of await subFiles(folder)) {
    await extractSimplyAlphabetsByLayers(folder + '/' + file, dest)
    console.log()
  }
}


extractSimplyAlphabetsByLayersUnderFolder(SRC, DEST).then()