import { parsePath, subFiles }          from '@acq/path'
import { ALPHABET_UPPER }               from '@fontlab/latin'
import { PhenoIO }                      from '@fontlab/scripts'
import { Csv }                          from '@spare/csv'
import { deco, decoCrostab, ros, says } from '@spare/logger'
import { promises }                     from 'fs'
import { FONTLAB }                      from '../asset'
import { Pheno }                        from '../src/Pheno'

const SRC = process.cwd() + '/packages/metric/static/metrics/custom'
const DEST = process.cwd() + '/packages/metrics/static/output/metrics'

const readAlphabetByLayer = async (file, dest) => {
  const { dir, base, ext } = parsePath(file)
  const pheno = await PhenoIO.readPheno(file)
  const alphabetByLayer = pheno.sidebearingTable(ALPHABET_UPPER)
  pheno.alphabetGroups()  |> deco  |> says[FONTLAB].br(ros('alphabetGroups'))
  alphabetByLayer |> decoCrostab  |> says[FONTLAB].br(ros('alphabetByLayer'))
  await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
}

const batchReadAlphabetByLayer = async (folder, dest) => {
  for (let file of await subFiles(folder)) {
    await readAlphabetByLayer(folder + '/' + file, dest)
    console.log()
  }
}

batchReadAlphabetByLayer(SRC, DEST).then()