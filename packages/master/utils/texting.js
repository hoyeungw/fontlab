export const AT = /^@+/

export const glyphTrim = name => name
  .replace(AT, '')
  .replace(/\d+$/, '')

export const glyphTrimLeft = name => name
  .replace(AT, '')

export const glyphTrimBeta = x => x.replace(/@?([A-Za-z_]+)\d*/, (_, ph) => ph)