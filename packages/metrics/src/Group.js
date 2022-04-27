import { stringAscending }    from '@fontlab/latin'
import { is1st, is2nd, Side } from '../asset/Side'
import { groupToJson }        from './convert/groupToJson'

export class Group {
  /** @type {number} */ side = 0
  /** @type {string} */ name
  /** @type {Array<string>} */ names
  constructor(body) {
    if (is1st(body)) this.side |= Side.Verso
    if (is2nd(body)) this.side |= Side.Recto
    this.name = body.name
    this.names = body.names.sort(stringAscending)
  }
  static build(body) { return new Group(body) }
  is1st() { return Boolean(this.side & 1) }
  is2nd() { return Boolean(this.side & 2) }
  toObject() { return { side: this.side, name: this.name, names: this.names } }
  toJson() { return groupToJson(this) }
  toString() { return `[side] (${this.side}) [key] (${this.name}) [glyphs] (${this.names})` }
}