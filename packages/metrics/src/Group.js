import { groupToJson } from './convert/groupToJson'

export class Group {
  /** @type {boolean} */ _1st
  /** @type {boolean} */ _2nd
  /** @type {string} */ name
  /** @type {Array<string>} */ names
  constructor(body) {
    this._1st = body['1st']
    this._2nd = body['2nd']
    this.name = body.name
    this.names = body.names
    this.names.sort()
  }
  static build(body) { return new Group(body) }
  get side() { return this._1st ? 'verso' : this._2nd ? 'recto' : null }
  toObject() { return { side: this.side, key: this.name, glyphs: this.names }}
  toJson() { return groupToJson(this) }
  toString() { return `[side] (${this.side}) [key] (${this.name}) [glyphs] (${this.names})` }
}