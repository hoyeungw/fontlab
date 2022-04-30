import { parsePath }       from '@acq/path'
import { promises }        from 'fs'
import { CONVERT_OPTIONS } from '../../asset'
import { profileToJson }   from './classToJson'

export async function fileToProfile(filePath) {
  // says[FONTLAB](`loading ${ros(filePath)}`)
  const buffer = await promises.readFile(filePath, 'utf8')
  // says[FONTLAB](`loaded ${ros(filePath)}`)
  return await JSON.parse(buffer.toString())
}
export async function profileToFile(profile, file, { groups, pairs, metrics, suffix } = CONVERT_OPTIONS) {
  const { dir, base, ext } = parsePath(file)
  if ((!groups || !pairs || !metrics) && !suffix) {
    suffix = groups && !pairs ? 'Classes' : !groups && pairs ? 'Pairs' : groups && pairs ? 'Masters' : ''
    if (metrics) suffix += 'Metrics'
  }
  const target = dir + '/' + base + suffix + ext
  const json = profileToJson(profile, { groups, pairs, metrics })
  const string = JSON.stringify(json)
  await promises.writeFile(target, string)
}