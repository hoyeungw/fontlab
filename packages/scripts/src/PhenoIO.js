import { parsePath }                   from '@acq/path'
import { CONVERT_OPTIONS, FONTLAB }    from '@fontlab/constants'
import { masterToClass, masterToJson } from '@fontlab/master'
import { embedLayerToMetrics }         from '@fontlab/metric'
import { Typeface }                       from '@fontlab/pheno'
import { decoFlat, decoString } from '@spare/logger'
import { $, says }              from '@spare/xr'
import { indexedTo, mapVal }    from '@vect/object-mapper'
import { existsSync, promises }        from 'fs'

const CLASS = 'PhenoIO'

/** @typedef {{['1st'],['2nd'],name,names}} KerningClass */

export class PhenoIO {
  static async readPheno(filePath) {
    const buffer = await promises.readFile(filePath, 'utf8')
    says[FONTLAB](`[read] (${(decoString(filePath))})`) //.class(CLASS).task('readPheno')
    const json = await JSON.parse(buffer.toString())
    return Typeface.build(json)
  }
  /**
   *
   * @param {Typeface} pheno
   * @param {string} destVfm
   * @param {{[groups],[pairs],[metrics]}} options
   * @returns {Promise<void>}
   */
  static async savePheno(pheno, destVfm, options = CONVERT_OPTIONS) {
    const json = PhenoIO.phenoToMetrics(pheno, options)
    const string = JSON.stringify(json)
    await promises.writeFile(destVfm, string)
    // console.log($.fontlab(CLASS).calling('savePheno(VFM)')(`[saved] (${(decoFlat(options))}) [dest] (${(decoString(destVfm))})`)
    console.log($.fontlab(CLASS).calling('savePheno(VFM)').saved(decoFlat(options)).dest(decoString(destVfm)))
  }

  static async saveClasses(pheno, destJson) {
    const json = PhenoIO.phenoToClasses(pheno)
    const string = JSON.stringify(json)
    await promises.writeFile(destJson, string)
    console.log($.fontlab(CLASS).calling('saveClasses')(`[dest] (${(decoString(destJson))})`))
  }

  static async separateVfm(srcVfm) {
    const { dir, base, ext } = parsePath(srcVfm)
    const pheno = await PhenoIO.readPheno(srcVfm)
    const groupDir = dir + '/' + base
    if (!existsSync(groupDir)) await promises.mkdir(groupDir, { recursive: true })
    await PhenoIO.savePheno(pheno, groupDir + '/' + base + '-groups' + ext, { groups: true })
    await PhenoIO.savePheno(pheno, groupDir + '/' + base + '-pairs' + ext, { pairs: true })
    await PhenoIO.savePheno(pheno, groupDir + '/' + base + '-metrics' + ext, { metrics: true })
  }

  /***
   * @param {Typeface} pheno
   * @param {{groups:*,pairs:*,metrics:*}} options
   * @returns {{dataType:string,[masters]:Object<string,{kerningClasses:KerningClass[],pairs}>,[metrics]:{},upm:number}} .vfm
   */
  static phenoToMetrics(pheno, options = CONVERT_OPTIONS) {
    const vfm = {}, { groups, pairs, metrics } = options
    vfm.dataType = pheno.dataType
    if (groups || pairs) vfm.masters = mapVal(pheno.layerToMaster, masterToJson.bind(options))
    if (metrics) vfm.metrics = mapVal(pheno.glyphLayerToMetric, embedLayerToMetrics)
    vfm.upm = pheno.upm
    return vfm
  }

  /***
   * @param {Typeface} pheno
   * @returns {{masters:{name:string,kerningClasses:KerningClass[]}[]}} .json
   */
  static phenoToClasses(pheno) {
    return {
      masters: [...indexedTo(pheno.layerToMaster, masterToClass)],
    }
  }
}
