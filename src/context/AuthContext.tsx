import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import type { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthContextValue {
  supabase: SupabaseClient;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabaseUrl = siteConfig.customFields!.supabaseUrl as string;
  const supabaseAnonKey = siteConfig.customFields!.supabaseAnonKey as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase config. Add SUPABASE_URL and SUPABASE_ANON_KEY to .env.local and restart the dev server.",
    );
  }

  const supabase = useMemo(
    () => createClient(supabaseUrl, supabaseAnonKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signInWithGoogle(): Promise<void> {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth-redirect", window.location.pathname);
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth-callback`,
      },
    });
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ supabase, user, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
