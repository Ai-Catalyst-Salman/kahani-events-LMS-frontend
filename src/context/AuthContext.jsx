// src/context/AuthContext.jsx
// ---------------------------
// Provides auth state to the entire app via React Context.
// Exposes: { user, role, loading, signIn, signOut }
//
// - user:    Supabase user object (null when logged out)
// - role:    'admin' | 'learner' | null — fetched from backend /me
// - loading: true while restoring session on app load
// - signIn:  async (email, password) => { error } | null
// - signOut: async () => void

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's role from the backend (single source of truth).
  async function fetchRole() {
    const { ok, data } = await api.get("/me");
    if (ok && data?.role) {
      setRole(data.role);
    } else {
      setRole(null);
    }
  }

  // On mount: restore session from Supabase's localStorage persistence.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Subscribe to auth state changes (e.g., token refresh, sign-out).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole();
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };

    // Re-fetch role after sign in.
    await fetchRole();
    return null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
