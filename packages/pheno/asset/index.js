export { WEIGHTS, WEIGHTS_TO_INITIALS }                        from './WEIGHTS'
export { CONVERT_OPTIONS }                                     from './CONVERT_OPTIONS'
export { GLYPH, LETTER, GROUP, LAYER, KERNING, L, R, FONTLAB } from './constants'
export { LAYERS_PRIORITY, getFace }                            from './LAYERS_PRIORITY'

/**
 * @typedef {{
 *    dataType:string,
 *    masters:LayerToFontlabKerning,
 *    metrics:GlyphToFontlabMetrics,
 *    upm:number
 * }} FontlabJson
 */

// LayerToFontlabKerning
//  - FontlabKerning
//    - FontlabKerningDefinition
//    - FontlabKerningPair

/**
 * @typedef {Object<string,FontlabKerning>|{
 *   [Light]: FontlabKerning,
 *   [Regular]: FontlabKerning,
 *   [Bold]: FontlabKerning,
 * }} LayerToFontlabKerning - layer name as key
 *
 * @typedef {{
 *     master: FontlabKerningDefinition[],
 *     pairs: GlyphToFontlabKerningPair
 * }} FontlabKerning
 *
 * @typedef {{
 *    '1st':boolean,
 *    '2nd':boolean,
 *    name:string,
 *    names:Array<string>
 * }} FontlabKerningDefinition
 *
 * @typedef {Object<string, FontlabKerningPair>|{
 *   [A]: FontlabKerningPair,
 *   [B]: FontlabKerningPair,
 *   [C]: FontlabKerningPair,
 * }} GlyphToFontlabKerningPair
 *
 * @typedef {Object<string,string|number>|{
 *
 * }} FontlabKerningPair
 */

// GlyphToFontlabMetrics


/**
 * @typedef {Object<string, {layers:LayerToMetricParams}>|{
 *    [A]: {layers:LayerToMetricParams},
 *    [B]: {layers:LayerToMetricParams},
 *    [C]: {layers:LayerToMetricParams},
 * }} GlyphToFontlabMetrics
 *
 * @typedef {{
 *       [Hairline]: MetricsParams,
 *       [Thin]: MetricsParams,
 *       [ExtraLight]: MetricsParams,
 *       [Light]: MetricsParams,
 *       [Regular]: MetricsParams,
 *       [Medium]: MetricsParams,
 *       [SemiBold]: MetricsParams,
 *       [Bold]: MetricsParams,
 *       [Black]: MetricsParams,
 * }} LayerToMetricParams
 *
 * @typedef {{
 *    lsb: number,
 *    rsb: number,
 *    [width]: number,
 *    [xmax]: number,
 *    [xmin]: number,
 *    [ymax]: number,
 *    [ymin]: number,
 * }} MetricsParams
 */