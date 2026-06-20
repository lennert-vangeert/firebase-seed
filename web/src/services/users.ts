import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { userDoc, type UserProfile } from "@data/users";

/** The fields callers provide; server stamps createdAt/updatedAt. */
export type ProfileInput = Pick<
  UserProfile,
  "displayName" | "email" | "photoURL"
>;

export const getProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(userDoc(uid));
  return snap.exists() ? snap.data() : null;
};

/**
 * Create or update a user's profile doc. `createdAt` is set only on first write;
 * `updatedAt` is refreshed every time.
 */
export const upsertProfile = async (
  uid: string,
  data: ProfileInput
): Promise<void> => {
  const ref = userDoc(uid);
  const exists = (await getDoc(ref)).exists();
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
      ...(exists ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
};
