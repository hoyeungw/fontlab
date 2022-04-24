import { CATEGORIES, Category }                 from '../asset/Category'
import { VFM }                                  from '../src/VFM'
import { deco, decoCrostab, decoSamples, says } from '@spare/logger'
import { FONTLAB }                              from '../asset'

const SRC = process.cwd() + '/packages/metrics/static/metrics'
const DEST = process.cwd() + '/packages/metrics/static/output'

// const FILE = 'DolceFut.vfm'
// const FILE = 'LoVirgil.vfm'
const FILE = 'Chalene.vfm'

export const test = async () => {
  const vfm = await VFM.fromFile(SRC + '/' + FILE)

  vfm.kerningClasses().map(o => o.toObject()) |> decoSamples  |> says[FONTLAB]

  vfm.alphabetsByLayers() |> decoCrostab  |> says[FONTLAB]

  vfm.alphabetGroups() |> deco |> says[FONTLAB]

  const kerning = vfm.layerToKerning[vfm.defaultLayer]

  kerning.versos(Category.Upper)  |> deco  |> says[FONTLAB].p('1st').p(Category.Upper)
  kerning.versos(Category.Lower)  |> deco  |> says[FONTLAB].p('1st').p(Category.Lower)
  kerning.versos(Category.Other)  |> deco  |> says[FONTLAB].p('1st').p(Category.Other)

  kerning.rectos(Category.Upper)  |> deco  |> says[FONTLAB].p('2nd').p(Category.Upper)
  kerning.rectos(Category.Lower)  |> deco  |> says[FONTLAB].p('2nd').p(Category.Lower)
  kerning.rectos(Category.Other)  |> deco  |> says[FONTLAB].p('2nd').p(Category.Other)

  for (let versoCategory of CATEGORIES) {
    for (let rectoCategory of CATEGORIES) {
      kerning.pairsCrostabs(versoCategory, rectoCategory)  |> decoCrostab  |> says[FONTLAB].p(versoCategory).p(rectoCategory)
    }
  }


  await vfm.save(DEST + '/' + FILE, { kerningClasses: true })
}

test().then()
