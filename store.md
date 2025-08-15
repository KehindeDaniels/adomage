```jsx
export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({ /* initial state + actions */ }),
    { name: 'itc:v1', partialize: ... }
  )
);```
