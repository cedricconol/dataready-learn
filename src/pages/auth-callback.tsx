import React, { useEffect, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useHistory } from "@docusaurus/router";
import Layout from "@theme/Layout";
import { useAuth } from "@site/src/context/AuthContext";

function AuthCallbackContent(): JSX.Element {
  const { user, isLoading } = useAuth();
  const history = useHistory();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    if (isLoading) return;

    redirected.current = true;
    const to = sessionStorage.getItem("auth-redirect") || "/";
    sessionStorage.removeItem("auth-redirect");
    history.replace(to);
  }, [user, isLoading, history]);

  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#94a3b8" }}>
      Signing you in&hellip;
    </div>
  );
}

export default function AuthCallbackPage(): JSX.Element {
  return (
    <Layout title="Signing in">
      <BrowserOnly fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading…</div>}>
        {() => <AuthCallbackContent />}
      </BrowserOnly>
    </Layout>
  );
}
