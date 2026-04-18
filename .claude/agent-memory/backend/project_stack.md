---
name: FXBuddy backend stack and conventions
description: Runtime, framework, DB client, error handling patterns for fxbuddy_backend
type: project
---

Backend lives at `/Users/jakob/Documents/FXBUDDY FINAL GITHUB/fxbuddy_backend/`.

**Stack:** Node.js + TypeScript, Express, PostgreSQL via a thin custom `db` wrapper (`getDb()` from `src/db/database.ts`) with `.query()`, `.getOne()`, and `.run()` methods.

**Route files:** `src/routes/` — admin.ts, and others. All admin routes are in a single file with `adminMiddleware` applied via `router.use()`.

**Error handling convention (established):**
- Every async route handler wraps its full body in `try { ... } catch (err: any) { ... }`
- catch block logs with `[Admin] <Route> error:` prefix and returns `{ error: '...', detail: err.message }` with status 500
- Individual queries inside `Promise.all` use `.catch(() => ({ rows: [] }))` or `.catch(() => ({ count: 0 }))` so one failing query (e.g. missing `admin_alerts` table) doesn't crash the whole endpoint

**Why:** The `admin_alerts` table may not exist in all environments; the overview endpoint was crashing with unhelpful 500s when any single query in the `Promise.all` failed.
