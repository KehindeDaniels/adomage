'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fitToContainer } from '@/lib/layout';
import { decodePngFile } from '@/lib/image';
import { EditorState } from '@/app/types/editor';
// import type { EditorState } from '@/types/editor';

// Small util so new projects reset history/attachments later
const newProjectId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `proj_${Math.random().toString(36).slice(2)}`;

/**
 * Zustand store for just the two implemented components (Upload + Canvas).
 * - project.image holds the uploaded PNG (dataURL + original size)
 * - view.display is how big we render on screen (fit-to-container)
 * - actions mutate the above
 */
export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      project: {
        projectId: newProjectId(),
        image: undefined,
      },
      view: {
        display: { width: 0, height: 0, scale: 0 },
      },
      actions: {
        /**
         * Load a PNG file, decode to dataURL, read natural size,
         * and set as the current project image.
         */
async setImageFromFile(file) {
  const img = await decodePngFile(file);

  set(() => ({
    project: {
      projectId: newProjectId(),
      image: img,
    },
  }));
},

        /** Remove the current image (keeps projectId fresh). */
        clearImage() {
          set((state) => ({
            project: { projectId: newProjectId(), image: undefined },
            view: { ...state.view, display: { width: 0, height: 0, scale: 0 } },
          }));
        },

        /**
         * Compute display size to fit the image inside a container (viewport area).
         * If no image yet, leaves display at 0.
         */
        setDisplayByContainer(containerW, containerH) {
          const { project } = get();
          const img = project.image;
          if (!img) return;

          const display = fitToContainer(img.originalW, img.originalH, containerW, containerH);
          set((state) => ({ view: { ...state.view, display } }));
        },
      },
    }),
    {
      name: 'itc:v1', // localStorage key
      // Persist only what’s useful now (project + maybe display if you want)
      partialize: (state) => ({
        project: state.project,
        view: { display: state.view.display }, // optional, harmless to persist
      }),
    }
  )
);

/** Tiny selectors to keep components simple & performant */
export const useHasImage = () => useEditorStore((s) => Boolean(s.project.image));
export const useImageMeta = () => useEditorStore((s) => s.project.image);
export const useDisplay = () => useEditorStore((s) => s.view.display);
export const useEditorActions = () => useEditorStore((s) => s.actions);
