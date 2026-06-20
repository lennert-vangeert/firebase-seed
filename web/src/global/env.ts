/**
 * App environment switch, set via `VITE_APP_ENV` in web/.env:
 *   dev -> use the Firebase emulators + dev conveniences (prefilled login)
 *   prd -> use the real VITE_FIREBASE_* project
 *
 * Defaults to "prd" when unset (safe for production builds).
 * `scripts/dev.sh` sets `VITE_APP_ENV=dev` automatically.
 */
export type AppEnv = "dev" | "prd";

export const APP_ENV: AppEnv =
  import.meta.env.VITE_APP_ENV === "dev" ? "dev" : "prd";

export const IS_DEV = APP_ENV === "dev";
