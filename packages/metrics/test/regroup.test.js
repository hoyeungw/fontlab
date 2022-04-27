import { deco, decoSamples, logger } from '@spare/logger'
import { GROUPS_CHALENE }            from '../asset/GROUPS_CHALENE'
import { Profile }                   from '../src/Profile'

const SRC = process.cwd() + '/packages/metrics/static/metrics'
const DEST = process.cwd() + '/packages/metrics/static/output'

// const FILE = 'DolceFut.vfm'
// const FILE = 'LoVirgil.vfm'
const FILE = 'Chalene.vfm'

export const test = async () => {
  const profile = await Profile.fromFile(SRC + '/' + FILE)
  const master = profile.master('Regular')
  const master2 = master.regroup(GROUPS_CHALENE)
  master2.groups  |> decoSamples  |> logger
  master2.pairs  |> deco  |> logger
  for (let key in profile.layerToMaster) {
    profile.layerToMaster[key] = master2
  }
  await profile.save(DEST + '/' + FILE, { groups: true, pairs: true, metrics: true, suffix: 'Grouped' })
}

test().then()