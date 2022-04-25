import { says } from '@spare/logger'
import { time } from '@valjoux/timestamp-pretty'

export { ALPHABETS_UPPER, ALPHABETS_LOWER } from '../../latin/asset/ALPHABET_LOWER'
export { DIACRITICS }                       from '../../latin/asset/DIACRITICS'
export { WEIGHTS, WEIGHTS_TO_INITIALS }     from './WEIGHTS'
export const FONTLAB = '>> fontlab'
says[FONTLAB].attach(time)

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
 *     kerningClasses: FontlabKerningDefinition[],
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