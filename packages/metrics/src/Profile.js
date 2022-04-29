import { CrosTab }                                                      from '@analys/crostab'
import { AVERAGE }                                                      from '@analys/enum-pivot-mode'
import { tableCollectionToWorkbook }                                    from '@analys/table-to-excel'
import { round }                                                        from '@aryth/math'
import { ALPHABET_UPPER, Latin, Scope, shortenWeight, stringAscending } from '@fontlab/latin'
import { filterIndexed }                                                from '@vect/nested'
import { iterateValues, mapper, mapValues }                             from '@vect/object-mapper'
import { firstKey }                                                     from '@vect/object-select'
import { GROUPS_CHALENE }                                               from '../../master/asset/GROUPS_CHALENE'
import { Master }                                                       from '../../master/src/Master'
import { profileToJson }                                                from './convert/classToJson'
import { DEFAULT_OPTIONS }                                              from './convert/DEFAULT_OPTIONS'
import { fileToProfile, profileToFile }                                 from './convert/profileAndFile'
import { Metric }                                                       from './Metric'

const LAYERS_PRIORITY = [ 'Regular', 'Roman', 'Medium', 'SemiBold', 'Semi', 'Demi', 'Light' ]

export class Profile {
  dataType = 'com.fontlab.metrics'
  /** @type {Object<string,Master>} */
  layerToMaster // LayersToKerning
  /** @type {Object<string,Object<string,Metric>>} */
  glyphLayerToMetric // GlyphsToLayersToMetrics
  upm

  /**
   * @param {FontlabJson} profile
   */
  constructor(profile) {
    this.dataType = profile.dataType
    // profile.dataType  |> says[FONTLAB]
    if (profile.masters) this.layerToMaster = mapper(profile.masters, Master.build)
    if (profile.metrics) this.glyphLayerToMetric = mapper(profile.metrics, glyphsToMetrics => mapper(glyphsToMetrics.layers, Metric.build))
    this.upm = profile.upm
  }
  static build(fontlabJson) { return new Profile(fontlabJson) }
  static async fromFile(filePath) { return (await fileToProfile(filePath))|> Profile.build }
  get layers() { return Object.keys(this.layerToMaster) }
  get defaultLayer() {
    for (let layer in LAYERS_PRIORITY) if (layer in this.layerToMaster) return layer
    return firstKey(this.layerToMaster)
  }

  toJson(options = DEFAULT_OPTIONS) { return profileToJson(this, options) }

  master(layer = this.defaultLayer) { return this.layerToMaster[layer] }
  glyphToMetric(layer = this.defaultLayer) { return mapValues(this.glyphLayerToMetric, layerToMetric => layerToMetric[layer]) }

  alphabetGroups() {
    const grouped = {}
    const glyphs = Object.keys(this.glyphLayerToMetric).sort(stringAscending)
    for (let glyph of glyphs) {
      const letter = Latin.letter(glyph)
      if (!letter) continue;
      (grouped[letter] ?? (grouped[letter] = [])).push(glyph)
    }
    iterateValues(grouped, list => list.sort(stringAscending))
    return grouped
  }
  alphabetByLayer(alphabet = ALPHABET_UPPER) {
    const crostab = CrosTab.from({
      side: alphabet.slice(),
      head: this.layers.map(layer => [ layer + '.L', layer + '.R' ]).flat(),
      title: 'metrics',
    })
    const enumerator = filterIndexed(this.glyphLayerToMetric, (glyph, layer, metric) => alphabet.includes(glyph))
    for (let [ glyph, layer, metric ] of enumerator) {
      crostab.setCell(glyph, layer + '.L', round(metric.lsb))
      crostab.setCell(glyph, layer + '.R', round(metric.rsb))
    }
    return crostab.mutateBanner(shortenWeight)
  }

  async exportMastersToXlsx(layer) {
    const tableCollection = this.master(layer).crostab({
      scope: { x: Scope.Upper, y: Scope.Upper },
      spec: { x: 'group.v', y: 'group.r', mode: AVERAGE },
      groups: GROUPS_CHALENE,
    })
    tableCollectionToWorkbook()
  }
  // { groups, pairs, metrics, suffix }
  async save(file, options = DEFAULT_OPTIONS) { await profileToFile.call(this, file, options) }
}