# Backend security controls

| Control | Where | Behaviour |
|---|---|---|
| Error masking | `src/common/all-exceptions.filter.ts` (global `APP_FILTER`) | `HttpException`s and body-parser 4xx errors (`expose: true`) pass through. Everything else, such as TypeORM/pg errors or bugs, is logged server-side and returned as a generic `500 Internal server error`. |
| Rate limiting | `ThrottlerModule` + global `ThrottlerGuard` in `app.module.ts`; `src/common/rate-limits.ts` | Default 120 req/min per IP (`THROTTLE_LIMIT`, `THROTTLE_TTL_MS`). Login 10/min, signup 5/10 min, contact and feedback 5/10 min. Responds `429` with `Retry-After`. The store is in-memory per process: use a shared store (e.g. Redis) before scaling out. Set `TRUST_PROXY=1` behind a proxy. |
| Security headers | `helmet` in `main.ts` | API-only CSP (`default-src 'none'; frame-ancestors 'none'`), `X-Frame-Options: DENY`, HSTS, `nosniff`, `CORP: same-site`, no `X-Powered-By`. |
| CORS | `enableCors` in `main.ts` | Exact-match allowlist from `CORS_ORIGINS` (comma-separated, default `http://localhost:5173`). Methods GET/POST/PATCH/DELETE; headers `Content-Type`, `Authorization`; `credentials: false`. |
| Input | global `ValidationPipe`, JSON limit 100 kB | Whitelisted DTOs with unknown fields rejected; oversized bodies get `413`. |

## CSRF mitigation at the state layer

CSRF works because a browser **automatically attaches ambient credentials**, mainly cookies, to a request that another site makes it send. This API has no ambient credentials:

1. **Session state is a bearer token, not a cookie.** After login the JWT is stored in `localStorage` (`pb_token`, `frontend/src/lib/admin-api.ts`). Each request adds it explicitly as `Authorization: Bearer …`. A form post, image tag or `fetch` from another origin cannot read this origin's storage, so it arrives without the token. `JwtAuthGuard` then returns `401` before any state changes.
2. **The server sets no cookies**, and CORS runs with `credentials: false`. Nothing the browser holds can authorize a request on its own.
3. **CORS keeps cross-origin scripts out.** Because of `Authorization` and `Content-Type: application/json`, a cross-origin request needs a preflight. Only origins in `CORS_ORIGINS` pass it.
4. **State-changing routes only accept JSON** (`POST/PATCH/DELETE` with validated DTOs). A plain HTML form cannot produce a valid request without a preflight.

As a result, CSRF tokens and `SameSite` cookie settings are not required.

**The trade-off is XSS.** A token in `localStorage` is readable by any script running on the frontend origin. So the frontend's XSS posture (no `dangerouslySetInnerHTML` with untrusted data, a strict CSP on the hosting layer, vetted dependencies) is what protects sessions. Tokens expire after `JWT_EXPIRES_IN_SECONDS` (7 days by default). Shorten this if needed.

**If the app ever moves to cookie sessions** (e.g. `httpOnly` refresh cookies), CSRF becomes relevant again. Then:
- set `SameSite=Strict` (or `Lax`) and `Secure`;
- turn on `credentials: true` with the existing exact-origin allowlist (never `*`);
- add a double-submit or synchronizer CSRF token on state-changing routes.

## Deployment checklist
- `CORS_ORIGINS` = the production frontend origin(s), e.g. `https://pointbridge.example`.
- `TRUST_PROXY=1` when behind nginx, a load balancer or a PaaS router.
- A strong, unique `JWT_SECRET` per environment.
- Serve over HTTPS only. HSTS is already sent.
