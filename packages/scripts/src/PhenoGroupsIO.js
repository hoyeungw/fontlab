import { parsePath }          from '@acq/path'
import { FONTLAB }            from '@fontlab/pheno'
import { deco }               from '@spare/logger'
import { says }               from '@spare/xr'
import { GROUPS_CHALENE }     from '../../../resources/schemes/GROUPS_CHALENE'
import { decoKerningClasses } from '../utils/decoKerningClasses'
import { PhenoIO }            from './PhenoIO'

const CLASS = 'PhenoGroupsIO'
const REGULAR = 'Regular'

export class PhenoGroupsIO {
  static async exportRegrouped(srcVfm, dest, regroups = GROUPS_CHALENE) {
    const { base, ext } = parsePath(srcVfm)
    const pheno = await PhenoIO.readPheno(srcVfm)
    pheno.mutateGroups(regroups)
    pheno.master().kerningClasses |> decoKerningClasses |> says[FONTLAB].br(CLASS).br('exportRegrouped').br('pairs')
    pheno.master().pairs |> deco |> says[FONTLAB].br(CLASS).br('exportRegrouped').br('pairs')
    await PhenoIO.savePheno(pheno, dest + '/' + base + '-regrouped' + ext, { groups: true, pairs: true, metrics: true })
    await PhenoIO.saveClasses(pheno, dest + '/' + base + '-regrouped' + '.json',)
  }
}
