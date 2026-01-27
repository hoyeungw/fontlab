import { KerningPairs }        from '../src/KerningPairs.js'
import { round }               from '@aryth/math'
import { MIN }                 from '@analys/enum-pivot-mode'
import { scopeName, SCOPES }   from '@fontlab/enum-scope'
import { glyphToLabel, Latin } from '@fontlab/latin'
import { labelAsc }            from '../src/utils/labelAsc.js'
import { baseGlyph }           from '../src/utils/texting.js'
import { toNum }               from '../src/utils/toNum.js'

class KPairs extends KerningPairs {
  constructor() {
    super()
  }
  * intoCrostabs() {
    function format(x) { return isNaN(x) ? '' : round(x) }
    for (const scopeX of SCOPES) {
      for (const scopeY of SCOPES) {
        const labelX = scopeName(scopeX), labelY = scopeName(scopeY)
        const crostab = this.sliceCrostab(MIN, scopeX, scopeY, format).mutateKeys(glyphToLabel)
        crostab.sideward.sortKeys(labelAsc)
        crostab.headward.sortKeys(labelAsc)
        // console.log($.fontlab('crostabCollection').scope(decoXY(labelX, labelY)).size(`${crostab.height} x ${crostab.width}`))
        // console.log(decoCrostabLocal(crostab))
        if (labelX === 'Lower' && labelY === 'Lower') {
          const predX = Latin.factory(scopeX), predY = Latin.factory(scopeY)
          const iter = this.indexed((x, y) => predX(baseGlyph(x)) && predY(baseGlyph(y)), toNum)
          for (let entry of iter) { console.log(entry) }
        }
        yield crostab
      }
    }
  }
}