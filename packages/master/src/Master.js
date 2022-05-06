import { groupedToSurject }                                          from '@analys/convert'
import { AVERAGE }                                                   from '@analys/enum-pivot-mode'
import { Table }                                                     from '@analys/table'
import { round }                                                     from '@aryth/math'
import { Scope }                                                     from '@fontlab/enum-scope'
import { Side }                                                      from '@fontlab/enum-side'
import { Grouped }                                                   from '@fontlab/kerning-class'
import { Latin }                                                     from '@fontlab/latin'
import { parseNum }                                                  from '@typen/numeral'
import { head as rectoKeys, indexed, side as versoKeys, updateCell } from '@vect/nested'
import { ob }                                                        from '@vect/object-init'
import { CONVERT_OPTIONS, TABULAR_OPTIONS }                          from '../asset'
import { AT, glyphTrim, glyphTrimBeta, glyphTrimLeft, unionAcquire } from '../utils'
import { masterToJson }                                              from './masterToJson'

export class Master {
  /** @type {string}                                      */ name
  /** @type {Object<string,Group>}                        */ grouped
  /** @type {Object<string,Object<string,string|number>>} */ pairs

  constructor(name, grouped, pairs) {
    this.name = name
    this.grouped = grouped
    this.pairs = pairs
  }
  static build(name, grouped, body) { return new Master(name, grouped, body) }
  static fromEntry(name, { kerningClasses = [], pairs = {} } = {}) {
    return new Master(name, Grouped.from(kerningClasses), pairs)
  }
  static from({ name, kerningClasses = [], pairs = {} } = {}) {
    return new Master(name, Grouped.from(kerningClasses), pairs)
  }

  get kerningClasses() { return Object.values(this.grouped) }
  pairKeys(side) {
    const list = []
    if (side & 1) unionAcquire(list, versoKeys(this.pairs))
    if (side & 2) unionAcquire(list, rectoKeys(this.pairs))
    return list
  }
  pairGlyphs(side) {
    let glyphs = Grouped.select(this.grouped, side)|> groupedToSurject |> Object.keys
    if (side & 1) unionAcquire(glyphs, versoKeys(this.pairs).map(glyphTrim))
    if (side & 2) unionAcquire(glyphs, versoKeys(this.pairs).map(glyphTrim))
    return glyphs
  }

  granularPairs() {
    const groupedX = Grouped.select(this.grouped, Side.Verso)
    const groupedY = Grouped.select(this.grouped, Side.Recto)
    const target = {}
    const fake = []
    let nameX, nameY
    for (let [ miscX, miscY, v ] of indexed(this.pairs)) {
      if (AT.test(miscX) && (nameX = glyphTrimLeft(miscX))) {
        if (AT.test(miscY) && (nameY = glyphTrimLeft(miscY))) {
          for (let x of groupedX[nameX] ?? fake) for (let y of groupedY[nameY] ?? fake) updateCell.call(target, x, y, v)
        }
        else {
          for (let x of groupedX[nameX] ?? fake) updateCell.call(target, x, miscY, v)
        }
      }
      else {
        if (AT.test(miscY) && (nameY = glyphTrimLeft(miscY))) {
          for (let y of groupedY[nameY] ?? fake) updateCell.call(target, miscX, y, v)
        }
        else {
          updateCell.call(target, miscX, miscY, v)
        }
      }
    }
    return target
  }

  updatePairs(indexed) {
    for (let [ x, y, v ] of indexed) updateCell.call(this.pairs, x, y, v)
    return this
  }

  pairsToTable(scopeX = Scope.Upper, scopeY = Scope.Upper) {
    const filterX = Latin.filterFactory(scopeX), filterY = Latin.filterFactory(scopeY)
    const enumerator = indexed(this.pairs, {
      by: (x, y) => filterX(glyphTrimBeta(x)) && filterY(glyphTrimBeta(y)),
      to: (x, y, kern) => [ x, y, parseNum(kern) ]
    })
    return Table.from({
      head: [ 'group.v', 'group.r', 'kerning' ],
      rows: [ ...enumerator ],
      title: 'pairs'
    })
  }

  // { scope, spec, groups }
  crostab(options = TABULAR_OPTIONS) {
    const valid = tx => tx?.length
    const { scope, spec } = options
    const table = this.pairsToTable(scope.x, scope.y)
    return table.crosTab({
      side: spec.x,
      banner: spec.y,
      field: { kerning: spec.mode },
      filter: ob([ spec.x, valid ], [ spec.y, valid ]),
      formula: spec.mode === AVERAGE ? ({ value }) => round(value) : round
    })
  }

  toJson(options = CONVERT_OPTIONS) { return masterToJson(this, options) }
}
