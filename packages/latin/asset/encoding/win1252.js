import { mapEntry } from '@vect/object-mapper'
/**
 * %%FONTLAB ENCODING: 8; MS Windows 1252 Western (ANSI)
 * %%GROUP:Type 1 Basic
 * %!Windows Charset:0
 * %%Source: Unicode 2.0 cp1252.txt 2.01
 * %%Release: 2010-06-06
 * %!AKA: CP1252
 * %!AKA: MS-ANSI
 * %!AKA: Latin 1
 * %
 */

/**
 * '.notdef': 0,  // .notdef
 * 'NULL': 1,     // NULL
 * 'uni0002': 2,  // U+0002: <Control>
 * 'uni0009': 9,  // U+0009: <Control>
 * 'uni000A': 10, // U+000A: <Control>
 * 'CR': 13,      // U+000D: <Control>
 */

export const GLYPH_TO_CHAR = {
  space: '\u0020',            // U+0020:  [32] Space
  exclam: '\u0021',           // U+0021:  [33] Exclamation Mark
  quotedbl: '\u0022',         // U+0022:  [34] Quotation Mark
  numbersign: '\u0023',       // U+0023:  [35] Number Sign
  dollar: '\u0024',           // U+0024:  [36] Dollar Sign
  percent: '\u0025',          // U+0025:  [37] Percent Sign
  ampersand: '\u0026',        // U+0026:  [38] Ampersand
  quotesingle: '\u0027',      // U+0027:  [39] Apostrophe
  parenleft: '\u0028',        // U+0028:  [40] Left Parenthesis
  parenright: '\u0029',       // U+0029:  [41] Right Parenthesis
  asterisk: '\u002A',         // U+002A:  [42] Asterisk
  plus: '\u002B',             // U+002B:  [43] Plus Sign
  comma: '\u002C',            // U+002C:  [44] Comma
  hyphen: '\u002D',           // U+002D:  [45] Hyphen-Minus
  period: '\u002E',           // U+002E:  [46] Full Stop
  slash: '\u002F',            // U+002F:  [47] Solidus
  zero: '\u0030',             // U+0030:  [48] Digit Zero
  one: '\u0031',              // U+0031:  [49] Digit One
  two: '\u0032',              // U+0032:  [50] Digit Two
  three: '\u0033',            // U+0033:  [51] Digit Three
  four: '\u0034',             // U+0034:  [52] Digit Four
  five: '\u0035',             // U+0035:  [53] Digit Five
  six: '\u0036',              // U+0036:  [54] Digit Six
  seven: '\u0037',            // U+0037:  [55] Digit Seven
  eight: '\u0038',            // U+0038:  [56] Digit Eight
  nine: '\u0039',             // U+0039:  [57] Digit Nine
  colon: '\u003A',            // U+003A:  [58] Colon
  semicolon: '\u003B',        // U+003B:  [59] Semicolon
  less: '\u003C',             // U+003C:  [60] Less-Than Sign
  equal: '\u003D',            // U+003D:  [61] Equals Sign
  greater: '\u003E',          // U+003E:  [62] Greater-Than Sign
  question: '\u003F',         // U+003F:  [63] Question Mark
  at: '\u0040',               // U+0040:  [64] Commercial At
  A: '\u0041',                // U+0041:  [65] Latin Capital Letter A
  B: '\u0042',                // U+0042:  [66] Latin Capital Letter B
  C: '\u0043',                // U+0043:  [67] Latin Capital Letter C
  D: '\u0044',                // U+0044:  [68] Latin Capital Letter D
  E: '\u0045',                // U+0045:  [69] Latin Capital Letter E
  F: '\u0046',                // U+0046:  [70] Latin Capital Letter F
  G: '\u0047',                // U+0047:  [71] Latin Capital Letter G
  H: '\u0048',                // U+0048:  [72] Latin Capital Letter H
  I: '\u0049',                // U+0049:  [73] Latin Capital Letter I
  J: '\u004A',                // U+004A:  [74] Latin Capital Letter J
  K: '\u004B',                // U+004B:  [75] Latin Capital Letter K
  L: '\u004C',                // U+004C:  [76] Latin Capital Letter L
  M: '\u004D',                // U+004D:  [77] Latin Capital Letter M
  N: '\u004E',                // U+004E:  [78] Latin Capital Letter N
  O: '\u004F',                // U+004F:  [79] Latin Capital Letter O
  P: '\u0050',                // U+0050:  [80] Latin Capital Letter P
  Q: '\u0051',                // U+0051:  [81] Latin Capital Letter Q
  R: '\u0052',                // U+0052:  [82] Latin Capital Letter R
  S: '\u0053',                // U+0053:  [83] Latin Capital Letter S
  T: '\u0054',                // U+0054:  [84] Latin Capital Letter T
  U: '\u0055',                // U+0055:  [85] Latin Capital Letter U
  V: '\u0056',                // U+0056:  [86] Latin Capital Letter V
  W: '\u0057',                // U+0057:  [87] Latin Capital Letter W
  X: '\u0058',                // U+0058:  [88] Latin Capital Letter X
  Y: '\u0059',                // U+0059:  [89] Latin Capital Letter Y
  Z: '\u005A',                // U+005A:  [90] Latin Capital Letter Z
  bracketleft: '\u005B',      // U+005B:  [91] Left Square Bracket
  backslash: '\u005C',        // U+005C:  [92] Reverse Solidus
  bracketright: '\u005D',     // U+005D:  [93] Right Square Bracket
  asciicircum: '\u005E',      // U+005E:  [94] Circumflex Accent
  underscore: '\u005F',       // U+005F:  [95] Low Line
  grave: '\u0060',            // U+0060:  [96] Grave Accent
  a: '\u0061',                // U+0061:  [97] Latin Small Letter A
  b: '\u0062',                // U+0062:  [98] Latin Small Letter B
  c: '\u0063',                // U+0063:  [99] Latin Small Letter C
  d: '\u0064',                // U+0064: [100] Latin Small Letter D
  e: '\u0065',                // U+0065: [101] Latin Small Letter E
  f: '\u0066',                // U+0066: [102] Latin Small Letter F
  g: '\u0067',                // U+0067: [103] Latin Small Letter G
  h: '\u0068',                // U+0068: [104] Latin Small Letter H
  i: '\u0069',                // U+0069: [105] Latin Small Letter I
  j: '\u006A',                // U+006A: [106] Latin Small Letter J
  k: '\u006B',                // U+006B: [107] Latin Small Letter K
  l: '\u006C',                // U+006C: [108] Latin Small Letter L
  m: '\u006D',                // U+006D: [109] Latin Small Letter M
  n: '\u006E',                // U+006E: [110] Latin Small Letter N
  o: '\u006F',                // U+006F: [111] Latin Small Letter O
  p: '\u0070',                // U+0070: [112] Latin Small Letter P
  q: '\u0071',                // U+0071: [113] Latin Small Letter Q
  r: '\u0072',                // U+0072: [114] Latin Small Letter R
  s: '\u0073',                // U+0073: [115] Latin Small Letter S
  t: '\u0074',                // U+0074: [116] Latin Small Letter T
  u: '\u0075',                // U+0075: [117] Latin Small Letter U
  v: '\u0076',                // U+0076: [118] Latin Small Letter V
  w: '\u0077',                // U+0077: [119] Latin Small Letter W
  x: '\u0078',                // U+0078: [120] Latin Small Letter X
  y: '\u0079',                // U+0079: [121] Latin Small Letter Y
  z: '\u007A',                // U+007A: [122] Latin Small Letter Z
  braceleft: '\u007B',        // U+007B: [123] Left Curly Bracket
  bar: '\u007C',              // U+007C: [124] Vertical Line
  braceright: '\u007D',       // U+007D: [125] Right Curly Bracket
  asciitilde: '\u007E',       // U+007E: [126] Tilde
  Euro: '\u20AC',             // U+20AC: [128] Euro Sign
  quotesinglbase: '\u201A',   // U+201A: [130] Single Low-9 Quotation Mark
  florin: '\u0192',           // U+0192: [131] Latin Small Letter F with Hook
  quotedblbase: '\u201E',     // U+201E: [132] Double Low-9 Quotation Mark
  ellipsis: '\u2026',         // U+2026: [133] Horizontal Ellipsis
  dagger: '\u2020',           // U+2020: [134] Dagger
  daggerdbl: '\u2021',        // U+2021: [135] Double Dagger
  circumflex: '\u02C6',       // U+02C6: [136] Modifier Letter Circumflex Accent
  perthousand: '\u2030',      // U+2030: [137] Per Mille Sign
  Scaron: '\u0160',           // U+0160: [138] Latin Capital Letter S with Caron
  guilsinglleft: '\u2039',    // U+2039: [139] Single Left-Pointing Angle Quotation Mark
  OE: '\u0152',               // U+0152: [140] Latin Capital Ligature Oe
  Zcaron: '\u017D',           // U+017D: [142] Latin Capital Letter Z with Caron
  quoteleft: '\u2018',        // U+2018: [145] Left Single Quotation Mark
  quoteright: '\u2019',       // U+2019: [146] Right Single Quotation Mark
  quotedblleft: '\u201C',     // U+201C: [147] Left Double Quotation Mark
  quotedblright: '\u201D',    // U+201D: [148] Right Double Quotation Mark
  bullet: '\u2022',           // U+2022: [149] Bullet
  endash: '\u2013',           // U+2013: [150] En Dash
  emdash: '\u2014',           // U+2014: [151] Em Dash
  tilde: '\u02DC',            // U+02DC: [152] Small Tilde
  trademark: '\u2122',        // U+2122: [153] Trade Mark Sign
  scaron: '\u0161',           // U+0161: [154] Latin Small Letter S with Caron
  guilsinglright: '\u203A',   // U+203A: [155] Single Right-Pointing Angle Quotation Mark
  oe: '\u0153',               // U+0153: [156] Latin Small Ligature Oe
  zcaron: '\u017E',           // U+017E: [158] Latin Small Letter Z with Caron
  Ydieresis: '\u0178',        // U+0178: [159] Latin Capital Letter Y with Diaeresis
  uni00A0: '\u00A0',          // U+00A0: [160] No-Break Space
  exclamdown: '\u00A1',       // U+00A1: [161] Inverted Exclamation Mark
  cent: '\u00A2',             // U+00A2: [162] Cent Sign
  sterling: '\u00A3',         // U+00A3: [163] Pound Sign
  currency: '\u00A4',         // U+00A4: [164] Currency Sign
  yen: '\u00A5',              // U+00A5: [165] Yen Sign
  brokenbar: '\u00A6',        // U+00A6: [166] Broken Bar
  section: '\u00A7',          // U+00A7: [167] Section Sign
  dieresis: '\u00A8',         // U+00A8: [168] Diaeresis
  copyright: '\u00A9',        // U+00A9: [169] Copyright Sign
  ordfeminine: '\u00AA',      // U+00AA: [170] Feminine Ordinal Indicator
  guillemotleft: '\u00AB',    // U+00AB: [171] Left-Pointing Double Angle Quotation Mark
  logicalnot: '\u00AC',       // U+00AC: [172] Not Sign
  uni00AD: '\u00AD',          // U+00AD: [173] Soft Hyphen
  registered: '\u00AE',       // U+00AE: [174] Registered Sign
  macron: '\u00AF',           // U+00AF: [175] Macron
  degree: '\u00B0',           // U+00B0: [176] Degree Sign
  plusminus: '\u00B1',        // U+00B1: [177] Plus-Minus Sign
  twosuperior: '\u00B2',      // U+00B2: [178] Superscript Two
  threesuperior: '\u00B3',    // U+00B3: [179] Superscript Three
  acute: '\u00B4',            // U+00B4: [180] Acute Accent
  mu: '\u00B5',               // U+00B5: [181] Micro Sign
  paragraph: '\u00B6',        // U+00B6: [182] Pilcrow Sign
  periodcentered: '\u00B7',   // U+00B7: [183] Middle Dot
  cedilla: '\u00B8',          // U+00B8: [184] Cedilla
  onesuperior: '\u00B9',      // U+00B9: [185] Superscript One
  ordmasculine: '\u00BA',     // U+00BA: [186] Masculine Ordinal Indicator
  guillemotright: '\u00BB',   // U+00BB: [187] Right-Pointing Double Angle Quotation Mark
  onequarter: '\u00BC',       // U+00BC: [188] Vulgar Fraction One Quarter
  onehalf: '\u00BD',          // U+00BD: [189] Vulgar Fraction One Half
  threequarters: '\u00BE',    // U+00BE: [190] Vulgar Fraction Three Quarters
  questiondown: '\u00BF',     // U+00BF: [191] Inverted Question Mark
  Agrave: '\u00C0',           // U+00C0: [192] Latin Capital Letter A with Grave
  Aacute: '\u00C1',           // U+00C1: [193] Latin Capital Letter A with Acute
  Acircumflex: '\u00C2',      // U+00C2: [194] Latin Capital Letter A with Circumflex
  Atilde: '\u00C3',           // U+00C3: [195] Latin Capital Letter A with Tilde
  Adieresis: '\u00C4',        // U+00C4: [196] Latin Capital Letter A with Diaeresis
  Aring: '\u00C5',            // U+00C5: [197] Latin Capital Letter A with Ring Above
  AE: '\u00C6',               // U+00C6: [198] Latin Capital Letter Ae
  Ccedilla: '\u00C7',         // U+00C7: [199] Latin Capital Letter C with Cedilla
  Egrave: '\u00C8',           // U+00C8: [200] Latin Capital Letter E with Grave
  Eacute: '\u00C9',           // U+00C9: [201] Latin Capital Letter E with Acute
  Ecircumflex: '\u00CA',      // U+00CA: [202] Latin Capital Letter E with Circumflex
  Edieresis: '\u00CB',        // U+00CB: [203] Latin Capital Letter E with Diaeresis
  Igrave: '\u00CC',           // U+00CC: [204] Latin Capital Letter I with Grave
  Iacute: '\u00CD',           // U+00CD: [205] Latin Capital Letter I with Acute
  Icircumflex: '\u00CE',      // U+00CE: [206] Latin Capital Letter I with Circumflex
  Idieresis: '\u00CF',        // U+00CF: [207] Latin Capital Letter I with Diaeresis
  Eth: '\u00D0',              // U+00D0: [208] Latin Capital Letter Eth
  Ntilde: '\u00D1',           // U+00D1: [209] Latin Capital Letter N with Tilde
  Ograve: '\u00D2',           // U+00D2: [210] Latin Capital Letter O with Grave
  Oacute: '\u00D3',           // U+00D3: [211] Latin Capital Letter O with Acute
  Ocircumflex: '\u00D4',      // U+00D4: [212] Latin Capital Letter O with Circumflex
  Otilde: '\u00D5',           // U+00D5: [213] Latin Capital Letter O with Tilde
  Odieresis: '\u00D6',        // U+00D6: [214] Latin Capital Letter O with Diaeresis
  multiply: '\u00D7',         // U+00D7: [215] Multiplication Sign
  Oslash: '\u00D8',           // U+00D8: [216] Latin Capital Letter O with Stroke
  Ugrave: '\u00D9',           // U+00D9: [217] Latin Capital Letter U with Grave
  Uacute: '\u00DA',           // U+00DA: [218] Latin Capital Letter U with Acute
  Ucircumflex: '\u00DB',      // U+00DB: [219] Latin Capital Letter U with Circumflex
  Udieresis: '\u00DC',        // U+00DC: [220] Latin Capital Letter U with Diaeresis
  Yacute: '\u00DD',           // U+00DD: [221] Latin Capital Letter Y with Acute
  Thorn: '\u00DE',            // U+00DE: [222] Latin Capital Letter Thorn
  germandbls: '\u00DF',       // U+00DF: [223] Latin Small Letter Sharp S
  agrave: '\u00E0',           // U+00E0: [224] Latin Small Letter A with Grave
  aacute: '\u00E1',           // U+00E1: [225] Latin Small Letter A with Acute
  acircumflex: '\u00E2',      // U+00E2: [226] Latin Small Letter A with Circumflex
  atilde: '\u00E3',           // U+00E3: [227] Latin Small Letter A with Tilde
  adieresis: '\u00E4',        // U+00E4: [228] Latin Small Letter A with Diaeresis
  aring: '\u00E5',            // U+00E5: [229] Latin Small Letter A with Ring Above
  ae: '\u00E6',               // U+00E6: [230] Latin Small Letter Ae
  ccedilla: '\u00E7',         // U+00E7: [231] Latin Small Letter C with Cedilla
  egrave: '\u00E8',           // U+00E8: [232] Latin Small Letter E with Grave
  eacute: '\u00E9',           // U+00E9: [233] Latin Small Letter E with Acute
  ecircumflex: '\u00EA',      // U+00EA: [234] Latin Small Letter E with Circumflex
  edieresis: '\u00EB',        // U+00EB: [235] Latin Small Letter E with Diaeresis
  igrave: '\u00EC',           // U+00EC: [236] Latin Small Letter I with Grave
  iacute: '\u00ED',           // U+00ED: [237] Latin Small Letter I with Acute
  icircumflex: '\u00EE',      // U+00EE: [238] Latin Small Letter I with Circumflex
  idieresis: '\u00EF',        // U+00EF: [239] Latin Small Letter I with Diaeresis
  eth: '\u00F0',              // U+00F0: [240] Latin Small Letter Eth
  ntilde: '\u00F1',           // U+00F1: [241] Latin Small Letter N with Tilde
  ograve: '\u00F2',           // U+00F2: [242] Latin Small Letter O with Grave
  oacute: '\u00F3',           // U+00F3: [243] Latin Small Letter O with Acute
  ocircumflex: '\u00F4',      // U+00F4: [244] Latin Small Letter O with Circumflex
  otilde: '\u00F5',           // U+00F5: [245] Latin Small Letter O with Tilde
  odieresis: '\u00F6',        // U+00F6: [246] Latin Small Letter O with Diaeresis
  divide: '\u00F7',           // U+00F7: [247] Division Sign
  oslash: '\u00F8',           // U+00F8: [248] Latin Small Letter O with Stroke
  ugrave: '\u00F9',           // U+00F9: [249] Latin Small Letter U with Grave
  uacute: '\u00FA',           // U+00FA: [250] Latin Small Letter U with Acute
  ucircumflex: '\u00FB',      // U+00FB: [251] Latin Small Letter U with Circumflex
  udieresis: '\u00FC',        // U+00FC: [252] Latin Small Letter U with Diaeresis
  yacute: '\u00FD',           // U+00FD: [253] Latin Small Letter Y with Acute
  thorn: '\u00FE',            // U+00FE: [254] Latin Small Letter Thorn
  ydieresis: '\u00FF',        // U+00FF: [255] Latin Small Letter Y with Diaeresis
}

// export const CHAR_TO_GLYPH = mapEntry(GLYPH_TO_CHAR, (k, v) => [ v, k ])

// const samples = [ ...indexedTo(GLYPH_TO_CHAR, (name, char) => ({ name, char, code: char.charCodeAt(0) })) ]
// samples |> console.table

