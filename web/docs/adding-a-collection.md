# Adding a collection (table)

In Firestore a "table" is a **collection**. This app has one example collection — `cars` — wired
end-to-end. To add your own (or add fields to an existing one), copy that pattern. This guide is
the canonical reference; the `/new-collection` skill automates it.

> Tip: the fastest way to add a collection is to run the **`/new-collection`** skill. This guide
> explains what it does and is the manual fallback.

---

## The two layers

| Folder | Owns | Example |
|---|---|---|
| `src/data/<x>.ts` | the **model**: document type, converter, typed collection ref | `src/data/cars.ts` |
| `src/services/<x>.ts` | the **operations**: `subscribe` / `create` / `update` / `delete` | `src/services/cars.ts` |

### Portable vs SDK-stamped fields

A document type is split in two so the **seed** (which runs under the Admin SDK in Node) can reuse
the model without importing the browser Firestore SDK:

```ts
// src/data/cars.ts
export type CarData = {           // portable — plain TS, no SDK types
  make: string;
  /* …scalars, arrays, maps, enums, the ownerId string… */
};

export type Car = CarData & {      // full doc — adds SDK-only types
  location: GeoPoint;
  soldAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

The seed does `import type { CarData }` (a **type-only** import, erased at runtime) and stamps the
`GeoPoint`/`Timestamp` fields itself with the Admin SDK. So: **plain scalar/array/map/enum fields
go in `XData`; anything typed `GeoPoint` or `Timestamp` goes in `X`.**

---

## Field-type cheat sheet

Every common Firestore type and where it shows up. The `cars` model demonstrates all of them.

| TS type | Firestore | `data/` placement | rules check (in `validX`) | form input | fixture value |
|---|---|---|---|---|---|
| `string` | string | `XData` | `d.f is string` | `TextInput` | `"…"` |
| `number` | number | `XData` | `d.f is number` | `NumberInput` | `42` |
| `boolean` | boolean | `XData` | `d.f is bool` | `Switch` | `true` |
| `'a' \| 'b'` (enum) | string | `XData` | `d.f in ['a','b']` | `Select` | `'a'` |
| `string[]` | array | `XData` | `d.f is list` | `TagsInput` | `["…"]` |
| `{ … }` (nested) | map | `XData` | `d.f is map` | grouped inputs | `{ … }` |
| `GeoPoint` | geopoint | `X` | `d.f is latlng` | two `NumberInput` (lat/lng) | `lat`/`lng` helper → `new GeoPoint()` |
| `Timestamp \| null` | timestamp | `X` | `d.f == null \|\| d.f is timestamp` | `TextInput type="date"` | `*DaysAgo` helper → `Timestamp.fromMillis()` |
| `Timestamp` (created/updated) | timestamp | `X` (server-set) | `d.f is timestamp` | — | `serverTimestamp()` (app) / `Timestamp.fromMillis()` (seed) |
| `string` (uid ref) | string | `XData` | `d.f is string` | — (set from auth) | round-robin owner uid |

---

## Add a new collection

Running example: a **`bikes`** collection (singular `bike`). Replace `bike`/`Bike`/`bikes`/`BIKE`
with your names. Collection id = plural, lowercase.

### 1. Model — `src/data/bikes.ts`

Mirror `src/data/cars.ts`. Use the generic `converter` from `@data/_shared` (no per-collection
boilerplate).

```ts
import { collection, Timestamp, type CollectionReference } from "firebase/firestore";
import { db } from "@global/firebase/config";
import { converter } from "./_shared";

export type BikeData = {
  name: string;
  brand: string;
  gears: number;
  isElectric: boolean;
  ownerId: string; // uid reference -> users/{uid}
};

export type Bike = BikeData & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const bikeConverter = converter<Bike>();

export const bikesCol = (): CollectionReference<Bike> =>
  collection(db, "bikes").withConverter(bikeConverter);
```

### 2. Service — `src/services/bikes.ts`

Mirror `src/services/cars.ts`.

```ts
import {
  addDoc, deleteDoc, doc, onSnapshot, orderBy, query,
  serverTimestamp, updateDoc, type Unsubscribe,
} from "firebase/firestore";
import { bikesCol, type Bike } from "@data/bikes";

export type BikeWithId = Bike & { id: string };
export type BikeInput = Omit<Bike, "ownerId" | "createdAt" | "updatedAt">;

export const subscribeBikes = (cb: (bikes: BikeWithId[]) => void): Unsubscribe => {
  const q = query(bikesCol(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

export const createBike = async (ownerId: string, input: BikeInput): Promise<string> => {
  const ref = await addDoc(bikesCol(), {
    ...input, ownerId, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateBike = async (id: string, input: Partial<BikeInput>): Promise<void> => {
  await updateDoc(doc(bikesCol(), id), { ...input, updatedAt: serverTimestamp() });
};

export const deleteBike = async (id: string): Promise<void> => {
  await deleteDoc(doc(bikesCol(), id));
};
```

### 3. Security rules — `web/firestore.rules`

Add a `validBike(d)` function that **mirrors the `Bike` type exactly** (see cheat sheet), and a
`match` block. Use the helpers already in the file (`isSignedIn`, `isOwner`). This example uses the
default **public-read / owner-write** pattern (see [Ownership patterns](#ownership-patterns) for the
others):

```
function validBike(d) {
  return d.name is string && d.name.size() >= 1 && d.name.size() <= 100
         && d.brand is string
         && d.gears is number
         && d.isElectric is bool
         && d.ownerId is string
         && d.createdAt is timestamp
         && d.updatedAt is timestamp;
}

match /bikes/{bikeId} {
  allow read: if isSignedIn();
  allow create: if isSignedIn()
                && request.resource.data.ownerId == request.auth.uid
                && validBike(request.resource.data);
  allow update: if isOwner(resource.data.ownerId)
                && request.resource.data.ownerId == resource.data.ownerId
                && validBike(request.resource.data);
  allow delete: if isOwner(resource.data.ownerId);
}
```

> Composite index? Only if you query with `where(...) + orderBy(...)` on different fields. A plain
> `orderBy("createdAt")` needs none. If Firestore asks for one, add it to `firestore.indexes.json`.

### 4. Seed fixtures — `web/seed/fixtures/bikes.ts`

Mirror `web/seed/fixtures/cars.ts`. Type the fixtures against the **portable** part via
`import type`; omit `ownerId` (the seed assigns owners round-robin). Carry SDK-field source data as
plain helpers (e.g. `soldDaysAgo` for a timestamp, `lat`/`lng` for a geopoint).

```ts
import type { BikeData } from "../../src/data/bikes";

export type BikeFixture = Omit<BikeData, "ownerId">;

export const BIKE_FIXTURES: BikeFixture[] = [
  { name: "City Cruiser", brand: "Cannondale", gears: 7, isElectric: false },
  { name: "Trail Blazer", brand: "Trek", gears: 21, isElectric: false },
  { name: "Volt-E", brand: "VanMoof", gears: 1, isElectric: true },
];
```

### 5. Seed wiring — `web/seed/index.ts`

Add a `seedBikes(owners)` (mirror `seedCars`) and call it in `main()`'s non-bootstrap branch.

```ts
import { BIKE_FIXTURES } from "./fixtures/bikes";

const seedBikes = async (owners: SeedUser[]): Promise<number> => {
  await clearCollection("bikes");
  const now = Date.now();
  for (let i = 0; i < BIKE_FIXTURES.length; i++) {
    const owner = owners[i % owners.length];
    await db.collection("bikes").add({
      ...BIKE_FIXTURES[i],
      ownerId: owner.uid,
      // stamp SDK fields here, e.g. location: new GeoPoint(lat, lng),
      createdAt: Timestamp.fromMillis(now - i * DAY_MS),
      updatedAt: Timestamp.fromMillis(now - i * DAY_MS),
    });
  }
  return BIKE_FIXTURES.length;
};

// in main(), after seedCars:
const bikeCount = await seedBikes(users);
console.log(`✓ Seeded ${bikeCount} bikes.`);
```

### 6. Translations — `src/global/localization/en-US/bikes.json` + `nl-BE/bikes.json`

Each JSON file is a **namespace** (filename = namespace), auto-discovered by `index.tsx`'s
`import.meta.glob` — **no index edits needed**. Mirror `en-US/cars.json`. Keep both locales in sync.

```json
{
  "title": "Bikes",
  "addBike": "Add bike",
  "empty": "No bikes yet — add your first one.",
  "notifications": { "created": "Bike created", "updated": "Bike updated", "deleted": "Bike deleted", "error": "Something went wrong." },
  "actions": { "edit": "Edit bike", "delete": "Delete bike" },
  "modal": { "add": "Add bike", "edit": "Edit bike" },
  "form": { "name": "Name", "brand": "Brand", "gears": "Gears", "electric": "Electric", "cancel": "Cancel", "save": "Save", "create": "Create", "required": "Required" }
}
```

### 7. UI — `src/modules/bikes/`

Mirror `src/modules/cars/`: `BikesPage.tsx`, `BikeForm.tsx`, `useBikes.ts`. Scope translations with
`useTranslate("bikes")`. Use Mantine components (see [the Mantine note](#use-mantine-components)).

- `useBikes.ts` → subscribes via `subscribeBikes`, returns `{ bikes, loading }`.
- `BikesPage.tsx` → `Container` + title + "Add" `Button` + `SimpleGrid` of `Card`s + a `Modal`
  wrapping `BikeForm` (keyed by editing id). Owner-only `ActionIcon`s for edit/delete.
- `BikeForm.tsx` → `@mantine/form` `useForm`, one input per editable field (cheat sheet), assembles
  `GeoPoint`/`Timestamp` on submit if present.

### 8. Route — `src/modules/routes.tsx`

Add a sibling route under `AppLayout` (the protected shell). The page lands at `/app/bikes`:

```tsx
import BikesPage from "./bikes/BikesPage";

// AppLayout children:
children: [
  { index: true, element: <CarsPage /> },
  { path: "bikes", element: <BikesPage /> }, // -> /app/bikes
],
```

> **No nav link is added.** The page is reachable at `/app/bikes`; add a link in
> `src/modules/sections/appLayout/index.tsx` (or build a real nav) when you want users to find it.

Nothing else to touch — `@data`/`@services` aliases and the `IS_DEV` env switch are already wired.

---

## Ownership patterns

Pick one when you create the collection. Only the **rules block** and a couple of
**service/query** lines differ.

### A. Public read / owner write (the `cars` default)
Anyone signed in reads; only the owner writes/deletes their doc.
- Rules: `allow read: if isSignedIn();` + owner-only create/update/delete (as in step 3).
- Service: `BikeInput = Omit<Bike, "ownerId" | "createdAt" | "updatedAt">`, `createBike(ownerId, input)`.
- Query: `subscribeBikes` lists everything.

### B. Owner-private
Each user only sees and edits their own docs.
- Rules:
  ```
  match /bikes/{bikeId} {
    allow read: if isOwner(resource.data.ownerId);
    allow create: if isSignedIn() && request.resource.data.ownerId == request.auth.uid && validBike(request.resource.data);
    allow update: if isOwner(resource.data.ownerId) && validBike(request.resource.data);
    allow delete: if isOwner(resource.data.ownerId);
  }
  ```
- Query: filter by uid — `subscribeBikes(uid, cb)` with
  `query(bikesCol(), where("ownerId", "==", uid), orderBy("createdAt", "desc"))`
  (a `where + orderBy` on different fields needs a composite index — add it to
  `firestore.indexes.json` when Firestore asks).

### C. Shared / global (no owner)
Any signed-in user reads and writes; drop `ownerId` entirely.
- Model: remove `ownerId` from `BikeData`.
- Rules: `allow read, create, update, delete: if isSignedIn() && validBike(request.resource.data);`
  (skip `validBike` on delete).
- Service: `createBike(input)` (no `ownerId`); fixtures keep `ownerId` out.

---

## Add fields to an existing collection

Smaller flow — touch these five spots for one field (say `color: string` on `bikes`):

1. **Type** — `src/data/bikes.ts`: add to `BikeData` (portable) or to `Bike` (if `GeoPoint`/`Timestamp`).
2. **Rules** — `firestore.rules`: add the check to `validBike` (e.g. `&& d.color is string`).
   **This is the #1 gotcha — if `validBike` doesn't match the type, client writes get rejected.**
3. **Fixtures** — `seed/fixtures/bikes.ts`: add `color` to each fixture (and stamp it in
   `seed/index.ts` if it's an SDK-stamped field).
4. **Input** — `services/bikes.ts`: `BikeInput` auto-includes the new field (it's `Omit<Bike, …>`),
   unless it's server-managed — then add it to the `Omit`.
5. **UI + i18n** — add the form input + card display in `src/modules/bikes/`, and the label keys to
   **both** `en-US/bikes.json` and `nl-BE/bikes.json`.

---

## Verify

```sh
cd web
npm run build          # tsc -b + vite — typechecks the model/service/UI
npm run dev            # emulators + reseed + Vite on :4000
```

Then in the browser:
- Sign in (in dev the admin login is **prefilled**), go to `/app/bikes`.
- Create / edit / delete a bike; confirm the list updates live.
- Confirm another seeded user can't edit your doc (owner-write rules).
- The emulator UI on **:4001** shows the `bikes` documents.

The seed runs under the Admin SDK and **bypasses rules**, so a successful seed doesn't prove your
rules — exercise create/edit from the UI to validate `validBike`.

<a id="use-mantine-components"></a>
> **Use Mantine components.** Build UI with Mantine primitives (`Container`, `Card`, `SimpleGrid`,
> `Group`, `Stack`, `Button variant="gradient"`, `Modal`, `Badge`, `ActionIcon`, form inputs)
> rather than raw `div`s + CSS — matches the rest of the app and stays themeable.
