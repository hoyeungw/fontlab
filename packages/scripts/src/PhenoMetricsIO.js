import { parsePath }         from '@acq/path'
import { ALPHABET_UPPER }    from '@fontlab/latin'
import { FONTLAB }           from '@fontlab/pheno'
import { Csv }               from '@spare/csv'
import { deco, decoCrostab } from '@spare/logger'
import { says }              from '@spare/xr'
import { writeFile }         from 'fs/promises'
import { PhenoIO }           from './PhenoIO'

const CLASS = 'PhenoMetricsIO'

export class PhenoMetricsIO {
  static async saveSidebearingTable(srcVfm, dest) {
    const base = parsePath(srcVfm).base
    const pheno = await PhenoIO.readPheno(srcVfm)
    const sidebearingTable = pheno.sidebearingTable(ALPHABET_UPPER)
    sidebearingTable |> decoCrostab |> says[FONTLAB].br(CLASS).br('sidebearingTable')
    const csv = Csv.table(sidebearingTable.toTable(base))
    await writeFile(`${dest}/${base}.csv`, csv)
  }

  static async readAlphabetGroups(srcVfm) {
    const base = parsePath(srcVfm).base
    const pheno = await PhenoIO.readPheno(srcVfm)
    pheno.alphabetGrouped()  |> deco  |>  says[FONTLAB].br(CLASS).br('alphabetGroups')
    // alphabetByLayer |> decoCrostab  |> says[FONTLAB].br(CLASS).br(ros('alphabetByLayer'))
    // await promises.writeFile(`${dest}/${base}.csv`, Csv.table(alphabetByLayer.toTable(base)))
  }
}
