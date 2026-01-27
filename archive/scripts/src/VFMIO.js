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

/** @typedef {{['1st'],['2nd'],name,names}} KerningClass */

export class VFMIO {
  static async readFile(srcVFM) {
    const buffer = await readFile(srcVFM, 'utf8')
    console.log($.fontlab('VFMIO').read(decoPath(srcVFM)))
    const json = await JSON.parse(buffer.toString())
    return Typeface.build(json)
  }
  /**
   *
   * @param {Typeface} typeface
   * @param {string} destVFM
   * @param {{[kerningClasses],[kerningPairs],[metrics]}} options
   * @returns {Promise<void>}
   */
  static async saveTypeface(typeface, destVFM, options = CONVERT_OPTIONS) {
    const json = VFMIO.typefaceToVFM(typeface, options)
    const string = JSON.stringify(json)
    await writeFile(destVFM, string)
    console.log($.fontlab('VFMIO').save('typeface(VFM)').options(decoFlat(options)).dest(decoString(destVFM)))
  }

  static async typefaceToMasters(typeface, destJSON) {
    /** @type {{masters:{name:string,kerningClasses:KerningClass[]}[]}} **/
    const json = {
      masters: [ ...indexedTo(typeface.layerToMaster, masterToClass) ],
    }
    const string = JSON.stringify(json)
    await writeFile(destJSON, string)
    console.log($.fontlab('VFMIO').save('classes').dest(decoString(destJSON)))
  }

  static async separateVFM(srcVFM, destDir) {
    const { dir, base, ext } = parsePath(srcVFM)
    const typeface = await VFMIO.readFile(srcVFM)
    if (!destDir) destDir = dir + '/' + base
    if (!await exists(destDir)) await mkdir(destDir, { recursive: true })
    await VFMIO.saveTypeface(typeface, destDir + '/' + base + '-kerningClasses' + ext, { kerningClasses: true })
    await VFMIO.saveTypeface(typeface, destDir + '/' + base + '-kerningPairs' + ext, { pairs: true })
    await VFMIO.saveTypeface(typeface, destDir + '/' + base + '-metrics' + ext, { metrics: true })
  }

  /***
   * @param {Typeface} typeface
   * @param {{kerningClasses:*,kerningPairs:*,metrics:*}} options
   * @returns {{dataType:string,[masters]:Object<string,{kerningClasses:KerningClass[],kerningPairs}>,[metrics]:{},upm:number}} .vfm
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
