# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2024-11-01

### Added

- MemViewRenderOptions: Define how the arrays must be rendered

### Changed

- MemViewArray[1d][2d][2dFlat]: handle renderOptions
- MemViewRenderCPU: handle renderOptions
- MemViewDraw: handle renderOptions

## [0.2.1] - 2024-11-01

### Changed

- RenderCPU: Fix `hexToRgba` function for bitmap rendering.

## [0.2.0] - 2024-10-30

### Added

- Keyboard: Handling of Keyboard events on interface.
- Keyboard: `getKey()` to get the state of a key (boolean).
- Keyboard: `bindKeyEvent()` to bind a callback on key event.
- Keyboard: Enum `KeyCode` that list all keys.
- Keyboard: Interface `KeyEvent` that is used for `bindKeyEvent()`.

## [0.1.3] - 2024-10-29

### Chore

- Readme: add diagram of MemView

## [0.1.2] - 2024-10-29

### Fixed

- Front - MemViewArray2d: fix inverted accessor in getData()

## [0.1.1] - 2024-10-29

Readme changes.

## [0.1.0] - 2024-10-29

Initial release.
