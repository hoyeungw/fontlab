import { parsePath }                          from '@acq/path'
import { decoKerningClasses, GROUPS_CHALENE } from '@fontlab/master'
import { FONTLAB }                            from '@fontlab/pheno'
import { deco }                               from '@spare/logger'
import { says }                               from '@spare/xr'
import { PhenoIO }                            from './PhenoIO'

const PHENO_GROUPS_IO = 'PhenoGroupsIO'
const REGULAR = 'Regular'

export class PhenoGroupsIO {
  static async exportRegrouped(srcVfm, dest, regroups = GROUPS_CHALENE) {
    const { base, ext } = parsePath(srcVfm)
    const pheno = await PhenoIO.readPheno(srcVfm)
    pheno.mutateGroups(regroups)
    pheno.master().kerningClasses |> decoKerningClasses |> says[FONTLAB].br(PHENO_GROUPS_IO).br('exportRegrouped').br('pairs')
    pheno.master().pairs |> deco |> says[FONTLAB].br(PHENO_GROUPS_IO).br('exportRegrouped').br('pairs')
    await PhenoIO.savePheno(
      pheno,
      dest + '/' + base + ext,
      { groups: true, pairs: true, metrics: true, suffix: '-regrouped' }
    )
  }
}
