---
"peer-rtc": minor
---

Join a PeerJS room after local camera and microphone start. Lobby codes must match `xxxxxxxx-xxxx`. Auth routes for login, register, forgot password, and reset password are registered so typed `Link` targets resolve. In development, `/api/auth` is proxied through the Vite HTTPS origin so the browser does not hit the auth server's self-signed certificate.
