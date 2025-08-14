// lib/layout.ts
// import type { DisplayState } from '@/types/editor';

import { DisplayState } from "@/app/types/editor";

/**
 * Fit an image (originalW/H) into a container (boxW/H) preserving aspect ratio.
 * Returns display width/height and scale for rendering.
 */
export const fitToContainer = (
  originalW: number,
  originalH: number,
  boxW: number,
  boxH: number
): DisplayState => {
  if (originalW <= 0 || originalH <= 0 || boxW <= 0 || boxH <= 0) {
    // sensible fallback to avoid NaN
    return { width: 0, height: 0, scale: 0 };
  }
  const scale = Math.min(boxW / originalW, boxH / originalH);
  const width = Math.floor(originalW * scale);
  const height = Math.floor(originalH * scale);
  return { width, height, scale };
};
