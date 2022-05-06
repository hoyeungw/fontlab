import { parsePath }                       from '@acq/path'
import { groupToJson, masterToJson }       from '@fontlab/master'
import { metricToJson }                    from '@fontlab/metric'
import { CONVERT_OPTIONS, FONTLAB, Pheno } from '@fontlab/pheno'
import { decoFlat, decoString }            from '@spare/logger'
import { says }                            from '@spare/xr'
import { mappedIndexed, mapValues }        from '@vect/object-mapper'
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
    const o = {}
    o.dataType = pheno.dataType
    if (options.groups || options.pairs) o.masters = mapValues(pheno.layerToMaster, master => masterToJson(master, options))
    if (options.metrics) o.metrics = mapValues(pheno.glyphLayerToMetric, layerToMetric => ({ layers: mapValues(layerToMetric, metricToJson) }))
    o.upm = pheno.upm
    return o
  }

  /***
   * @param {Pheno} pheno
   * @returns {{masters:{name:string,kerningClasses:KerningClass[]}[]}} .json
   */
  static phenoToClasses(pheno) {
    /** @type {Generator<{name,kerningClasses:KerningClass[]}, void, *>} */
    const enumerator = mappedIndexed(pheno.layerToMaster,
      (name, { kerningClasses }) => ({ name, kerningClasses: kerningClasses.map(groupToJson) }))
    return { masters: [ ...enumerator ] }
  }
}
