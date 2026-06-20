import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { upsertProfile } from "@services/users";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

/**
 * Single source of truth for mirroring the Auth user into `users/{uid}`.
 * Called after every sign-in/registration so the profile doc stays in sync.
 */
export const syncUserProfile = async (user: User): Promise<void> => {
  await upsertProfile(user.uid, {
    displayName: user.displayName ?? user.email?.split("@")[0] ?? "Anonymous",
    email: user.email ?? "",
    photoURL: user.photoURL ?? null,
  });
};

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(user, { displayName });
  await syncUserProfile(user);
  // Optional verification gate — harmless against the emulator.
  await sendEmailVerification(user).catch(() => {});
  return user;
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await syncUserProfile(user);
  return user;
};

export const signInWithGoogle = async (): Promise<User> => {
  const { user } = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(user);
  return user;
};

export const signOut = (): Promise<void> => fbSignOut(auth);
