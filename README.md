# VET-REGION — Prototipe

Regional animal-health reporting and follow-up coordination prototype
for the Pekan Insinyur Peternakan UGM 2026 competition. See
`../PRD.md`, `../plan.md`, and `../architecture.md` for scope,
requirements, and the data/access model.

All data is **simulated** and clearly labelled in the UI. The prototype
does not diagnose disease and does not replace official channels
(iSIKHNAS / Dinas).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Demo data is seeded on first run into `.data/db.json` (git-ignored).
Delete that file to reset the poll.

## End-to-end flow (demo script)

1. `/` → `/lapor` — reporter submits a report, receives a `VR-<year>-<n>`
   reference.
2. `/cek` — anyone with a reference can see workflow status (Submitted →
   Received → Needs Information → Under Review → Referred/Escalated →
   Closed), action history, and verification state. Restricted location
   detail and contacts are hidden.
3. `/masuk` — demo sign-in (no real auth in the prototype). Accounts:
   - `usr-responder-1` — responder, Sleman region
   - `usr-admin-1` — administrator
4. `/responder` — authorized queue; open a report to change workflow
   status, verification state, assignment, note, and outcome. Every
   change is recorded in the action history and audit events.
5. `/dashboard` — aggregate counts by status, sub-region (Sleman pilot),
   and species; separates unverified from confirmed; no coordinates.
6. `/edukasi` — small education library with source, reviewer, and
   review-date metadata.

## E2E test

```bash
npm start -- -p 3111 &   # then
npm run e2e              # BASE=http://localhost:3111 by default
```

## Notes for the team

- Data layer lives in `lib/store.ts` + `lib/queries.ts` with the domain
  models mirroring `architecture.md`. Swap the file-backed store for
  Supabase (Postgres + Auth + RLS) without touching the pages.
- Authorization is enforced server-side (server actions + redirects);
  the UI is not the access control.
- Before any real data: privacy review, retention policy, and a pilot
  agreement per `PRD.md` §11.
