---
name: new-collection
description: >-
  Scaffold a new Firestore collection (a "table") end-to-end in this firebase-seed web app:
  data model, service (CRUD), security-rules block, seed fixtures + wiring, en-US/nl-BE i18n,
  and a Mantine CRUD page + route at /app/<collection>. Use when the user wants to add a new
  table, collection, entity, or data model to the app. Triggers include: "new table",
  "new collection", "add a table", "scaffold an entity", "/new-collection".
---

# Scaffold a new collection

Generate a new Firestore collection by mirroring the existing **`cars`** example. The canonical
step list, field-type mapping, and ownership patterns live in
**`web/docs/adding-a-collection.md`** — read it first; this skill is the procedure that applies it.

All paths are under `web/`. Use Mantine components for UI (match the rest of the app).

## Step 1 — Gather inputs

Ask the user for anything not already given (use the AskUserQuestion tool for the ownership choice):

- **Collection id** — plural, lowercase (e.g. `bikes`) and the **singular** noun (`bike`). Derive
  `Bike` (type), `bikes` (collection id + route), `BIKE_FIXTURES`, etc.
- **Fields** — name + type for each, from the cheat sheet in the guide. For each, note whether it's
  **user-editable** (gets a form input) and whether it shows on the card.
- **Ownership pattern** — offer the three from the guide, default **A (public-read / owner-write)**:
  - A. Public read / owner write (cars-style)
  - B. Owner-private (only owner reads + writes; query filters by uid)
  - C. Shared / global (no `ownerId`)
- Confirm the plan before writing files.

## Step 2 — Read the live templates

Read these and adapt them (don't invent new shapes):
`src/data/cars.ts`, `src/data/_shared.ts`, `src/services/cars.ts`, `seed/fixtures/cars.ts`,
`seed/index.ts`, `src/modules/cars/{CarsPage,CarForm}.tsx` + `useCars.ts`,
`src/global/localization/en-US/cars.json`, and the `validCar` + `match /cars` block in
`firestore.rules`. Also read `src/modules/routes.tsx`.

## Step 3 — Generate the files

Following the guide's "Add a new collection" section, create:

1. `src/data/<x>.ts` — `XData` (portable: scalars/array/map/enum/ownerId) + `X = XData & { …GeoPoint/Timestamp… }` + `converter<X>()` from `@data/_shared` + `xCol()`.
2. `src/services/<x>.ts` — `XWithId`, `XInput = Omit<X, server fields>`, `subscribeXs`, `createX`, `updateX`, `deleteX`. Adjust per the ownership pattern (uid filter for B; no `ownerId` for C).
3. `firestore.rules` — add `validX(d)` that **mirrors the `X` type exactly** (cheat sheet) and a `match /<x>/{id}` block for the chosen ownership pattern. Reuse `isSignedIn` / `isOwner`.
4. `seed/fixtures/<x>.ts` — `XFixture = Omit<XData, "ownerId"> & { …helpers for SDK fields… }` with `import type { XData }`; an `X_FIXTURES` array (3–6 rows).
5. `src/global/localization/en-US/<x>.json` **and** `nl-BE/<x>.json` — one namespace each; mirror `cars.json` keys for the fields you generate. (Auto-loaded; no index edits.)
6. `src/modules/<x>/` — `XPage.tsx`, `XForm.tsx`, `useXs.ts`, using `useTranslate("<x>")` and Mantine.

## Step 4 — Wire it in

- `seed/index.ts` — add `seedXs(owners)` (mirror `seedCars`, `clearCollection("<x>")`, stamp any
  `GeoPoint`/`Timestamp` from the fixture helpers) and call it in `main()`'s **non-bootstrap** branch.
- `src/modules/routes.tsx` — add `{ path: "<x>", element: <XPage /> }` to the **`AppLayout`
  children** (sibling of the index `CarsPage`). Page lands at `/app/<x>`.
- **Do not** edit the topbar / `appLayout` to add a nav link — that's intentionally left to the user.

## Step 5 — Verify & report

- Run `cd web && npm run build` (tsc -b + vite). Fix type errors; re-run until green.
- Tell the user:
  - the page is at **`/app/<x>`** — **no nav link was added** (wire navigation yourself);
  - `validX` in `firestore.rules` **must stay in sync** with the `X` type or client writes are rejected;
  - run `npm run dev` to reseed and try create/edit/delete (the seed bypasses rules, so exercise the
    UI to validate them).
