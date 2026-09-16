# Authentication setup

Local apps run in separate terminals with `npm run dev`:

- Backend: port 5010. `MONGO_URI` must use `maxPoolSize`, not `maxpullSize`.
- Website: http://localhost:3000
- Dashboard: http://localhost:3001 (development script).
- Both frontends: `NEXT_PUBLIC_BACKEND_URL=http://localhost:5010/api/v1`.
- Backend local email links: `BACKEND_URL=http://localhost:5010` and `FRONTEND_URL=http://localhost:3000`.

## Gmail delivery

The screenshot's SMTP 535 error means Gmail rejected the configured credentials. Set `EMAIL_ADDRESS` to the sending Gmail account and `EMAIL_PASS` to a valid app password for that same account. Use `EMAIL_HOST=smtp.gmail.com`, `EMAIL_PORT=587` (STARTTLS) or 465 (TLS), and an authorized `EMAIL_FROM` address. Restart the backend after editing its environment. No email credentials were replaced by the code fix.

Reference: https://support.google.com/mail/answer/185833

Failed registration emails leave an unverified account that can be recovered: enter the original email and password on the website login page and click **Resend verification email**. Verification is still required. Resends are limited to one successful attempt per minute per account.

## Google sign-in

In Google Cloud Console, open the Web application OAuth client matching the website's `GOOGLE_CLIENT_ID`. Add these exact **Authorized redirect URIs** as appropriate:

```text
http://localhost:3000/api/auth/callback/google
https://analyticsoccer.com/api/auth/callback/google
```

For production, set website `NEXTAUTH_URL=https://analyticsoccer.com`, frontend API URLs to `https://api.analyticsoccer.com/api/v1`, and backend `BACKEND_URL=https://api.analyticsoccer.com`, `FRONTEND_URL=https://analyticsoccer.com`. Set the dashboard's `NEXTAUTH_URL` to its own deployed origin. If another hostname (such as www) is used, its callback must also match the configured origin exactly. Rebuild frontends after public environment variable changes.

Backend and website `GOOGLE_CLIENT_ID` values must match; they currently match locally. The dashboard uses credentials login and does not require a Google callback. Cloud Console registration cannot be repaired through repository changes alone.

Reference: https://developers.google.com/identity/protocols/oauth2/web-server

## Checks

Run `npx tsc --noEmit --incremental false` in each project.
Run `node -r ts-node/register/transpile-only tests/auth-verification.cjs` in the backend for mocked regression checks; this does not send email or modify a database.
