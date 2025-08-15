export type ProjectImage = {
  src: string;
  originalW: number;
  originalH: number;
  name?: string;
  lastModified?: number;
};

export type DisplayState = {
  width: number;
  height: number;
  scale: number; 
};


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


export type EditorState = {
  project: EditorProjectSlice;
  view: EditorViewSlice;
  actions: EditorActions;
};
