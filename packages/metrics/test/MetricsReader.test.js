import { decoCrostab, ros, says } from '@spare/logger'
import { Csv }                    from '@spare/csv'
import { promises }               from 'fs'
import { ALPHABETS_UPPER }        from '../asset/ALPHABETS.js'
import { DIACRITICS }             from '../asset/DIACRITICS.js'
import { MetricsReader }          from '../src/MetricsReader.js'
import { time }                   from '@valjoux/timestamp-pretty'
import { parsePath, subFiles }    from '@acq/path'
// ABChanel-PB-Regular-L.json
// ABChanelPB M Capital.json
const SRC = process.cwd() + '/../static/metrics'
const DEST = process.cwd() + '/../static/output'
const FONTLAB = '>> fontlab'
says[FONTLAB].attach(time)

const extractSimplyAlphabetsByLayers = async (src, dest) => {
  const { dir, base, ext } = parsePath(src)
  const metricsReader = new MetricsReader(ALPHABETS_UPPER, DIACRITICS)

  says[FONTLAB](`loading ${ros(base + ext)}`)
  const text = await promises.readFile(src)
  says[FONTLAB](`loaded ${ros(base + ext)}`)

  const json = JSON.parse(text)

  // const crostabCollection = metricsReader.byLayersAlphabetsByDiacritics(json)
  // for (const [layer, crostab] of Object.entries(crostabCollection)) {
  //   says[layer](decoCrostab(crostab))
  // }

  const crostab = metricsReader.simplyAlphabetsByLayers(json)
  says[FONTLAB](decoCrostab(crostab))
  await promises.writeFile(`${dest}/${base}.csv`, Csv.table(crostab.toTable(base)))
}

const extractSimplyAlphabetsByLayersUnderFolder = async (folder, dest) => {
  for (let file of await subFiles(folder)) {
    await extractSimplyAlphabetsByLayers(folder + '/' + file, dest)
    console.log()
  }
}

extractSimplyAlphabetsByLayersUnderFolder(SRC, DEST).then()