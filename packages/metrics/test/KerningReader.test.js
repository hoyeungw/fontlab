import { AVERAGE }                                      from '@analys/enum-pivot-mode'
import { deco, decoCrostab, decoSamples, logger, says } from '@spare/logger'
import { FONTLAB }           from '../asset'
import { CATEGORIES, Scope } from '../asset/Scope'
import { Profile }           from '../src/Profile'

const SRC = process.cwd() + '/packages/metrics/static/metrics'
const DEST = process.cwd() + '/packages/metrics/static/output'

// const FILE = 'DolceFut.vfm'
// const FILE = 'LoVirgil.vfm'
const FILE = 'Chalene.vfm'

export const test = async () => {
  const vfm = await Profile.fromFile(SRC + '/' + FILE)

  vfm.kerningClasses().map(o => o.toObject()) |> decoSamples  |> says[FONTLAB]

  vfm.alphabetsByLayers() |> decoCrostab  |> says[FONTLAB]

  vfm.alphabetGroups() |> deco |> says[FONTLAB]

  const kerning = vfm.layerToKerning[vfm.defaultLayer]

  kerning.versos(Scope.Upper)  |> deco  |> says[FONTLAB].p('1st').p(Scope.Upper)
  kerning.versos(Scope.Lower)  |> deco  |> says[FONTLAB].p('1st').p(Scope.Lower)
  kerning.versos(Scope.Other)  |> deco  |> says[FONTLAB].p('1st').p(Scope.Other)

  kerning.rectos(Scope.Upper)  |> deco  |> says[FONTLAB].p('2nd').p(Scope.Upper)
  kerning.rectos(Scope.Lower)  |> deco  |> says[FONTLAB].p('2nd').p(Scope.Lower)
  kerning.rectos(Scope.Other)  |> deco  |> says[FONTLAB].p('2nd').p(Scope.Other)

  const SPEC_AVERAGE = { x: 'group.v', y: 'group.r', mode: AVERAGE }
  // const SPEC_MAX = { x: 'group.v', y: 'group.r', mode: MAX }
  // const SPEC_MIN = { x: 'group.v', y: 'group.r', mode: MIN }
  // const SPEC_COUNT = { x: 'group.v', y: 'group.r', mode: COUNT }
  for (let x of CATEGORIES) {
    for (let y of CATEGORIES) {
      kerning.crostab({
        scope: { x, y },
        spec: SPEC_AVERAGE
      })  |> decoCrostab  |> says[FONTLAB].p(`[average] (${x} x ${y})`)
      // kerning.crostab({ scope: { x, y }, spec: SPEC_MAX })  |> decoCrostab  |> says[FONTLAB].br('MAX').br(x).br(y)
      // kerning.crostab({ scope: { x, y }, spec: SPEC_MIN })  |> decoCrostab  |> says[FONTLAB].br('MIN').br(x).br(y)
      // kerning.crostab({ scope: { x, y }, spec: SPEC_COUNT })  |> decoCrostab  |> says[FONTLAB].br('#').br(x).br(y)
      ''  |> logger
    }
  }


  await vfm.save(DEST + '/' + FILE, { kerningClasses: true })
}

test().then()
