How to regroup a VFM

1.  VFM contains layered metrics, kerning classes, kerning pairs.

   ```javascript
   {
     "dataType": "com.fontlab.metrics",
     "metrics": {
       "Glyph1": { "layers": { "Layer1": { ... }, "Layer2": { ... } } },
       "Glyph2": { "layers": { "Layer1": { ... }, "Layer2": { ... } } },
       "Glyph3": { "layers": { "Layer1": { ... }, "Layer2": { ... } } }
     },
     "masters": {
       "Layer1": { "kerningClasses": [...], "pairs": { ... } },
       "Layer2": { "kerningClasses": [...], "pairs": { ... } }
     },
     "upm": 1000
   }
   ```

2.  MetricSeries: metrics, kerning classes, kerning pairs selected by a layer.

   ```javascript
   {
     "metrics": {
       "A": { "lsb":-25, "rsb":-25, "width":1280 },
       "B": { "lsb":120, "rsb": 50, "width":1125, "metricsLeft": "H",},
       "C": { "lsb": 50, "rsb": 80, "width":1385 }
     },
     "kerningClasses": [
       { "1st": true, "name": "A1", "names": [ "A", "Agrave", "Aacute", "Atilde" ] }, 
       { "2nd": true, "name": "E2", "names": [ "B","D","E","F","H","K","L","N","P","R" ] },
       { "2nd": true, "name": "O2", "names": [ "C", "G", "O", "Q" ] }
     ]
     "pairs": {                
       "@A1": { "@E2":-30, "@O2":-36, "C":-50, "T":-112 }, 
       "@U1": { "@A2":-36, "@E2":-50, "L":-30 },
       "B":   { "@A2":-30, "@E2":-30, "@V2":-36 },
     }
   }
   ```

3.  Regroup is operated on MetricSeries scale.

   1.  COLLECT GLYPHS. Collect all glyphs from metrics, kerning classes, kerning pairs. Since each two of the three sets have possible differences, e.g., current kerning pairs may have neglected glyphs from current kerning classes, and current kerning classes may have neglected glyphs from current metrics, the glyph list should traverse glyphs from metrics, kerning classes, kerning pairs. Also e.g., there are some glyphs defined in kerning pairs, that may not appear in the metrics, should also be kept.
   2.  INIT (LEAN) KERNINGCLASSES. Input the initial KerningClasses instance. This KerningClasses instance could be lean. e.g. 'A' contains 'A' only, without having to include 'Agrave', 'Aacute' ...
   3.  EXPAND KERNINGCLASSES. Expand the initial KerningClasses instance. Read a multimap directing how to expand 'A' to 'Agrave', 'Aacute'...,  or 'quotesingle' to 'quoteleft', 'quoteright' ... Make sure the each glyph in the expansion multimap already exist in the collected glyphs.
   4.  SURJECT KERNINGCLASSES. Convert the initial KerningClasses instance into surject form - mapping of each base glyphs to its corresponding group.
   5.  FLAT KERNINGPAIRS. Convert and flat the current KerningPairs to surject (mapping from base glyph to its corresponding KerningClass name). Provide an exogenous KerningClasss instance as parameter to destruct KerningClass (referred by KerningPairs) into elementary glyphs, e.g., destruct '@A1' into  [ 'A', 'Agrave', 'Aacute', 'Atilde' ].
   6.  REMAP KERNINGPAIRS. Iterate(index) (glyph, glyph, value) tuple in the flat KerningPairs, replace each (glyph, glyph) pair to its corresponding KerningClass name, starts with '@', (optionally) ends with '1' if its '1st' and '2' if its '2nd'.
   7.  EXPORT KERNINGPAIRS TO XLSX.
   8.  EDIT XLSX(s).
   9.  IMPORT XLSX TO KERNINGPAIRS. SAVE TO VFM.

   