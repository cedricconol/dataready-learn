import React from "react";
import Logo from "@theme-original/Logo";
import type LogoType from "@theme/Logo";
import type { WrapperProps } from "@docusaurus/types";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useThemeConfig } from "@docusaurus/theme-common";

type Props = WrapperProps<typeof LogoType>;

/**
 * The homepage is a self-contained light/warm page, but the global theme stays
 * dark, so the default Logo renders the light-text (`srcDark`) variant, which
 * is invisible on the light navbar. On the homepage only, force the
 * light-background (dark-text) logo. Every other route uses the default Logo.
 */
export default function LogoWrapper(props: Props): JSX.Element {
  const { pathname } = useLocation();
  const { navbar } = useThemeConfig();
  const logo = navbar.logo;
  const lightSrc = useBaseUrl(logo?.src ?? "");
  const logoLink = useBaseUrl(logo?.href || "/");

  if (pathname === "/" && logo) {
    const { imageClassName, titleClassName, ...rest } = props;
    return (
      <Link
        to={logoLink}
        {...rest}
        {...(logo.target && { target: logo.target })}
      >
        <div className={imageClassName}>
          <img
            src={lightSrc}
            alt={logo.alt ?? "DataReady"}
            className={logo.className}
          />
        </div>
      </Link>
    );
  }

  return <Logo {...props} />;
}
