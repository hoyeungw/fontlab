import { subFileInfos }      from '@acq/path'
import { deco, ros, says }   from '@spare/logger'
import { Verse }             from '@spare/verse'
import { mapToObject }       from '@vect/object-init'
import { mapKeyVal }         from '@vect/object-mapper'
import { difference, union } from '@vect/vector-algebra'
import { promises }          from 'fs'

const SRC = process.cwd() + '/packages/latin/script/asset'
const DEST = process.cwd() + '/packages/latin/script/target'
const LATIN = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ]
const GREEK = [ 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', ]
const IDIOS = [ 'Eth', 'Eng', 'Thorn', 'AE', 'OE', 'NJ', 'LJ', 'Nj', 'Lj', 'IJ' ]
const IDIOS_LOWERS = [ 'germandbls', 'cent', 'dotlessi' ]
const EXCL_UPPER = [ 'NULL', 'CR', 'Euro' ]
const REGEX_LATIN = new RegExp('^' + LATIN.join('|'))
const REGEX_GREEK = new RegExp('^' + GREEK.join('|'))
const REGEX_IDIOS = new RegExp('^' + IDIOS.join('|'))
const alphabetFactory = () => mapToObject([ ...LATIN, ...IDIOS, ...GREEK ], () => [])

const test = async () => {
  const list = (await subFileInfos(SRC)).filter(({ ext }) => ext === '.txt')
  const result = {}
  for (let { dir, base, ext } of list) {
    `[dir] (${dir}) [base] (${base}) [ext] (${ext})`  |> deco  |> says['analys']

    const text = await promises.readFile(dir + '/' + base + ext)
    const list = String(text).split('\n')
      .filter(x => x.length && !x.startsWith('//'))
      .map(x => x.replace(/\s+/g, ''))
    const alphabet = result[base] = alphabetFactory()
    let matches, letter
    for (let glyph of list) {
      if (
        ((matches = REGEX_GREEK.exec(glyph)) || (matches = REGEX_IDIOS.exec(glyph)) || (matches = REGEX_LATIN.exec(glyph)))
        && ([ letter ] = matches)
        && (!EXCL_UPPER.includes(glyph))
      ) {
        alphabet[letter].push(glyph)
      }
    }
    const set = new Set()
    for (let x in result) {
      set.add(x)
      for (let y in result) {
        if (set.has(y)) continue
        const ox = result[x], oy = result[y]
        const diff = alphabetFactory(), sum = alphabetFactory()
        for (let glyph in diff) diff[glyph] = difference(ox[glyph], oy[glyph])
        for (let glyph in sum) sum[glyph] = union(ox[glyph], oy[glyph]);
        `compare ${ros(x)} and ${ros(y)}`  |> says['analys']
        diff |> deco |> says['difference(x,y)']
        sum  |> deco |> says['union(x,y)']

        const sumLower = mapKeyVal(sum, (key, vec) => [ key.toLowerCase(), vec.map(x => x.toLowerCase()) ])
        sumLower['germandbls'] = [ 'germandbls' ]
        sumLower['c'].push('cent')
        sumLower['i'].push('dotlessi')

        await promises.writeFile(`${DEST}/GROUP_SCHEME_${x}_${y}_UPPER.js`, 'export const GROUP_SCHEME_UPPER = ' + Verse.object(sum))
        await promises.writeFile(`${DEST}/GROUP_SCHEME_${x}_${y}_LOWER.js`, 'export const GROUP_SCHEME_LOWER = ' + Verse.object(sumLower))
      }
    }
    // Verse.object(alphabet)|> logger
  }


}
test().then()
