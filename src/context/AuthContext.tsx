"use client";

import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getAuthErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code?: string }).code || "");

    switch (code) {
      case "auth/unauthorized-domain":
        return "This domain is not authorized for Firebase Authentication. Add your Vercel domain to Firebase Console > Authentication > Settings > Authorized domains.";
      case "auth/popup-blocked":
        return "The Google sign-in popup was blocked by the browser. Allow popups and try again.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was canceled before completion.";
      case "auth/invalid-credential":
        return "The email/password or Google credential is invalid.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-login-credentials":
        return "Invalid email or password.";
      case "auth/email-already-in-use":
        return "This email is already registered. Try logging in instead.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/operation-not-allowed":
        return "This sign-in method is disabled in Firebase Authentication settings.";
      default:
        break;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email: string, password: string) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      async register(input: RegisterInput) {
        try {
          const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
          if (input.name.trim()) {
            await updateProfile(credential.user, { displayName: input.name.trim() });
          }
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      async loginWithGoogle() {
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      async logout() {
        await signOut(auth);
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
