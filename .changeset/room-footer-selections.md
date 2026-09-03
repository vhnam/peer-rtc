---
"@peer-rtc/app": minor
"@peer-rtc/dashboard": minor
"@peer-rtc/ui": patch
---

Add call-room footer microphone and camera device selection, virtual background
type selection (blur and default image), and a 30-second consumer pickup timeout
that shows a no-pickup state for providers and a missed-call dialog for
consumers via `consumer_not_pickup` signaling. Fix remote video freeze after
camera toggle, and share theme helpers plus avatar utils from @peer-rtc/ui.
