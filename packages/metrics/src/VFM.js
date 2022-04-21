import { mapper }       from '@vect/object-mapper'
import { logger, says } from '@spare/logger'
import { FONTLAB }      from '../asset'
import { promises }     from 'fs'
import { firstValue }   from '@vect/object-select'

export class VFM {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Kerning>} */
  layerToKerning // LayersToKerning
  /** @type {Object<string,Object<string,Metrics>>} */
  glyphLayerToMetrics // GlyphsToLayersToMetrics
  upm

  /**
   * @param {FontlabJson} vfm
   */
  constructor(vfm) {
    this.dataType = vfm.dataType
    vfm.dataType  |> says[FONTLAB]
    this.layerToKerning = mapper(vfm.masters, Kerning.build)
    this.glyphLayerToMetrics = mapper(vfm.metrics, glyphsToMetrics => mapper(glyphsToMetrics.layers, Metrics.build))
    this.layerToKerning  |> Object.keys  |> logger
    // this.glyphLayerToMetrics |> Object.keys|> logger
    this.upm = vfm.upm
  }
  static build(fontlabJson) { return new VFM(fontlabJson) }
  static async fromFile(filePath) {
    // says[FONTLAB](`loading ${ros(filePath)}`)
    const buffer = await promises.readFile(filePath, 'utf8')
    // says[FONTLAB](`loaded ${ros(filePath)}`)
    const fontlabJson = await JSON.parse(buffer.toString())
    return VFM.build(fontlabJson)
  }

  get layers() { return Object.keys(this.layerToKerning) }
  kerningClasses(layer) {
    const kerning = layer?.length ? this.layerToKerning[layer] : firstValue(this.layerToKerning)
    return kerning.kerningClasses.map(kerningClass => kerningClass.toObject())
  }
}

export class Kerning {
  kerningClasses
  pairs
  constructor(kerning) {
    this.kerningClasses = (kerning.kerningClasses ?? []).map(KerningClass.build)
    this.pairs = kerning.pairs
  }
  static build(fontlabKerning) { return new Kerning(fontlabKerning) }
}

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
  }
  static build(body) { return new KerningClass(body) }
  get side() { return this._1st ? 'verso' : this._2nd ? 'recto' : null }
  toObject() { return { side: this.side, key: this.name, glyphs: this.names }}
  toString() { return `[side] (${this.side}) [key] (${this.name}) [glyphs] (${this.names})` }
}

export class Metrics {
  lsb
  rsb
  metricsLeft
  metricsRight
  width
  xmax
  xmin
  ymax
  ymin
  constructor(metrics) {
    this.lsb = metrics.lsb
    this.rsb = metrics.rsb
    this.metricsLeft = metrics.metricsLeft
    this.metricsRight = metrics.metricsRight
    this.width = metrics.width
    this.xmax = metrics.xmax
    this.xmin = metrics.xmin
    this.ymax = metrics.ymax
    this.ymin = metrics.ymin
  }
  static build(metrics) { return new Metrics(metrics) }
  toString() {
    return `[sideBearing] (${this.lsb},${this.rsb}) [width] (${this.width}) [extreme] ({ xmin:${this.xmin},xmax:${this.xmax},ymin:${this.ymin},ymax:${this.ymax})`
  }
}