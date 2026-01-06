import { surjectToGrouped }      from '@analys/convert'
import { Metric }                       from '@fontlab/metric'
import { KerningClass, KerningClasses } from '@fontlab/kerning-class'
import { KerningPairs }                 from '@fontlab/kerning-pairs'
import { asc }                          from '@fontlab/latin'
import { Side }                  from '@fontlab/enum-side'
import { indexed }               from '@vect/object-mapper'
import { distinct }              from './utils/distinct.js'
import  { GROUP_SCHEME_LOWER, GROUP_SCHEME_UPPER }  from '@fontlab/latin'

export class MetricSeries {
  /** @type {Object<string,Metric>} */ metrics
  /** @type {KerningClasses}        */ kerningClasses
  /** @type {KerningPairs}          */ pairs

  /**
   * @param {Object<string,Metric>} metrics
   * @param {KerningClasses} kerningClasses
   * @param {KerningPairs} kerningPairs
   */
  constructor(metrics, kerningClasses, kerningPairs) {
    this.metrics = metrics
    this.kerningClasses = kerningClasses
    this.pairs = kerningPairs
  }

  static build(metrics, kerningClasses, kerningPairs) {
    kerningClasses = (kerningClasses instanceof KerningClasses) ? kerningClasses : Array.isArray(kerningClasses) ? KerningClasses.build(kerningClasses) : new KerningClasses()
    kerningPairs = (kerningPairs instanceof KerningPairs) ? kerningPairs : new KerningPairs()
    return new MetricSeries(metrics, kerningClasses, kerningPairs)
  }

  get kerningClasses() { return this.kerningClasses }

  metricGlyphs() { return Object.keys(this.metrics).sort(asc) }

  kerningGlyphs(side) {
    const metricGlyphs = this.metricGlyphs()
    const groupGlyphs = this.kerningClasses.collectGlyphs(side)
    const pairGlyphs = this.pairs.collectGlyphs(side)
    return distinct(...metricGlyphs, ...groupGlyphs, ...pairGlyphs)
  }

  /**
   * Roll-up current kerningClasses(kerning classes) to cover the glyphs in the metrics, return a grouped mapping of class names to element glyphs.
   * @param {number} side
   * @param {KerningClasses|[KerningClass]} [externGroups]
   * @returns {Object<string,[string]>} Mapping of class names to element glyphs
   */
  merge(side, externGroups) {
    const kerningGlyphs = this.kerningGlyphs(side)
    const sourceSurject = this.kerningClasses.toSurject(side)
    const externSurject = externGroups?.toSurject(side) ?? {}
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

  refactorGroups(externGroups) {
    function predicate(name, list) { return list?.length } // AT.test(name) &&
    externGroups = externGroups.expand(GROUP_SCHEME_LOWER).expand(GROUP_SCHEME_UPPER)
    const groupedX = this.merge(Side.Left, externGroups)
    const groupedY = this.merge(Side.Right, externGroups)
    const groups = KerningClasses.collect(
      ...indexed(groupedX, predicate, KerningClass.entryToGroupX),
      ...indexed(groupedY, predicate, KerningClass.entryToGroupY),
    )
    return MetricSeries.build(this.metrics, groups, this.pairs.regroup(groups))
  }
}
