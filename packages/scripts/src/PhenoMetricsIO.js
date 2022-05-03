import { parsePath }      from '@acq/path'
import { ALPHABET_UPPER } from '@fontlab/latin'
import { FONTLAB }        from '@fontlab/pheno'
import { Csv }            from '@spare/csv'
import { decoCrostab }    from '@spare/logger'
import { says }           from '@spare/xr'
import { promises }       from 'fs'
import { PhenoIO }        from './PhenoIO'

export class PhenoMetricsIO {
  static async saveSidebearingTable(srcVfm, destCsv,) {
    const base = parsePath(srcVfm).base
    const pheno = await PhenoIO.readPheno(srcVfm)
    const sidebearingTable = pheno.sidebearingTable(ALPHABET_UPPER)
    sidebearingTable |> decoCrostab |> says[FONTLAB].br('sidebearingTable')
    const csv = Csv.table(sidebearingTable.toTable(base))
    await promises.writeFile(`${destCsv}/${base}.csv`, csv)
  }
}
