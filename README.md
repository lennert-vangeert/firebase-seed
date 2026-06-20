# Firebase Seed

A clean, modular starter for building apps on **Firebase** (Auth + Firestore) with a
**React 19 + Vite + Mantine** frontend. Clone it, rename the example `cars` collection to
your own domain, and go.

## Stack

- **Frontend**: React 19, Vite, Mantine, React Router, i18next (in `web/`)
- **Backend**: Firebase Auth (email/password + Google) + Cloud Firestore
- **Dev**: Firebase Emulator Suite (Auth + Firestore), seeded fresh on every run
- **Hosting**: Vercel (frontend) — Firebase is used only for Auth + Firestore

## Project structure

```
firebase-seed/
└── web/
    ├── firebase.json            # emulator config
    ├── firestore.rules          # security rules (public-read / owner-write)
    ├── firestore.indexes.json   # composite indexes
    ├── scripts/dev.sh           # boot emulators → seed → vite (fresh each run)
    ├── seed/                    # admin-SDK seeding (TypeScript, emulator-only)
    │   ├── index.ts             # orchestrator (--bootstrap = admin only)
    │   ├── auth.ts              # test users
    │   └── fixtures/cars.ts     # car fixtures (share types with src/data)
    └── src/
        ├── data/                # 1 file per collection — types + converters only
        ├── services/            # CRUD per collection
        ├── global/firebase/     # config, auth, AuthProvider, useAuth
        └── modules/             # routes, auth UI, cars demo page
```

The two layers to know:

- **`src/data/<collection>.ts`** — the model: the document type, a Firestore converter, and
  a typed collection reference. One file = one collection.
- **`src/services/<collection>.ts`** — the operations: `subscribe`/`create`/`update`/`delete`.

**Adding a collection (table) or fields?** See
[`web/docs/adding-a-collection.md`](web/docs/adding-a-collection.md), or run the **`/new-collection`**
skill to scaffold one end-to-end.

## Getting started

### Prerequisites

- Node.js >= 20
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm i -g firebase-tools`, or use the
  bundled dev dependency via the npm scripts)

### Install & run (emulators)

```sh
cd web
npm install
npm run dev        # boots Auth + Firestore emulators, seeds them, starts Vite on :4000
```

`npm run dev` runs `scripts/dev.sh`, which starts the emulators, seeds fresh test data, and
launches Vite pointed at the emulators. Emulator data is wiped and re-seeded on every run.

Test login (created by the seed):

- **admin@seed.dev** / `password` (admin)
- plus a few extra test users — see `web/seed/auth.ts`

### Useful scripts (`web/`)

| Script | What it does |
|---|---|
| `npm run dev` | Emulators + fresh seed + Vite |
| `npm run vite` | Vite only (expects emulators already running) |
| `npm run emulators` | Start the emulators only |
| `npm run seed` | Seed full fixtures into a running emulator |
| `npm run seed:bootstrap` | Seed only the admin user (no test data) |
| `npm run build` | Type-check + production build |
| `npm run validate:types` | `tsc --noEmit` |

## Environment variables (`web/.env`)

Copy `web/.env.example` to `web/.env`. `VITE_APP_ENV` decides the environment — `dev` uses the
emulators (and prefills the login), `prd` uses the real Firebase project below. `scripts/dev.sh`
sets `VITE_APP_ENV=dev` automatically, so the `VITE_FIREBASE_*` values are only needed for
production:

```
VITE_APP_ENV=prd
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## The `cars` example

`cars` is the one example collection and doubles as a Firestore field-type cheat sheet — it
exercises strings, numbers, booleans, enums, arrays, nested maps, geopoints, timestamps,
nullable fields, and a uid reference. Rename/replace it per project: edit `src/data/cars.ts`,
`src/services/cars.ts`, `seed/fixtures/cars.ts`, the `cars` block in `firestore.rules`, and
the `modules/cars` UI.

## License

Licensed by me, Lennert :D
