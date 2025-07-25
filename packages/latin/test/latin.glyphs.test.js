import { test }             from 'node:test'
import { Latin }            from '../src/Latin.js'
import { decoObject, says } from '@spare/logger'

test('latin glyphs', () => {
  says.lower(decoObject.call({ thres: 96, vert: 0 }, Latin.lower()))
  says.upper(decoObject.call({ thres: 96, vert: 0 }, Latin.upper()))
})
