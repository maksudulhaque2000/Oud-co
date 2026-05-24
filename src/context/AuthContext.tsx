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
import { getFirebaseConfigError, getFirebaseServices } from "@/lib/firebase";
import { ensureUserProfile, isBootstrapAdmin } from "@/lib/users";
import { UserRole } from "@/types/user";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  role: UserRole;
  loading: boolean;
  canManageProducts: boolean;
  canManageUsers: boolean;
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
  const firebaseServices = getFirebaseServices();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(() => Boolean(firebaseServices));

  useEffect(() => {
    if (!firebaseServices) {
      return;
    }

    let active = true;

    const unsubscribe = onAuthStateChanged(firebaseServices.auth, async (nextUser) => {
      if (!active) {
        return;
      }

      setUser(nextUser);

      if (!nextUser) {
        setRole("customer");
        setLoading(false);
        return;
      }

      try {
        const profile = await ensureUserProfile(nextUser);
        if (!active) {
          return;
        }

        setRole(profile.role);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [firebaseServices]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      canManageProducts: role === "admin" || isBootstrapAdmin(user),
      canManageUsers: role === "admin" || isBootstrapAdmin(user),
      async login(email: string, password: string) {
        if (!firebaseServices) {
          throw new Error(getFirebaseConfigError() ?? "Firebase Authentication is not configured.");
        }

        try {
          await signInWithEmailAndPassword(firebaseServices.auth, email, password);
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      async register(input: RegisterInput) {
        if (!firebaseServices) {
          throw new Error(getFirebaseConfigError() ?? "Firebase Authentication is not configured.");
        }

        try {
          const credential = await createUserWithEmailAndPassword(firebaseServices.auth, input.email, input.password);
          if (input.name.trim()) {
            await updateProfile(credential.user, { displayName: input.name.trim() });
          }
          await ensureUserProfile(credential.user);
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      async loginWithGoogle() {
        if (!firebaseServices) {
          throw new Error(getFirebaseConfigError() ?? "Firebase Authentication is not configured.");
        }

        try {
          await signInWithPopup(firebaseServices.auth, firebaseServices.googleProvider);
        } catch (error) {
          throw new Error(getAuthErrorMessage(error));
        }
      },
      async logout() {
        if (!firebaseServices) {
          return;
        }

        await signOut(firebaseServices.auth);
      },
    }),
    [firebaseServices, loading, role, user],
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
