# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js monorepo for FontLab helpers - tools for working with FontLab metrics files, kerning classes, and font data processing. The project uses pnpm workspaces and native ES modules.

## Development Commands

### Package Management
- `pnpm install` - Install dependencies for all packages
- `pnpm upint` - Interactive upgrade of all dependencies to latest
- `pnpm check` - Check for outdated packages

### Build and Development
- `pnpm build` - Build all packages using Rollup
- `pnpm watch` - Build all packages in watch mode
- `pnpm test` - Run tests for all packages with coverage

### Testing
- Tests are located in `test/` directories within each package
- Uses Node.js built-in test runner with `--experimental-test-coverage`
- Test files follow the pattern `*.test.js`

### Changesets (Release Management)
- `pnpm changeset-add` - Add a changeset for changes
- `pnpm changeset-ver` - Version packages based on changesets
- `pnpm changeset-pub` - Publish packages to npm

## Architecture

### Workspace Structure
- `packages/` - Contains all individual packages
- Each package has its own `package.json`, `src/`, `test/`, and `dist/` directories
- All packages use ES modules (`"type": "module"`)

### Core Packages
- **master** - Main Master class for FontLab data processing, handles kerning classes and pairs
- **metric** - Metric class for font metrics data (left/right sidebearings, width, bounds)
- **kerning-class** - Group and Grouped classes for kerning class management
- **kerning-pairs** - Pairs class for kerning pairs data
- **latin** - Latin alphabet utilities and character classification
- **enum-side** - Side enumeration (Verso/Recto for left/right)
- **enum-scope** - Scope enumeration utilities
- **pheno** - Pheno class for font phenotype data
- **scripts** - I/O utilities for reading/writing FontLab files
- **constants** - Shared constants across packages

### Key Classes and Relationships
- `Master` class (packages/master) - Central class that combines kerning classes and pairs
- `Grouped` class manages collections of kerning groups by side (left/right)
- `Pairs` class handles kerning pair data with flattening and regrouping capabilities
- `Metric` class handles font metrics with left/right sidebearing calculations

### Build System
- Uses Rollup for building with automatic package discovery
- Each package builds to `dist/index.js` in ESM format
- External dependencies are automatically detected from package.json
- JSON plugin and fileInfo plugin included

### File Formats
- `.vfm` files - FontLab metrics files (binary format)
- `.json` files - Processed font data
- `.xlsx` files - Excel exports of font data
- Extensive test data in `resources/` and `static/` directories

## Development Notes

### Code Style
- Uses ES modules throughout
- Classes use static factory methods (e.g., `Master.build()`, `Metric.build()`)
- Extensive use of destructuring and modern JavaScript features
- No build-time transpilation - relies on modern Node.js features

### Dependencies
- Heavy use of specialized utility libraries (all prefixed packages like `@analys/`, `@foba/`, etc.)
- Math utilities from `@aryth/math`
- Type checking utilities from `@typen/` packages
- Vector operations from `@vect/` packages