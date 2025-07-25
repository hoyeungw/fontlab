import { parsePath }                   from '@acq/path'
import { CONVERT_OPTIONS }             from '@fontlab/constants'
import { masterToClass, masterToJson } from '@fontlab/master'
import { embedLayerToMetrics }         from '@fontlab/metric'
import { Typeface }                    from '@fontlab/typeface'
import { decoFlat, decoString }        from '@spare/logger'
import { $ }                           from '@spare/xr'
import { indexedTo, mapVal }           from '@vect/object-mapper'
import { mkdir, readFile, writeFile }  from 'fs/promises'
import { decoPath }                    from '@spare/deco-path'
import { exists }                      from '@iohub/pathinfo'

const CLASS = 'TypefaceIO'

/** @typedef {{['1st'],['2nd'],name,names}} KerningClass */

export class TypefaceIO {
  static async loadTypeface(srcVFM) {
    const buffer = await readFile(srcVFM, 'utf8')
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
    const json = TypefaceIO.typefaceToVFM(typeface, options)
    const string = JSON.stringify(json)
    await writeFile(destVFM, string)
    console.log($.fontlab(CLASS).save('typeface(VFM)').options(decoFlat(options)).dest(decoString(destVFM)))
  }

  static async typefaceToMasters(typeface, destJSON) {
    /** @type {{masters:{name:string,kerningClasses:KerningClass[]}[]}} **/
    const json = {
      masters: [ ...indexedTo(typeface.layerToMaster, masterToClass) ],
    }
    const string = JSON.stringify(json)
    await writeFile(destJSON, string)
    console.log($.fontlab(CLASS).save('classes').dest(decoString(destJSON)))
  }

  static async sourceToProcessIntoPartition(srcVFM, destDir) {
    const { dir, base, ext } = parsePath(srcVFM)
    const typeface = await TypefaceIO.loadTypeface(srcVFM)
    if (!destDir) destDir = dir + '/' + base
    if (!await exists(destDir)) await mkdir(destDir, { recursive: true })
    await TypefaceIO.saveTypeface(typeface, destDir + '/' + base + '-groups' + ext, { groups: true })
    await TypefaceIO.saveTypeface(typeface, destDir + '/' + base + '-pairs' + ext, { pairs: true })
    await TypefaceIO.saveTypeface(typeface, destDir + '/' + base + '-metrics' + ext, { metrics: true })
  }

  /***
   * @param {Typeface} typeface
   * @param {{groups:*,pairs:*,metrics:*}} options
   * @returns {{dataType:string,[masters]:Object<string,{kerningClasses:KerningClass[],pairs}>,[metrics]:{},upm:number}} .vfm
   */
  static typefaceToVFM(typeface, options = CONVERT_OPTIONS) {
    const vfm = {}, { groups, pairs, metrics } = options
    vfm.dataType = typeface.dataType
    if (groups || pairs) vfm.masters = mapVal(typeface.layerToMaster, masterToJson.bind(options))
    if (metrics) vfm.metrics = mapVal(typeface.glyphLayerToMetric, embedLayerToMetrics)
    vfm.upm = typeface.upm
    return vfm
  }
}
