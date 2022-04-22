import { VFM }                                  from '../src/VFM'
import { deco, decoCrostab, decoSamples, says } from '@spare/logger'
import { FONTLAB }                              from '../asset'

const SRC = process.cwd() + '/packages/metrics/static/metrics'
const DEST = process.cwd() + '/packages/metrics/static/output'

// const FILE = 'HelveticaNeueLTPro.vfm'
// const FILE = 'SansDolceFut.vfm'
const FILE = 'Chalene.vfm'

export const test = async () => {
  const vfm = await VFM.fromFile(SRC + '/' + FILE)

  vfm.kerningClasses().map(o => o.toObject()) |> decoSamples  |> says[FONTLAB]

  vfm.alphabetsByLayers() |> decoCrostab  |> says[FONTLAB]

  vfm.alphabetGroups() |> deco |> says[FONTLAB]

  await vfm.save(DEST + '/' + FILE, { kerningClasses: true })
}

test().then()
