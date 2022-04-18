export { ALPHABETS_UPPER, ALPHABETS_LOWER } from './ALPHABETS'
export { DIACRITICS }                       from './DIACRITICS'
export { WEIGHTS, WEIGHTS_TO_INITIALS }     from './WEIGHTS'

/**
 * @typedef {{
 *    datatype:string,
 *    masters:FontlabMasters,
 *    metrics:FontlabMetrics,
 *    upm:number
 * }} VFMJson
 *
 * @typedef {
 *   Object.<string,{
 *     kerningClasses:Array<FontlabKerningClass>,
 *     pairs:FontlabKerningPairs
 *   }>
 * } FontlabMasters - layer name as key
 *
 * @typedef {{
 *    '1st':boolean,
 *    name:string,
 *    names:Array<string>
 * }} FontlabKerningClass
 *
 * @typedef {Object<string,FontlabKerningPair> } FontlabKerningPairs - '@[glyph]' as key
 *
 * @typedef {Object<string,string|number>} FontlabKerningPair
 *
 * @typedef {
 *   Object.<string,{
 *     layers:{
 *       [Hairline]: MetricsParams,
 *       [Thin]: MetricsParams,
 *       [ExtraLight]: MetricsParams,
 *       [Light]: MetricsParams,
 *       [Regular]: MetricsParams,
 *       [Medium]: MetricsParams,
 *       [SemiBold]: MetricsParams,
 *       [Bold]: MetricsParams,
 *       [Black]: MetricsParams,
 *     }
 *   }>
 * } FontlabMetrics
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