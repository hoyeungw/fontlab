import { parsePath }                          from '@acq/path'
import { decoKerningClasses, GROUPS_CHALENE } from '@fontlab/master'
import { FONTLAB }                            from '@fontlab/pheno'
import { deco }                               from '@spare/logger'
import { says }                               from '@spare/xr'
import { PhenoIO }                            from './PhenoIO'

const PHENO_GROUPS_IO = 'PhenoGroupsIO'
const REGULAR = 'Regular'

export class PhenoGroupsIO {
  static async mutateRegroup(srcVfm, dest, layer = REGULAR, regroups = GROUPS_CHALENE) {
    const pheno = await PhenoIO.readPheno(srcVfm)
    const nextMaster = pheno.master(layer).regroup(regroups)
    nextMaster.kerningClasses |> decoKerningClasses |> says[FONTLAB].br(PHENO_GROUPS_IO).br('mutateRegroup').br('pairs')
    nextMaster.pairs |> deco |> says[FONTLAB].br(PHENO_GROUPS_IO).br('mutateRegroup').br('pairs')

    for (let currLayer in pheno.layerToMaster) {
      pheno.layerToMaster[currLayer] = nextMaster
    }

    const { base, ext } = parsePath(srcVfm)
    await PhenoIO.savePheno(
      pheno,
      dest + '/' + base + ext,
      { groups: true, pairs: true, metrics: true, suffix: '-regrouped' }
    )
  }
}
