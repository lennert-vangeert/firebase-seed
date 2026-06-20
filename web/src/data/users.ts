import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@global/firebase/config";
import { converter } from "./_shared";

/** A user's public profile, mirrored from Firebase Auth into `users/{uid}`. */
export type UserProfile = {
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const userConverter = converter<UserProfile>();

export const usersCol = (): CollectionReference<UserProfile> =>
  collection(db, "users").withConverter(userConverter);

export const userDoc = (uid: string): DocumentReference<UserProfile> =>
  doc(db, "users", uid).withConverter(userConverter);
