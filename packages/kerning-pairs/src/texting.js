import { deco } from '@spare/logger'
import { says } from '@spare/xr'

export const AT = /^@+/

export const glyphTrim = name => name
  .replace(AT, '')
  .replace(/\d+$/, '')

export const offAT = name => {
  try {
    return name.replace(AT, '')
  } catch (e) {
    name |> deco |> says.error
  }
}

export const getGlyph = x => x.replace(/@?([A-Za-z_]+)\d*/, (_, ph) => ph)