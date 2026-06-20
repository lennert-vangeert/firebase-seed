import { Timestamp } from "firebase-admin/firestore";
import { auth, db } from "./firestore";

export type SeedUser = {
  uid: string;
  email: string;
  displayName: string;
  isAdmin?: boolean;
};

/** The one user the bootstrap path always creates. */
export const ADMIN_USER: SeedUser = {
  uid: "admin",
  email: "admin@seed.dev",
  displayName: "Admin",
  isAdmin: true,
};

/** Extra throwaway users, only created by the full fixtures path. */
export const TEST_USERS: SeedUser[] = [
  { uid: "user-ada", email: "ada@seed.dev", displayName: "Ada Lovelace" },
  { uid: "user-grace", email: "grace@seed.dev", displayName: "Grace Hopper" },
  { uid: "user-alan", email: "alan@seed.dev", displayName: "Alan Turing" },
];

export const SEED_PASSWORD = "password";

const upsertAuthUser = async (u: SeedUser): Promise<void> => {
  // Delete-then-create keeps re-seeds idempotent against a warm emulator.
  await auth.deleteUser(u.uid).catch(() => {});
  await auth.createUser({
    uid: u.uid,
    email: u.email,
    emailVerified: true,
    password: SEED_PASSWORD,
    displayName: u.displayName,
  });
  // Mirror into users/{uid} — the same doc the client writes on sign-in.
  await db.collection("users").doc(u.uid).set({
    displayName: u.displayName,
    email: u.email,
    photoURL: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

/** Bootstrap: just the admin user (safe to run in any environment). */
export const seedAdmin = async (): Promise<SeedUser> => {
  await upsertAuthUser(ADMIN_USER);
  return ADMIN_USER;
};

/** Full set: admin + all test users. Returns everyone created. */
export const seedUsers = async (): Promise<SeedUser[]> => {
  const all = [ADMIN_USER, ...TEST_USERS];
  for (const u of all) {
    await upsertAuthUser(u);
  }
  return all;
};
