# @fontlab/viva-font-module

A class to represent and manipulate FontLab VFM (vfm) files.

## VFM File Structure

A VFM file is a JSON-based format used by FontLab to store comprehensive font metrics information, including kerning
classes, kerning kerningPairs, and glyph metrics across different layers/masters.

### Basic Structure

```json
{
  "dataType": "com.fontlab.metrics",
  "metrics": {
    "Glyph1": { "layers": { "Layer1": { ... }, "Layer2": { ... } } },
    "Glyph2": { "layers": { "Layer1": { ... }, "Layer2": { ... } } },
    "Glyph3": { "layers": { "Layer1": { ... }, "Layer2": { ... } } }
  },
  "masters": {
    "Layer1": { "kerningClasses": [...], "kerningPairs": { ... } },
    "Layer2": { "kerningClasses": [...], "kerningPairs": { ... } }
  },
  "upm": 1000
}
```

### Key Components

#### 1. dataType

- Always `"com.fontlab.metrics"` for VFM files

#### 2. masters

An object mapping layer/master names to their respective data:

```json
"masters": {
  "Regular": {
    "kerningClasses": [...],
    "kerningPairs": { ... }
  }
}
```

##### kerningClasses

Array of kerning class definitions:

```json
{
  "1st": true,        // true if this class is for the first glyph in a pair
  "2nd": false,       // true if this class is for the second glyph in a pair  
  "name": "A1",       // Class name
  "names": [          // Glyphs belonging to this class
    "A",
    "Agrave",
    "Aacute",
    "Acircumflex"
  ]
}
```

##### kerningPairs

Object containing kerning pair values:

```json
"kerningPairs": {
  "A": {
    "V": -10,
    "W": -15
  },
  "B": {
    "A": -5
  }
}
```

#### 3. metrics

Object mapping glyph names to their metric data:

```json
"metrics": {
  "A": {
    "layers": {
      "Regular": {
        "lsb": 50,     // Left side bearing
        "rsb": 50,     // Right side bearing
        "width": 600,   // Glyph width
        "xmin": 0,      // Minimum x-coordinate
        "xmax": 600,    // Maximum x-coordinate
        "ymin": -200,   // Minimum y-coordinate
        "ymax": 800     // Maximum y-coordinate
      }
    }
  }
}
```

#### 4. upm

Units per em - the coordinate system scale for the font (e.g., 1000, 2048)

## Usage

```javascript
import { VFM } from '@fontlab/vfm'
import { readFile } from 'fs/promises'

// Read and parse a VFM file
const vfmJson = await JSON.parse(await readFile('path/to/your.vfm', 'utf8'))
const vfm = VFM.build(vfmJson)

// Access metric series for a specific layer
const metricSeries = vfm.metricSeries('Regular')

// Get metrics for a specific glyph
const aMetrics = vfm.selectMetrics('Regular').A
console.log(aMetrics.lsb, aMetrics.rsb, aMetrics.width)
```

## Installation

```console
$ npm install @fontlab/vfm
```

## API

### VFM Class

#### Constructor

```javascript
new VFM(json)
```

Creates a new VFM instance from a VFM JSON object.

#### Static Methods

- `VFM.build(json)`: Creates a new VFM instance from a VFM JSON object.

#### Instance Methods

- `selectMetrics(layer)`: Returns metrics for all glyphs in the specified layer.
- `metricSeries(layer)`: Returns a MetricSeries instance for the specified layer, containing metrics, kerning classes,
  and kerningPairs.

## License

MIT