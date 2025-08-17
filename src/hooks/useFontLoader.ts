// src/hooks/useFontLoader.ts
"use client";

import { useEffect, useMemo, useState } from "react";

export type FontLoadStatus = "idle" | "loading" | "active" | "inactive";

/** Encode a family for CSS2 (spaces -> +, rest URL-encoded). */
function encodeFamily(family: string): string {
  // encodeURIComponent then turn spaces into '+'
  return encodeURIComponent(family.trim()).replace(/%20/g, "+");
}

/** Build a css2 href like:
 * https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap
 */
function buildCss2Href(family: string, weights: number[]): string {
  const uniq = Array.from(new Set(weights)).filter((w) => Number.isFinite(w));
  uniq.sort((a, b) => a - b);

  const famToken = encodeFamily(family);
  const wght = uniq.length ? `:wght@${uniq.join(";")}` : "";
  return `https://fonts.googleapis.com/css2?family=${famToken}${wght}&display=swap`;
}

export function useFontLoader(
  family?: string,
  weights: number[] = []
): FontLoadStatus {
  const [status, setStatus] = useState<FontLoadStatus>("idle");

  const href = useMemo(() => {
    if (!family) return "";
    return buildCss2Href(family, weights);
  }, [family, weights]);

  useEffect(() => {
    if (!family) {
      setStatus("idle");
      return;
    }
    if (typeof document === "undefined" || !("fonts" in document)) {
      // very old browser: just assume active after link insert
      setStatus("active");
      return;
    }

    setStatus("loading");

    const attr = "data-gf-href";
    let link = document.head.querySelector<HTMLLinkElement>(
      `link[rel="stylesheet"][${attr}="${href}"]`
    );

    // inject <link> once per unique href
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.setAttribute(attr, href);
      document.head.appendChild(link);
    }

    let cancelled = false;
    const weight = (weights[0] ?? 400) | 0;
    // CSS Font Loading API: "font" shorthand → "<weight> 1em <family>"
    const fontShorthand = `${weight} 1em "${family}"`;

    // Failsafe timeout in case the network is super slow
    const timeout = window.setTimeout(() => {
      if (!cancelled) setStatus("inactive");
    }, 4000);

    // Trigger a load & then wait for readiness
    // (document.fonts.load returns a Promise<FontFace[]>)
    // We ignore the result array; ready resolves when all pending loads settle.
    void (document as any).fonts.load(fontShorthand);
    (document as any).fonts.ready
      .then(() => {
        if (cancelled) return;
        // If the face is available, check() returns true
        const ok = (document as any).fonts.check(fontShorthand);
        setStatus(ok ? "active" : "inactive");
        window.clearTimeout(timeout);
      })
      .catch(() => {
        if (!cancelled) setStatus("inactive");
        window.clearTimeout(timeout);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [family, href, weights]);

  return status;
}
