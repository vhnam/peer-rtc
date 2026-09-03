# @peer-rtc/dashboard

## 0.5.0

### Minor Changes

- 32ad61f: Add call-room footer microphone and camera device selection, virtual background
  type selection (blur and default image), and a 30-second consumer pickup timeout
  that shows a no-pickup state for providers and a missed-call dialog for
  consumers via `consumer_not_pickup` signaling. Fix remote video freeze after
  camera toggle, and share theme helpers plus avatar utils from @peer-rtc/ui.

### Patch Changes

- Updated dependencies [32ad61f]
  - @peer-rtc/ui@0.0.3

## 0.4.0

### Minor Changes

- 5f53e29: Add consumer and provider end-call signaling, a confirm-end dialog,
  and declined or ended states in the operator call room.

## 0.3.0

### Minor Changes

- ec56272: Add live consult-request join signaling, operator call-start waiting,
  dashboard appearance settings, and shared theme support.

### Patch Changes

- Updated dependencies [ec56272]
  - @peer-rtc/ui@0.0.2

## 0.2.0

### Minor Changes

- 28b9545: Add an operator video call room for consult requests, with camera,
  mic, and virtual background support.

## 0.1.0

### Minor Changes

- 6ca7443: Add consult-request listing, filters, and pagination for consumers
  and operators.

### Patch Changes

- Updated dependencies [6ca7443]
  - @peer-rtc/ui@0.0.1

## 0.0.0

### Patch Changes

- 05e6594: Add the operator dashboard app that reuses `@peer-rtc/auth`.
- 30f484d: Add favicons and wire them into the document head.
- f8b310b: Use Peer RTC favicon branding in auth and sidebar chrome.
