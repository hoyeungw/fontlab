import { CrosTab }                       from '@analys/crostab'
import { deco, decoSamples, logger, Xr } from '@spare/logger'
import { draft }                         from '@vect/matrix-init'
import { init }                          from '@vect/object-init'
import { samplesToCrostab }              from '@analys/convert'
import { mapper }                        from '@vect/object-mapper'

export const getMetricsLayers = (json) => {
  const metrics = json.metrics
  for (let key in metrics) {
    const layers = metrics[key]?.layers
    return Object.keys(layers)
  }
  return []
}

const matchGlyphsAndVariations = (name, glyphs, vars) => {
  if (glyphs.includes(name)) return [ name, '_' ]
  for (let glyph of glyphs) {
    for (let variation of vars) {
      if (name === glyph + variation) return [ glyph, variation ]
    }
  }
  return null
}

export const metricsToCrostabs = (json, { glyphs, vars }) => {
  const metrics = json.metrics
  const head = [ '_', ...vars ]
  const layers = getMetricsLayers(json)
  const crostabCollection = init(layers.map(layer => [ layer, init(glyphs.map(v => [ v, init(head.map(v => [ v, null ])) ])) ]))
  // const crostabCollection = init(layers.map(layer => [ layer, CrosTab.from({
  //   side: glyphs.slice(),
  //   head: vars.slice(),
  //   rows: draft(glyphs.length, vars.length),
  //   title: layer
  // }) ]))
  // logger(deco(crostabCollection))
  let match, glyph, variation
  for (let name in metrics) {
    if ((match = matchGlyphsAndVariations(name, glyphs, vars)) && ([ glyph, variation ] = match)) {
      const layers = metrics[name]?.layers
      for (let layer in layers) {
        const { lsb, rsb } = layers[layer]
        // logger(Xr().glyph(glyph).variation(variation).info(deco({ lsb, rsb })))
        crostabCollection[layer][glyph][variation] = [ lsb, rsb ]
      }
    }
  }
  // logger(deco(crostabCollection))
  return mapper(crostabCollection, samples => samplesToCrostab(samples, {
    side: glyphs.slice(),
    head: head.slice()
  }))
  // return samplesToCrostab(crostabCollection, { side: glyphs.slice(), head: head.slice() })
}





