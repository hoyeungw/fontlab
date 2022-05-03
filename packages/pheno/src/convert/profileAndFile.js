import { parsePath }       from '@acq/path'
import { promises }        from 'fs'
import { CONVERT_OPTIONS } from '../../asset'
import { profileToJson }   from './classToJson'

export async function fileToProfile(filePath) {
  const buffer = await promises.readFile(filePath, 'utf8')
  return await JSON.parse(buffer.toString())
}
export async function profileToFile(profile, file, { groups, pairs, metrics, suffix = '' } = CONVERT_OPTIONS) {
  const { dir, base, ext } = parsePath(file)
  const target = dir + '/' + base + suffix + ext
  const json = profileToJson(profile, { groups, pairs, metrics })
  const string = JSON.stringify(json)
  await promises.writeFile(target, string)
}