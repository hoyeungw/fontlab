import { parsePath }              from '@acq/path'
import { masterToJson }           from '@fontlab/master'
import { CONVERT_OPTIONS, Pheno } from '@fontlab/pheno'
import { mapValues }              from '@vect/object-mapper'
import { existsSync, promises }   from 'fs'

export class PhenoIO {
  static async readPheno(filePath) {
    const buffer = await promises.readFile(filePath, 'utf8')
    const json = await JSON.parse(buffer.toString())
    return Pheno.build(json)
  }
  static async savePheno(pheno, file, { groups, pairs, metrics, suffix = '' } = CONVERT_OPTIONS) {
    const { dir, base, ext } = parsePath(file)
    const target = dir + '/' + base + suffix + ext
    const json = PhenoIO.phenoToJson(pheno, { groups, pairs, metrics })
    const string = JSON.stringify(json)
    await promises.writeFile(target, string)
  }

  static async separateVfm(srcVfm) {
    const { dir, base, ext } = parsePath(srcVfm)
    const pheno = await PhenoIO.readPheno(srcVfm)
    if (!existsSync(dir)) await promises.mkdir(dir + '/' + base, { recursive: true })
    await PhenoIO.savePheno(pheno, dir + '/' + base + '/' + base + '-groups' + ext, { groups: true })
    await PhenoIO.savePheno(pheno, dir + '/' + base + '/' + base + '-pairs' + ext, { pairs: true })
    await PhenoIO.savePheno(pheno, dir + '/' + base + '/' + base + '-metrics' + ext, { metrics: true })
  }

  /***
   * @param {Pheno} pheno
   * @param {{groups:*,pairs:*,metrics:*}} options
   * @returns {{dataType: (string|string|string|*)}}
   */
  static phenoToJson(pheno, options = CONVERT_OPTIONS) {
    const o = {}
    o.dataType = pheno.dataType
    if (options.groups || options.pairs) o.masters = mapValues(pheno.layerToMaster, master => masterToJson(master, options))
    if (options.metrics) o.metrics = mapValues(pheno.glyphLayerToMetric, layerToMetrics => ({ layers: layerToMetrics }))
    o.upm = pheno.upm
    return o
  }
}
