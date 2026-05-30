import React, { useEffect, useRef, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useAuth } from "@site/src/context/AuthContext";

function UserButtonInner(): JSX.Element {
  const { user, isLoading, signInWithGoogle, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (isLoading) {
    return <div className="user-button__avatar user-button__avatar--loading" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <button className="user-button__signin" onClick={signInWithGoogle} type="button">
        Sign in
      </button>
    );
  }

  const initial = (user.email ?? "U")[0].toUpperCase();

  return (
    <div className="user-button__wrapper" ref={wrapperRef}>
      <button
        className="user-button__avatar"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
        title={user.email}
      >
        {initial}
      </button>
      {open && (
        <div className="user-button__dropdown">
          <span className="user-button__email">{user.email}</span>
          <button
            className="user-button__signout"
            onClick={() => { signOut(); setOpen(false); }}
            type="button"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function UserButton(): JSX.Element {
  return (
    <BrowserOnly fallback={<div style={{ width: "2rem" }} />}>
      {() => <UserButtonInner />}
    </BrowserOnly>
  );
}
