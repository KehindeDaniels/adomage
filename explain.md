Great plan. Here’s the **order I’d study the code** and *why*—so it clicks fast and you don’t bounce around.

---

## 1) `store/editorStore.ts` (the brain)

**Why first:** It’s the single source of truth. Once you know the state shape and actions, every component will make sense.

**What to look for:**

* State: `project.image { src, originalW, originalH }` and `view.display { width, height, scale }`.
* Actions: `setImageFromFile(file)` and `setDisplayByContainer(w, h)`.
* Selectors: `useHasImage`, `useImageMeta`, `useDisplay`, `useEditorActions`.
* Persistence: how localStorage keeps `project` (and `display`).
* Important behavior: **we don’t reset** `display` on replace; we recompute it after.

---

## 2) `lib/layout.ts` (the fit math)

**Why second:** `setDisplayByContainer` calls this. If you grasp this tiny function, you understand why the canvas never breaks the layout.

**What to look for:**

* `fitToContainer(originalW, originalH, boxW, boxH)` → returns `display` with preserved aspect ratio.

---

## 3) `lib/image.ts` (file → dataURL + size)

**Why third:** This is how a PNG becomes usable by the app. It explains where `src`, `originalW`, and `originalH` come from.

**What to look for:**

* `decodePngFile(file)` → validates PNG, reads a **dataURL**, creates an `Image()` to get natural width/height.

---

## 4) `hooks/useViewportBox.ts` (measuring the box)

**Why now:** The canvas is fitted to a measured viewport. This hook tells the store “how big is the box I can draw into?”

**What to look for:**

* It reads `getBoundingClientRect()` and subscribes via `ResizeObserver`.
* It returns `{ width, height }` for the viewport div.

---

## 5) `UploadController` (empty-state upload UX)

**Why next:** This is the first entry-point for images (click + drag in empty state). It shows how UI calls the store action.

**What to look for:**

* Hidden `<input type="file">`, PNG filtering, drag/drop handling.
* It calls `onSelect(file)` → which is `setImageFromFile` from the store.

---

## 6) `FileDropTarget` (replace via drop on canvas)

**Why now:** Once an image is already on the stage, this wrapper enables dropping a new file to **replace** the background.

**What to look for:**

* `onDragOver/Enter/Leave/Drop` with proper `preventDefault`.
* It calls `onFile(file)` → same store action as above.

---

## 7) `CanvasStage` (the conductor)

**Why last:** It ties everything together—reads store, measures viewport, loads image for Konva, and renders the stage.

**What to look for:**

* Selectors: `useHasImage`, `useImageMeta`, `useDisplay`.
* Image loading: `const [htmlImage] = useImage(image?.src || '', 'anonymous')`.
* Measuring: `useViewportBox(viewportRef)` + `useEffect` to call `setDisplayByContainer(boxW, boxH)` when box or image `src` changes.
* Rendering:

  * Empty state → `UploadController`.
  * Image present → `FileDropTarget` around a **fixed-height viewport** (e.g., 480px) → Konva `<Stage>` sized to `display.width/height`.

---

## Mental model in one line

**File → store → (decode + original size) → measure viewport → fit math → `display` → Konva renders scaled image.**
Replace works the same path; we just call the same action again.

Read in this order and everything else will feel obvious. When you’re ready, we’ll walk each file with key lines and “what this line means” plain-English notes.
