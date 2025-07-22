import { checkSide, Side } from '@fontlab/enum-side'
import { asc }             from '@fontlab/latin'
import { groupToJson }     from './groupToJson'

// Represents a single kerning group (extends Array, contains glyphs)
export class Group extends Array {
  /** @type {number} */ side = 0
  /** @type {string} */ name
  constructor(side, name, list) {
    // `[checkSide] (${checkSide}) [name] (${name}) [list] (${list})`  |> says['group.initialize']
    if (list) { super(...list) } else { super() }
    this.side = side
    this.name = name
    this.sort(asc)
    // `[checkSide] (${this.checkSide}) [name] (${this.name}) [list] (${this.names})`  |> says['group.initialize']
    // this.slice() |> deco |> says['group.initialize'].br('constructed')
  }
  static build(body) {
    return new Group(checkSide(body), body.name, Array.isArray(body) ? body : Array.isArray(body.names) ? body.names : [])
  }
  static left(name, names) { return new Group(Side.Left, name, names) }
  static right(name, names) { return new Group(Side.Right, name, names) }
  get names() { return this.slice() }
  hasLeft() { return Boolean(this.side & 1) }
  hasRight() { return Boolean(this.side & 2) }
  toObject() { return { side: this.side, name: this.name, names: this.slice() } }
  toJson() { return groupToJson(this) }
  toString() { return `[side] (${this.side}) [key] (${this.name}) [glyphs] (${this.slice()})` }
}

