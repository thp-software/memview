# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.9] - 2024-11-28

### Changed

- Mapper: update replacement system.

## [0.5.8] - 2024-11-28

### Changed

- Mapper: edit regex of `replaceAnchorsDynamically` for case where anchor is the last property of JSON.

## [0.5.7] - 2024-11-26

### Added (minor changes)

- Add Button element to display.
- Add id to display element.

## [0.5.6] - 2024-11-24

### Changed

- Array focus: fix position of the focus.

### Added (minor changes)

- Add zIndex to arrays for the rendering/interaction order.

## [0.5.5] - 2024-11-22

### Changed

- Mapper: Well, again, edit regex of `replaceAnchorsDynamically` to allow eval of compiled code.

## [0.5.4] - 2024-11-22

### Changed

- Mapper: edit regex of `replaceAnchorsDynamically` again to allow eval of compiled code.

## [0.5.3] - 2024-11-22

### Changed

- Mapper: edit regex of `replaceAnchorsDynamically` to allow eval of compiled code.

## [0.5.2] - 2024-11-22

### Changed

- Readme: add showcase project and edit Output section.

## [0.5.1] - 2024-11-20

### Changed

- AudioPlayer: Delete audio onEnd only if it's not a loop.

## [0.5.0] - 2024-11-20

### Added

- AudioManager: Back & front, to store audio data.
- AudioPlayer: Front only, to play/pause/resume/stop/... audio.
- MemView Back: Add audio methods.
- MemView Front: Add audio callbacks.

## [0.4.4] - 2024-11-14

### Added (minor changes)

- MemViewOptions: Add `showCursor` boolean to show/hide UI cursor

## [0.4.3] - 2024-11-14

### Added (minor changes)

- Add `setView()` to set the view position and zoom.

## [0.4.2] - 2024-11-13

### Added (minor changes)

- MemViewOptions: Add `lockDrag` boolean to lock mouse drag
- MemViewOptions: Add `lockZoom` boolean to lock mouse zoom

## [0.4.1] - 2024-11-13

### Added (minor changes)

- MemViewOptions: Add `showConsole` boolean to show/hide console

## [0.4.0] - 2024-11-12

### Added

- Display: Add Display output
- DisplayElement: 3 types of display elements
  - DisplayElementText to draw a text
  - DisplayElementTexture to draw a texture from atlas
  - DisplayElementDiv to draw a colored rectangle

## [0.3.2] - 2024-11-05

### Changed

- Rendering: Cleaning of atlas canvas missing.

## [0.3.1] - 2024-11-04

### Changed

- Texture Rendering: Floor texture position in order to have clean render.
- Texture Rendering: Fix blur on window resize.
- Separate rendering by layers.

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
