import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "wouter";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!auth) {
        setAuthorized(false);
        setLoading(false);
        return;
    }
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
            const adminDoc = await getDoc(doc(db, "admins", user.uid));
            if (adminDoc.exists()) {
              setAuthorized(true);
            } else {
              setAuthorized(false);
              alert("Access Denied: Not an admin.");
              auth.signOut();
            }
        } catch (e) {
            console.error("Error verifying admin:", e);
            setAuthorized(false);
        }
      } else {
        setAuthorized(false);
        setLocation("/admin/login");
      }
      setLoading(false);
    });
  }, [setLocation]);

  if (loading) return <div className="p-10 text-center">Loading Admin...</div>;
  
  if (!auth) {
    return (
        <div className="p-10 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-2">Firebase Not Configured</h1>
            <p>Please update your <code>.env.local</code> file with real Firebase credentials.</p>
        </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
}
