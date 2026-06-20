import { createContext } from "react";
import type { User } from "firebase/auth";
import {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
} from "./auth";

export type AuthContextValue = {
  /** The current Firebase user, or null when signed out. */
  user: User | null;
  /** True until the first auth state resolves (avoids login-flash on reload). */
  loading: boolean;
  signInWithEmail: typeof signInWithEmail;
  registerWithEmail: typeof registerWithEmail;
  signInWithGoogle: typeof signInWithGoogle;
  signOut: typeof signOut;
};

// Kept in its own file (not AuthProvider.tsx) so the provider module only
// exports a component — keeps react-refresh / fast-refresh happy.
export const AuthContext = createContext<AuthContextValue | null>(null);
