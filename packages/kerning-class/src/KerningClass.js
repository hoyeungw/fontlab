import { checkSide, Side } from '@fontlab/enum-side'
import { asc }             from '@fontlab/latin'
import { DEF, NUM, STR }   from '@typen/enum-data-types'
import { decoVector }      from '@spare/deco-vector'


export class KerningClass extends Array {
  /** @type {number} */ side = 0
  /** @type {string} */ name
  constructor(side, name, list) {
    if (list) { super(...list) } else { super() }
    this.side = side
    this.name = name
    this.sort(asc)
  }
  static build(body) {
    return new KerningClass(checkSide(body), body.name, Array.isArray(body) ? body : Array.isArray(body.names) ? body.names : [])
  }

  static entryToGroupX(name, list) {return new KerningClass(Side.Left, name, list)}
  static entryToGroupY(name, list) {return new KerningClass(Side.Right, name, list)}

  get names() { return this.slice() }

  hasLeft() { return Boolean(this.side & 1) }
  hasRight() { return Boolean(this.side & 2) }

  union(glyphs) {
    for (const glyph of glyphs) {
      if (!this.includes(glyph)) this.push(glyph)
    }
    return this.sort(asc)
  }

  expand(externGrouped) {
    for (let key of this) {
      if (key in externGrouped) {
        this.union(externGrouped[key])
      }
    }
  }

  toObject() { return { side: this.side, name: this.name, names: this.slice() } }
  toJson() {
    const o = {}
    if (this.hasLeft()) o['1st'] = true
    if (this.hasRight()) o['2nd'] = true
    o.name = this.name
    o.names = this.slice()
    return o
  }
  [Symbol.toPrimitive](type) {
    switch (type) {
      case STR:
      case DEF:
        return decoVector(this, 192)
      case NUM:
        return this.length
      default:
        throw new Error('Plot Symbol.toPrimitive error')
    }
  }
  toString() { return `[${this.name}] (${this.side}) ${this}` }
}

