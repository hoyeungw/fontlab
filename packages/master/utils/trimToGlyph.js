export const trimToGlyph = name => name
  .replace(/^@+/, '')
  .replace(/\d+$/, '')

export const trimToGlyph2 = name => name
  .replace(/@?([A-Za-z_]+)\d*/, (_, ph) => ph)