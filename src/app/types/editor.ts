// types/editor.ts

/**
 * Core metadata for the uploaded background image.
 * - src: data URL for now (persists across refresh)
 * - originalW/H: natural pixel size of the PNG (used for export later)
 */
export type ProjectImage = {
  src: string;
  originalW: number;
  originalH: number;
  name?: string;
  lastModified?: number;
};

/**
 * How large the canvas should render on screen.
 * This is display-only (export will use originalW/H).
 */
export type DisplayState = {
  width: number;
  height: number;
  scale: number; // width / originalW (or height / originalH)
};

/**
 * Top-level slices in the editor store (only what we need today).
 */
export type EditorProjectSlice = {
  projectId: string;
  image?: ProjectImage;
};

export type EditorViewSlice = {
  display: DisplayState;
};

export type EditorActions = {
  setImageFromFile: (file: File) => Promise<void>;
  clearImage: () => void;
  setDisplayByContainer: (containerW: number, containerH: number) => void;
};

/**
 * Full editor store shape.
 */
export type EditorState = {
  project: EditorProjectSlice;
  view: EditorViewSlice;
  actions: EditorActions;
};
