import { surjectToGrouped }                            from '@analys/convert'
import { Metric }                                      from '@fontlab/metric'
import { KerningClass, KerningClasses }                from '@fontlab/kerning-class'
import { KerningPairs }                                from '@fontlab/kerning-pairs'
import { asc, GROUP_SCHEME_LOWER, GROUP_SCHEME_UPPER } from '@fontlab/latin'
import { Side }                                        from '@fontlab/enum-side'
import { indexed, mapper }                             from '@vect/object-mapper'
import { distinct }                                    from './utils/distinct.js'
import { intersect }                                   from '@vect/vector-algebra'

export class MetricSeries {
  /** @type {Object<string,Metric>} */ metrics
  /** @type {KerningClasses}        */ kerningClasses
  /** @type {KerningPairs}          */ kerningPairs

  /**
   * @param {Object<string,Metric>} metrics
   * @param {KerningClasses} kerningClasses
   * @param {KerningPairs} kerningPairs
   */
  constructor(metrics, kerningClasses, kerningPairs) {
    this.metrics = metrics
    this.kerningClasses = kerningClasses
    this.kerningPairs = kerningPairs
  }

  static build(metrics, kerningClasses, kerningPairs) {
    kerningClasses = (kerningClasses instanceof KerningClasses) ? kerningClasses : Array.isArray(kerningClasses) ? KerningClasses.build(kerningClasses) : new KerningClasses()
    kerningPairs = (kerningPairs instanceof KerningPairs) ? kerningPairs : new KerningPairs()
    return new MetricSeries(metrics, kerningClasses, kerningPairs)
  }

  get pairs() { return this.kerningPairs }
  set pairs(kerningPairs) { this.kerningPairs = kerningPairs }

  metricGlyphs() { return Object.keys(this.metrics).sort(asc) }

  collectGlyphs(side) {
    const metricGlyphs = this.metricGlyphs()
    const classGlyphs = this.kerningClasses.collectGlyphs(side)
    const pairGlyphs = this.kerningPairs.collectGlyphs(side)
    return distinct(...metricGlyphs, ...classGlyphs, ...pairGlyphs)
  }

  /**
   *
   * @param {KerningClasses} [leanClasses]
   * @param {Object<string,string[]>} [glyphMultimap]
   */
  remap(leanClasses, glyphMultimap) {
    const glyphs = this.collectGlyphs()
    let kerningClasses = leanClasses.clone()
    if (glyphMultimap) glyphMultimap = mapper(glyphMultimap, vec => intersect(vec, glyphs))
    if (glyphMultimap) kerningClasses = kerningClasses.expand(glyphMultimap)
    const kerningPairs = this.kerningPairs.regroup(kerningClasses)
    return MetricSeries.build(this.metrics, kerningClasses, kerningPairs)
  }

  /**
   * Roll-up current kerningClasses(kerning classes) to cover the glyphs in the metrics, return a grouped mapping of class names to element glyphs.
   * @param {number} side
   * @param {KerningClasses|KerningClass[]} [kerningClasses]
   * @returns {Object<string,string[]>} Mapping of class names to element glyphs
   */
  merge(side, kerningClasses) {
    const kerningGlyphs = this.collectGlyphs(side)
    const sourceSurject = this.kerningClasses.toSurject(side)
    const externSurject = kerningClasses?.toSurject(side) ?? {}
    const targetSurject = {}
    let baseGlyph, groupName
    // force mapping of internalGroups based on @fontlab/latin glyph set
    // for (const glyph of glyphList) {
    //   if ((baseGlyph = Latin.letterOrNull(glyph)) && (groupName = sourceSurject[baseGlyph])) { // Abreve → A (as base glyph) → A (as group name)
    //     targetSurject[glyph] = groupName // Abreve → A (as group name)
    //   }
    // }

    // mapping of internalGroups.
    for (const glyph of kerningGlyphs) {
      if ((groupName = sourceSurject[glyph])) { // A (as base glyph) to A (as group name)
        targetSurject[glyph] = groupName // Abreve → A (as group name)
      }
    }

    // mapping of externalGroups. may override internalGroups.
    for (const glyph of kerningGlyphs) {
      if ((groupName = externSurject[glyph])) {
        targetSurject[glyph] = groupName
      }
    }
    return surjectToGrouped(targetSurject)
  }

  refactorGroups(kerningClasses) {
    function lengthy(name, list) { return list?.length } // AT.test(name) &&
    kerningClasses = kerningClasses.expand(GROUP_SCHEME_LOWER).expand(GROUP_SCHEME_UPPER)
    const groupedX = this.merge(Side.Left, kerningClasses)
    const groupedY = this.merge(Side.Right, kerningClasses)
    const groups = KerningClasses.collect(
      ...indexed(groupedX, lengthy, KerningClass.entryToGroupX),
      ...indexed(groupedY, lengthy, KerningClass.entryToGroupY),
    )
    return MetricSeries.build(this.metrics, groups, this.kerningPairs.regroup(groups))
  }
}
