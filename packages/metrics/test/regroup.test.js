import { decoKerningClasses, GROUPS_CHALENE } from '@fontlab/master'
import { deco, ros, says }                    from '@spare/logger'
import { FONTLAB }                            from '../asset'
import { Profile }                            from '../src/Profile'

const SRC = process.cwd() + '/packages/metrics/static/metrics/custom'
const DEST = process.cwd() + '/packages/metrics/static/output/masters'

// const FILE = 'DolceFut.vfm'
// const FILE = 'LoVirgil.vfm'
const FILE = 'Chalene.vfm'

export const test = async () => {
  const profile = await Profile.fromFile(SRC + '/' + FILE)
  const master = profile.master('Regular')
  // GROUPS_CHALENE  |> deco  |> logger
  const master2 = master.regroup2(GROUPS_CHALENE)
  master2.kerningClasses |> decoKerningClasses |> says[FONTLAB].br(ros('groups'))
  // master2.groups  |> decoSamples  |> logger
  master2.pairs  |> deco |> says[FONTLAB].br(ros('pairs'))
  for (let key in profile.layerToMaster) {
    profile.layerToMaster[key] = master2
  }
  await profile.save(DEST + '/' + FILE, { groups: true, pairs: true, metrics: true, suffix: 'Grouped' })
}

test().then()
