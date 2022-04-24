import { AVERAGE }                              from '@analys/enum-pivot-mode'
import { Table }                                from '@analys/table'
import { distinct }                             from '@aryth/distinct-vector'
import { round }                                from '@aryth/math'
import { deco, decoTable, logger, says }        from '@spare/logger'
import { nullish }                              from '@typen/nullish'
import { parseNum }                             from '@typen/numeral'
import { mapToObject }                          from '@vect/object-init'
import { Category }                             from '../asset/Category'
import { KERNING_CLASS_SCHEME_CHALENE }         from '../scheme/kerningClassScheme.chalene'
import { stringAscending }                      from '../util/stringAscending'
import { stringValue }                          from '../util/stringValue'
import { DEFAULT_OPTIONS, kerningToJson }       from './convert/kerningToVFM'
import { GL }                                   from './GL'
import { KerningClass }                         from './KerningClass'
import { schemeToDictRecto, schemeToDictVerso } from './scheme/schemeToDict'

export class Kerning {
  kerningClasses
  pairs
  constructor(kerning) {
    const classes = (kerning.kerningClasses ?? [])
      .map(KerningClass.build)
      .sort(({ name: a }, { name: b }) => stringValue(a) - stringValue(b))
    this.kerningClasses = [...classes.filter(({ _1st }) => _1st), ...classes.filter(({ _2nd }) => _2nd)]
    this.pairs = kerning.pairs
  }
  static build(fontlabKerning) { return new Kerning(fontlabKerning) }
  versos(category) { return GL.filter(Object.keys(this.pairs), category) }
  rectos(category) { return GL.filter(distinct(Object.values(this.pairs).map(Object.keys).flat()), category) }
  versosCompressed(category) { return distinct(this.versos(category).map(GL.glyph)).sort(stringAscending) }
  rectosCompressed(category) { return distinct(this.rectos(category).map(GL.glyph)).sort(stringAscending) }
  classes() { return this.kerningClasses.map(kerningClass => kerningClass.toObject()) }
  pairsToTable(groupKerningClasses = KERNING_CLASS_SCHEME_CHALENE) {
    const versoDict = schemeToDictVerso(groupKerningClasses)
    const rectoDict = schemeToDictRecto(groupKerningClasses)
    const table = Table.from({
      head: ['verso', 'recto', 'kerning', 'alpha.v', 'alpha.r', 'group.v', 'group.r'],
      rows: [],
      title: 'pairs'
    })
    if (!this.pairs) return table
    for (let [verso, definition] of Object.entries(this.pairs)) {
      if (!definition) continue
      for (let [recto, value] of Object.entries(definition)) {
        table.pushRow([verso, recto, parseNum(value), GL.glyph(verso), GL.glyph(recto), versoDict[verso], rectoDict[recto]])
      }
    }
    return table
  }
  regroupClasses(classScheme) {


    let targetClasses = []
    for (let kerningClass of this.kerningClasses) {

    }
    for (let glyphs of this.versos(Category.Upper)) {


    }
  }
  pairsCrostabs(versoCategory, rectoCategory) {
    this.versos(versoCategory)  |> deco  |> says['versos']
    this.versosCompressed(versoCategory)  |> deco  |> says['versos'].br('compressed')
    this.rectos(rectoCategory)  |> deco  |> says['rectos']
    this.rectosCompressed(rectoCategory)  |> deco  |> says['rectos'].br('compressed')
    const table = this.pairsToTable()
    // table  |> decoTable  |> logger
    const crostab = table.crosTab({
      side: 'group.v',
      banner: 'group.r',
      field: { 'kerning': AVERAGE },
      formula: kerning => round(kerning.value)
    })
    crostab.side[0] = '-'
    crostab.head[0] = '-'
    // if (nullish(crostab.head[0])) crostab.shiftColumn()
    // if (nullish(crostab.side[0])) crostab.shiftRow()
    return crostab
  }
  toVFM(options = DEFAULT_OPTIONS) { return kerningToJson(this, options) }
}