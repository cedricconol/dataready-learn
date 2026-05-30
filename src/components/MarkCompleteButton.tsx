import React, { useEffect, useRef } from "react";
import { useAuth } from "@site/src/context/AuthContext";
import { useProgress } from "@site/src/context/ProgressContext";

interface Props {
  lessonId: string;
}

export default function LessonCompletion({ lessonId }: Props): JSX.Element {
  const { user } = useAuth();
  const { isComplete, markComplete, unmarkComplete } = useProgress();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const done = isComplete(lessonId);

  useEffect(() => {
    if (!user || done) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          markComplete(lessonId);
          observer.disconnect();
        }
      },
      { threshold: 1.0 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [user, lessonId, done, markComplete]);

  return (
    <div className="lesson-completion">
      <div ref={sentinelRef} className="lesson-completion__sentinel" />
      {user && done && (
        <div className="lesson-completion__badge">
          <span className="lesson-completion__check" aria-hidden="true">✓</span>
          Lesson complete
          <button
            className="lesson-completion__undo"
            onClick={() => unmarkComplete(lessonId)}
            type="button"
            title="Mark as incomplete"
          >
            undo
          </button>
        </div>
      )}
    </div>
  );
}
