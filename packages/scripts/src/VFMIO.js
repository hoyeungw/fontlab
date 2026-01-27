import { CONVERT_OPTIONS }            from '@fontlab/constants'
import { masterToClass }              from '@fontlab/master'
import { decoString }                 from '@spare/logger'
import { $ }                          from '@spare/xr'
import { indexedTo }                  from '@vect/object-mapper'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { exists, pathToInfo }         from '@iohub/pathinfo'
import { VFM }                        from '@fontlab/vfm'

/** @typedef {{['1st'],['2nd'],name,names}} KerningClass */

//console.log($.fontlab('VFMIO').readFile(decoPath(filePath)))
//console.log($.fontlab('VFMIO').save('VFM').options(decoFlat(options)).dest(decoString(filePath)))

export class VFMIO {
  static async readFile(filePath) {
    const text = await readFile(filePath, 'utf8')
    const json = await JSON.parse(text)
    return VFM.build(json)
  }
  /**
   *
   * @param {VFM} vfm
   * @param {string} filePath
   * @param {{[metrics],[kerningClasses],[kerningPairs]}} options
   * @returns {Promise<void>}
   */
  static async saveFile(vfm, filePath, options = CONVERT_OPTIONS) {
    const json = vfm.slice(options)
    const text = JSON.stringify(json)
    return await writeFile(filePath, text)
  }

  static async separate(filePath, destDir) {
    const { dir, base, ext } = pathToInfo(filePath)
    const vfm = await VFMIO.readFile(filePath)
    if (!destDir) destDir = dir + '/' + base
    if (!await exists(destDir)) await mkdir(destDir, { recursive: true })
    await VFMIO.saveFile(vfm, destDir + '/' + base + '-kerningClasses' + ext, { kerningClasses: true })
    await VFMIO.saveFile(vfm, destDir + '/' + base + '-kerningPairs' + ext, { kerningPairs: true })
    await VFMIO.saveFile(vfm, destDir + '/' + base + '-metrics' + ext, { metrics: true })
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
}
