import { parsePath, subFiles } from '@acq/path'
import { ALPHABET_UPPER }      from '@fontlab/latin'
import { Csv }                 from '@spare/csv'
import { decoCrostab }         from '@spare/logger'
import { says }                from '@spare/xr'
import { promises }            from 'fs'
import { FONTLAB }             from '../asset'
import { Pheno }               from '../src/Pheno'

// ABChanel-PB-Regular-L.json
// ABChanelPB M Capital.json
const SRC = './packages/metric/static/metrics/custom'
const DEST = './packages/metric/static/output/metrics'

const test = async (folder, dest) => {
  async function saveSidebearingTables(src, dest) {
    const base = parsePath(src).base
    const pheno = await Pheno.fromFile(src)
    const sidebearingTable = pheno.sidebearingTable(ALPHABET_UPPER)
    sidebearingTable |> decoCrostab |> says[FONTLAB].br('sidebearingTable')
    const csv = Csv.table(sidebearingTable.toTable(base))
    await promises.writeFile(`${dest}/${base}.csv`, csv)
  }
  for (let file of await subFiles(folder)) {
    await saveSidebearingTables(folder + '/' + file, dest)
    console.log()
  }
}

test(SRC, DEST).then()