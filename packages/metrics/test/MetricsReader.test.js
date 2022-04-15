import { decoCrostab, logger, says } from '@spare/logger'
import { Csv }                       from '@spare/csv'
import { promises }                  from 'fs'
import { ALPHABETS_UPPER }           from '../asset/ALPHABETS.js'
import { DIACRITICS }                from '../asset/DIACRITICS.js'
import { MetricsReader }             from '../src/MetricsReader.js'

const DEST = process.cwd() + '/../static/output'

const test = async () => {
  logger(process.cwd())
  // const json = await import(process.cwd() + '/../../../static/metrics/ABChanelPB M Capital.json')
  const text = await promises.readFile(process.cwd() + '/../static/metrics/ABChanelPB M Capital.json')
  const json = JSON.parse(text)
  const metricsReader = new MetricsReader(ALPHABETS_UPPER, DIACRITICS)
  const crostabCollection = metricsReader.byLayersAlphabetsByDiacritics(json)
  for (const [ layer, crostab ] of Object.entries(crostabCollection)) {
    says[layer](decoCrostab(crostab))
  }

  const crostab = metricsReader.simplyAlphabetsByLayers(json)
  says['simply'](decoCrostab(crostab))
  await promises.writeFile(DEST + '/simply.csv', Csv.table(crostab.toTable()))
}

test()