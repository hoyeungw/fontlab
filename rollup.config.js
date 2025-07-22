import { fileInfo } from 'rollup-plugin-fileinfo'
import { exists }   from '@iohub/pathinfo'
import { iterDir }  from '@iohub/iter'
import json         from '@rollup/plugin-json'
import { readFile } from 'fs/promises'
import { resolve }  from 'node:path'

const BASE = resolve(process.cwd(), 'packages')
const tasks = {}

console.info('Executing', BASE)

for await (const project of iterDir(BASE)) {
  const projectPath = resolve(BASE, project)
  const inputPath = resolve(projectPath, 'src', 'index.js')
  if (!await exists(inputPath)) continue
  const { dependencies } = JSON.parse(await readFile(resolve(projectPath, 'package.json'), 'utf8'))
  tasks[project] = {
    input: resolve(projectPath, 'src', 'index.js'),
    output: {
      file: resolve(projectPath, 'index.js'),
      format: 'esm',
    },
    external: Object.keys(dependencies ?? {}),
    plugins: [
      json(),
      fileInfo(),
    ],
  }
}

export default Object.values(tasks)