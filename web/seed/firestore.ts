import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Safety + convenience: always point the Admin SDK at the local emulators.
// `firebase emulators:exec` sets these already; we default them so that a bare
// `npm run seed` against a running emulator also works (and never touches prod).
process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";

const projectId =
  process.env.GCLOUD_PROJECT ??
  process.env.FIREBASE_PROJECT ??
  "demo-firebase-seed";

export const app = initializeApp({ projectId });
export const db = getFirestore(app);
export const auth = getAuth(app);
