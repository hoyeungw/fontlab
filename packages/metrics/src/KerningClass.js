export class KerningClass {
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
  static build(body) { return new KerningClass(body) }
  get side() { return this._1st ? 'verso' : this._2nd ? 'recto' : null }
  toObject() { return { side: this.side, key: this.name, glyphs: this.names }}
  toVFM() {
    const o = {}
    if (this._1st) o['1st'] = this._1st
    if (this._2nd) o['2nd'] = this._2nd
    o.name = this.name
    o.names = this.names
    return o
  }
  toString() { return `[side] (${this.side}) [key] (${this.name}) [glyphs] (${this.names})` }
}