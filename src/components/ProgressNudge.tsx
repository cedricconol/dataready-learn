import React, { useEffect, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useAuth } from "@site/src/context/AuthContext";

const SESSION_KEY = "progress-nudge-shown";

function ProgressNudgeInner(): JSX.Element | null {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (user) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, user]);

  if (!visible) return null;

  return (
    <div className="progress-nudge__backdrop" onClick={() => setVisible(false)}>
      <div className="progress-nudge__modal" onClick={(e) => e.stopPropagation()}>
        <div className="progress-nudge__icon" aria-hidden="true">🎯</div>
        <div className="progress-nudge__heading">Track your progress</div>
        <div className="progress-nudge__body">
          Create a free account to save which lessons you've completed. Your progress syncs across devices.
        </div>
        <div className="progress-nudge__actions">
          <button
            className="progress-nudge__cta"
            onClick={() => { setVisible(false); signInWithGoogle(); }}
            type="button"
          >
            Create account
          </button>
          <button
            className="progress-nudge__dismiss"
            onClick={() => setVisible(false)}
            type="button"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProgressNudge(): JSX.Element {
  return (
    <BrowserOnly fallback={null}>
      {() => <ProgressNudgeInner />}
    </BrowserOnly>
  );
}
