import { VFM }               from '../src/VFM'
import { decoSamples, says } from '@spare/logger'
import { FONTLAB }           from '../asset'


const SRC = process.cwd() + '/packages/metrics/static/metrics'
const FILE = 'HelveticaNeueLTPro.vfm'

export const test = async () => {
  const vfm = await VFM.fromFile(SRC + '/' + FILE)
  const kerningClasses = vfm.kerningClasses()
  kerningClasses |> decoSamples  |> says[FONTLAB]
}

test().then()
