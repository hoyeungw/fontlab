import { parsePath }       from '@acq/path'
import { promises }        from 'fs'
import { DEFAULT_OPTIONS } from './DEFAULT_OPTIONS'

export async function fileToProfile(filePath) {
  // says[FONTLAB](`loading ${ros(filePath)}`)
  const buffer = await promises.readFile(filePath, 'utf8')
  // says[FONTLAB](`loaded ${ros(filePath)}`)
  return await JSON.parse(buffer.toString())
}
export async function profileToFile(file, { groups, pairs, metrics, suffix } = DEFAULT_OPTIONS) {
  const { dir, base, ext } = parsePath(file)
  if ((!groups || !pairs || !metrics) && !suffix) {
    suffix = groups && !pairs ? 'Classes' : !groups && pairs ? 'Pairs' : groups && pairs ? 'Masters' : ''
    if (metrics) suffix += 'Metrics'
  }
  const target = dir + '/' + base + suffix + ext
  const json = JSON.stringify(this.toJson({ groups, pairs, metrics }))
  await promises.writeFile(target, json)
}