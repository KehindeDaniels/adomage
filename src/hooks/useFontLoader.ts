'use client';

import { useEffect, useMemo, useState } from 'react';
import WebFont from 'webfontloader';

export type FontLoadStatus = 'idle' | 'loading' | 'active' | 'inactive';

/**
 * Load a Google Font family (with variants) so Konva can render it.
 * Hook call is unconditional; inside we only load when a family exists.
 */
export function useFontLoader(
  family?: string,
  weights: Array<number | 'regular' | 'italic' | 'bold'> = []
): FontLoadStatus {
  const [status, setStatus] = useState<FontLoadStatus>('idle');

  // Build the "families" array WebFont expects, e.g. ["Inter:400,700"]
  const families = useMemo(() => {
    if (!family) return [] as string[];
    const variants = (weights.length ? weights : ['regular']).map(v =>
      typeof v === 'number' ? String(v) : v
    );
    return [`${family}:${variants.join(',')}`];
  }, [family, weights]);

  useEffect(() => {
    if (!family) {
      setStatus('idle');
      return;
    }
    setStatus('loading');
    WebFont.load({
      google: { families },
      active: () => setStatus('active'),
      inactive: () => setStatus('inactive'),
    });
  }, [family, families]);

  return status;
}
