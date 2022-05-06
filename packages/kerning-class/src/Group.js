import { Side, side }  from '@fontlab/enum-side'
import { asc }         from '@fontlab/latin'
import { groupToJson } from './groupToJson'

export class Group extends Array {
  /** @type {number} */ side = 0
  /** @type {string} */ name
  constructor(side, name, list) {
    // `[side] (${side}) [name] (${name}) [list] (${list})`  |> says['group.initialize']
    if (list) { super(...list) }
    else { super() }
    this.side = side
    this.name = name
    this.sort(asc)
    // `[side] (${this.side}) [name] (${this.name}) [list] (${this.names})`  |> says['group.initialize']
    // this.slice() |> deco |> says['group.initialize'].br('constructed')
  }
  static build(body) {
    return new Group(side(body), body.name, Array.isArray(body) ? body : Array.isArray(body.names) ? body.names : [])
  }
  static initVerso(name, names) { return new Group(Side.Verso, name, names) }
  static initRecto(name, names) { return new Group(Side.Recto, name, names) }
  get names() { return this.slice() }
  is1st() { return Boolean(this.side & 1) }
  is2nd() { return Boolean(this.side & 2) }
  toObject() { return { side: this.side, name: this.name, names: this.slice() } }
  toJson() { return groupToJson(this) }
  toString() { return `[side] (${this.side}) [key] (${this.name}) [glyphs] (${this.slice()})` }
}

