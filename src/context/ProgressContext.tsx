import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface ProgressContextValue {
  completedLessons: Set<string>;
  isLoading: boolean;
  markComplete: (lessonId: string) => Promise<void>;
  unmarkComplete: (lessonId: string) => Promise<void>;
  isComplete: (lessonId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { supabase, user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCompletedLessons(new Set());
      return;
    }

    setIsLoading(true);
    supabase
      .from("lesson_progress")
      .select("lesson_id")
      .then(({ data }) => {
        setCompletedLessons(new Set((data ?? []).map((row: { lesson_id: string }) => row.lesson_id)));
        setIsLoading(false);
      });
  }, [user, supabase]);

  async function markComplete(lessonId: string): Promise<void> {
    if (!user) return;
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
    await supabase
      .from("lesson_progress")
      .insert({ user_id: user.id, lesson_id: lessonId });
  }

  async function unmarkComplete(lessonId: string): Promise<void> {
    if (!user) return;
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      next.delete(lessonId);
      return next;
    });
    await supabase
      .from("lesson_progress")
      .delete()
      .match({ user_id: user.id, lesson_id: lessonId });
  }

  function isComplete(lessonId: string): boolean {
    return completedLessons.has(lessonId);
  }

  return (
    <ProgressContext.Provider value={{ completedLessons, isLoading, markComplete, unmarkComplete, isComplete }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return ctx;
}
