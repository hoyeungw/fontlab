import { parsePath }              from '@acq/path'
import { readCrostabCollection }  from '@analys/excel'
import { MasterIO }               from '@fontlab/master'
import { decoCrostab, ros, says } from '@spare/logger'
import { camelToSnake }           from '@texting/phrasing'
import { indexed }                from '@vect/object-mapper'
import { Profile }                from '../src/Profile'

const SRC = process.cwd() + '/packages/metrics/static/metrics/custom'
const DEST = process.cwd() + '/packages/metrics/static/output/masters'

const LAYER = 'Regular'

export const regroupMastersAndExportKerningPairs = async (regroups, { file, dest }) => {
  const { base } = parsePath(file)
  const profile = await Profile.fromFile(file)
  profile.regroupMasters(regroups)
  MasterIO.savePairsToExcel(profile.master(LAYER), dest + '/' + base + '.xlsx')

  const TARGET = dest + '/' + base + '.vfm'
  // await profile.save(TARGET, { groups: true, pairs: true, suffix: 'Masters.' + version })
  await profile.save(TARGET, { groups: true, pairs: true, metrics: true })
}

export const updatePairsByCrostab = async ({ file, dest, version }) => {
  const { dir, base } = parsePath(file)
  const profile = await Profile.fromFile(file)
  const crostabs = readCrostabCollection(dir + '/' + base + '.xlsx')
  for (let [ key, crostab ] of indexed(crostabs)) {
    const [ scopeX, scopeY ] = key.split('_')
    if (crostab.height <= 48 && crostab.width <= 26) {
      crostab |> decoCrostab |> says[camelToSnake('excelToMasterPairs')].br(ros(scopeX) + '_' + ros(scopeY))
    }
    profile.updatePairsByCrostab(crostab)
  }

  for (let [ key, crostab ] of indexed(crostabs)) {
    const [ scopeX, scopeY ] = key.split('_')
    if (crostab.height <= 48 && crostab.width <= 24) {
      crostab |> decoCrostab |> says[camelToSnake('excelToMasterPairs')].br(ros(scopeX) + '_' + ros(scopeY))
    }
  }

  const TARGET = dest + '/' + base + '.vfm'
  // await profile.save(TARGET, { groups: true, pairs: true, suffix: 'Masters.' + version })
  await profile.save(TARGET, { groups: true, pairs: true, metrics: true, suffix: '.' + version })
}

// const FILENAME = 'DolceFut.vfm'
// const FILENAME = 'LoVirgil.vfm'
const FILENAME = 'Chalene.vfm'
const SRC_FILE = SRC + '/' + FILENAME
const DEST_FILE = DEST + '/' + FILENAME

// regroupMastersAndExportKerningPairs(GROUPS_CHALENE, { file: SRC_FILE, dest: DEST }).then()
updatePairsByCrostab({ file: DEST_FILE, dest: DEST, version: 'v2.0.0' }).then()
