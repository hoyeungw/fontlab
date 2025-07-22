import { parsePath }                   from '@acq/path'
import { CONVERT_OPTIONS }             from '@fontlab/constants'
import { masterToClass, masterToJson } from '@fontlab/master'
import { embedLayerToMetrics }         from '@fontlab/metric'
import { Typeface }                    from '@fontlab/typeface'
import { decoFlat, decoString }        from '@spare/logger'
import { $ }                           from '@spare/xr'
import { indexedTo, mapVal }           from '@vect/object-mapper'
import { existsSync, promises }        from 'fs'
import { decoPath }                    from '@spare/deco-path'

const CLASS = 'TypefaceIO'

/** @typedef {{['1st'],['2nd'],name,names}} KerningClass */

export class TypefaceIO {
  static async readTypeface(srcVFM) {
    const buffer = await promises.readFile(srcVFM, 'utf8')
    console.log($.fontlab(CLASS).read(decoPath(srcVFM)))
    const json = await JSON.parse(buffer.toString())
    return Typeface.build(json)
  }
  /**
   *
   * @param {Typeface} typeface
   * @param {string} destVFM
   * @param {{[groups],[pairs],[metrics]}} options
   * @returns {Promise<void>}
   */
  static async saveTypeface(typeface, destVFM, options = CONVERT_OPTIONS) {
    const json = TypefaceIO.typefaceToMetrics(typeface, options)
    const string = JSON.stringify(json)
    await promises.writeFile(destVFM, string)
    // console.log($.fontlab(CLASS).calling('savePheno(VFM)')(`[saved] (${(decoFlat(options))}) [dest] (${(decoString(destVFM))})`)
    console.log($.fontlab(CLASS).save('typeface(VFM)').options(decoFlat(options)).dest(decoString(destVFM)))
  }

  static async saveClasses(typeface, destJSON) {
    const json = TypefaceIO.typefaceToClasses(typeface)
    const string = JSON.stringify(json)
    await promises.writeFile(destJSON, string)
    console.log($.fontlab(CLASS).save('classes').dest(decoString(destJSON)))
  }

  static async separateTypeface(srcVFM, folder) {
    const { dir, base, ext } = parsePath(srcVFM)
    const typeface = await TypefaceIO.readTypeface(srcVFM)
    if (!folder) folder = dir + '/' + base
    if (!existsSync(folder)) await promises.mkdir(folder, { recursive: true })
    await TypefaceIO.saveTypeface(typeface, folder + '/' + base + '-groups' + ext, { groups: true })
    await TypefaceIO.saveTypeface(typeface, folder + '/' + base + '-pairs' + ext, { pairs: true })
    await TypefaceIO.saveTypeface(typeface, folder + '/' + base + '-metrics' + ext, { metrics: true })
  }

  /***
   * @param {Typeface} typeface
   * @param {{groups:*,pairs:*,metrics:*}} options
   * @returns {{dataType:string,[masters]:Object<string,{kerningClasses:KerningClass[],pairs}>,[metrics]:{},upm:number}} .vfm
   */
  static typefaceToMetrics(typeface, options = CONVERT_OPTIONS) {
    const vfm = {}, { groups, pairs, metrics } = options
    vfm.dataType = typeface.dataType
    if (groups || pairs) vfm.masters = mapVal(typeface.layerToMaster, masterToJson.bind(options))
    if (metrics) vfm.metrics = mapVal(typeface.glyphLayerToMetric, embedLayerToMetrics)
    vfm.upm = typeface.upm
    return vfm
  }

  /***
   * @param {Typeface} typeface
   * @returns {{masters:{name:string,kerningClasses:KerningClass[]}[]}} .json
   */
  static typefaceToClasses(typeface) {
    return {
      masters: [ ...indexedTo(typeface.layerToMaster, masterToClass) ],
    }
  }
}
