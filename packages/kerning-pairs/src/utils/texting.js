import { deco } from '@spare/logger'
import { says } from '@spare/xr'

export const AT = /^@+/

export const trimGlyph = name => name
  .replace(AT, '')
  .replace(/\d+$/, '')

export const hasAT = name => AT.test(name)

export const trimAT = name => {
  try {
    return name.replace(AT, '')
  } catch (e) {
    says.error(deco(name))
  }
}

export const baseGlyph = x => x.replace(/@?([A-Za-z_]+)\d*/, (_, ph) => ph)