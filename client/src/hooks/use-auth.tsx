import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/client";
import { getUserProfile, updateUserProfile } from "@/utils/firestore";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await getUserProfile(res.user.uid);
    if (!profile) {
      await updateUserProfile({
        id: res.user.uid,
        name: res.user.displayName || email.split('@')[0],
        email: email
      });
    }
  };

  const signup = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await updateUserProfile({
      id: res.user.uid,
      name,
      email
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const userProfile = await getUserProfile(res.user.uid);
    if (!userProfile) {
      await updateUserProfile({
        id: res.user.uid,
        name: res.user.displayName || "Elegant User",
        email: res.user.email || ""
      });
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
