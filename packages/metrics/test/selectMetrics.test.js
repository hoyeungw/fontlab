import { deco, decoCrostab, logger, says } from '@spare/logger'
import { LETTER_VARIATIONS } from '../asset/letterVariation.js'
import { metricsToCrostabs } from '../src/parser.js'
import { promises }          from 'fs'


const test = async () => {
  logger(process.cwd())
  // const json = await import(process.cwd() + '/../../../static/metrics/ABChanelPB M Capital.json')
  const text = await promises.readFile(process.cwd() + '/../static/metrics/ABChanelPB M Capital.json')
  const json = JSON.parse(text)
  const glyphs = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]
  const vars = LETTER_VARIATIONS
  const layers = metricsToCrostabs(json, { glyphs, vars })
  for (let layer in layers) {
    says[layer](decoCrostab(layers[layer]))
  }

}

test()