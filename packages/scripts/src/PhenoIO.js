import { parsePath }                       from '@acq/path'
import { masterToClass, masterToJson }     from '@fontlab/master'
import { embedLayerToMetrics }             from '@fontlab/metric'
import { CONVERT_OPTIONS, FONTLAB, Pheno } from '@fontlab/pheno'
import { decoFlat, decoString }            from '@spare/logger'
import { says }                            from '@spare/xr'
import { indexedTo, mapVal }               from '@vect/object-mapper'
import { existsSync, promises }            from 'fs'

const CLASS = 'PhenoIO'

/** @typedef {{['1st'],['2nd'],name,names}} KerningClass */

export class PhenoIO {
  static async readPheno(filePath) {
    const buffer = await promises.readFile(filePath, 'utf8');
    `[read] (${filePath |> decoString})` |> says[FONTLAB].br(CLASS).br('readPheno')
    const json = await JSON.parse(buffer.toString())
    return Pheno.build(json)
  }
  /**
   *
   * @param {Pheno} pheno
   * @param {string} destVfm
   * @param {{[groups],[pairs],[metrics]}} options
   * @returns {Promise<void>}
   */
  static async savePheno(pheno, destVfm, options = CONVERT_OPTIONS) {
    const json = PhenoIO.phenoToMetrics(pheno, options)
    const string = JSON.stringify(json)
    await promises.writeFile(destVfm, string);
    `[saved] (${options |> decoFlat}) [dest] (${destVfm |> decoString})` |> says[FONTLAB].br(CLASS).br('savePheno(VFM)')
  }

  static async saveClasses(pheno, destJson) {
    const json = PhenoIO.phenoToClasses(pheno)
    const string = JSON.stringify(json)
    await promises.writeFile(destJson, string);
    `[dest] (${destJson |> decoString})` |> says[FONTLAB].br(CLASS).br('saveClasses')
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
   * @param {Pheno} pheno
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
   * @param {Pheno} pheno
   * @returns {{masters:{name:string,kerningClasses:KerningClass[]}[]}} .json
   */
  static phenoToClasses(pheno) {
    return {
      masters: [ ...indexedTo(pheno.layerToMaster, masterToClass) ]
    }
  }
}
