import { FirebaseError } from "firebase/app";

/**
 * Map a Firebase Auth error to a translation key in the `auth` namespace
 * (e.g. "errors.invalidCredentials"). The caller translates it via t().
 */
export function authErrorKey(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "errors.invalidCredentials";
      case "auth/email-already-in-use":
        return "errors.emailInUse";
      case "auth/weak-password":
        return "errors.weakPassword";
      case "auth/popup-closed-by-user":
        return "errors.popupClosed";
    }
  }
  return "errors.generic";
}
