````markdown
# Image+Text Editor (Next.js · Zustand · shadcn/ui · Konva)

A small, focused editor with PNG upload, canvas with proper scaling, and export-at-original-size. This README is action-oriented for senior engineers.

---

## Stack
- Next.js (App Router)
- Tailwind + shadcn/ui
- Zustand (with persist)
- Konva / react-konva
- next-themes (class-based dark mode)

---

## Quick Start

### 1) Create app
```bash
npx create-next-app@latest editor --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
cd editor
````

### 2) Install deps

```bash
npm i zustand konva react-konva use-image class-variance-authority lucide-react next-themes tw-animate-css
```

### 3) shadcn/ui

```bash
npx shadcn@latest init -d
# Components used early:
npx shadcn@latest add button card input label slider textarea dropdown-menu separator tooltip tabs toggle toggle-group
```

### 4) Tailwind setup

* Ensure `darkMode: ['class']` in `tailwind.config.ts`.
* Make sure `src/app/globals.css` is imported in `src/app/layout.tsx`.

### 5) Theme CSS (paste **exactly** into `src/app/globals.css`)

> Keep as-is. Palette + tokens below.

```css
@import "tailwindcss";
@import "tw-animate-css";

/* shadcn custom variant (kept) */
@custom-variant dark (&:is(.dark *));

/* ======================================
   1) System tokens mapped to CSS vars
====================================== */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

/* ======================================
   2) Base Theme — LIGHT (your palette)
====================================== */
@layer base {
  :root {
    --radius: 0.625rem;

    /* Core surfaces/text */
    --background: #edede9;
    --foreground: #131317;

    --card: #ecece8;
    --card-foreground: #131317;

    --popover: #ecece8;
    --popover-foreground: #131317;

    /* Temporary brand */
    --primary: #1a1c22;
    --primary-foreground: #edede9;

    --secondary: #e5e3dd;
    --secondary-foreground: #131317;

    --muted: #e5e4dd;
    --muted-foreground: #1a1b22;

    --accent: #e4e3dd;
    --accent-foreground: #131317;

    --destructive: #b3261e;
    --border: #e4e3dd;
    --input: #e5e4dd;
    --ring: #1a1c22;

    /* Charts */
    --chart-1: #6e56cf;
    --chart-2: #2ab3bf;
    --chart-3: #4f46e5;
    --chart-4: #84cc16;
    --chart-5: #f59e0b;

    /* Sidebar */
    --sidebar: #ecece8;
    --sidebar-foreground: #131317;
    --sidebar-primary: #1a1c22;
    --sidebar-primary-foreground: #edede9;
    --sidebar-accent: #e5e3dd;
    --sidebar-accent-foreground: #131317;
    --sidebar-border: #e4e3dd;
    --sidebar-ring: #1a1c22;
  }
}

/* ======================================
   3) DARK THEME (your palette)
====================================== */
.dark {
  --background: #121216;
  --foreground: #edede9;

  --card: #131317;
  --card-foreground: #edede9;

  --popover: #131317;
  --popover-foreground: #edede9;

  --primary: #edede9;
  --primary-foreground: #121216;

  --secondary: #1a1c22;
  --secondary-foreground: #edede9;

  --muted: #1a1b22;
  --muted-foreground: #e5e3dd;

  --accent: #1b1c22;
  --accent-foreground: #edede9;

  --destructive: #ff4d4f;
  --border: #1b1c22;
  --input: #1a1b22;
  --ring: #e5e3dd;

  /* Charts */
  --chart-1: #8b5cf6;
  --chart-2: #22d3ee;
  --chart-3: #60a5fa;
  --chart-4: #a3e635;
  --chart-5: #fbbf24;

  /* Sidebar */
  --sidebar: #131317;
  --sidebar-foreground: #edede9;
  --sidebar-primary: #edede9;
  --sidebar-primary-foreground: #121216;
  --sidebar-accent: #1a1c22;
  --sidebar-accent-foreground: #edede9;
  --sidebar-border: #1b1c22;
  --sidebar-ring: #e5e3dd;
}

/* ======================================
   4) Base element defaults
====================================== */
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground font-sans; }
}

/* ======================================
   5) Utilities & animations
====================================== */
@layer utilities {
  .rounded-lg { border-radius: var(--radius); }
  .rounded-md { border-radius: calc(var(--radius) - 2px); }
  .rounded-sm { border-radius: calc(var(--radius) - 4px); }

  @keyframes accordion-down { from { height: 0; } to { height: var(--radix-accordion-content-height); } }
  @keyframes accordion-up { from { height: var(--radix-accordion-content-height); } to { height: 0; } }
  @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }

  .animate-accordion-down { animation: accordion-down 0.2s ease-out; }
  .animate-accordion-up { animation: accordion-up 0.2s ease-out; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-marquee { animation: marquee 25s linear infinite; }
  .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
}

html { scroll-behavior: smooth; scroll-padding-top: 4rem; }
```

### 6) Theme toggle

* Add `ThemeProvider` (next-themes) and wrap `app/layout.tsx`.
* Add a `ModeToggle` button using shadcn/ui.
* Attribute = `class`, default = `system`.

---

## Branching Plan (small PRs)

1. **feat/initial-setup**
   Next.js scaffold, Tailwind, shadcn init, `globals.css`, ThemeProvider + ModeToggle.

2. **feat/store-and-helpers**
   `store/editorStore` (persist key `canvas-project:v1`, partialize `{ project, view.display }`), `types/editor.ts`, `lib/image.ts`, `hooks/useViewportBox.ts`, `lib/coords.ts`.

3. **feat/upload-controller**
   `UploadController` + `FileDropTarget`; empty state wiring.

4. **feat/canvas-stage**
   `CanvasStage` (react-konva Stage/Layer), viewport sizing, `forwardRef` to Stage.

5. **feat/toolbar-redesign**
   Toolbar with **Download/Reset** (right) and **Undo/Redo** group + counter.

6. **feat/export-original**
   `lib/export.ts`, (optional) `useExportOriginal`, wire toolbar Download → export-at-original-size.

7. **feat/layers-panel**
   Left panel ordering (background image first, then text layers). Text types exist; rendering comes later.

> Keep `main` stable; rebase short-lived branches; PR early.

---

## Project Structure (reference)

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    theme/ (ThemeProvider, ModeToggle)
    editor/
      top/CanvasToolbar.tsx
      left/LayersPanel.tsx
      right/TextInspector.tsx
      right/TextContentCard.tsx
      UploadController.tsx
      canvas/
        CanvasStage.tsx
        FileDropTarget.tsx
  hooks/
    useViewportBox.ts
    useExportOriginal.ts   (optional)
  lib/
    image.ts
    coords.ts
    export.ts
  store/
    editorStore.ts
  types/
    editor.ts
```

---

## Scripts

```bash
npm run dev
npm run build
npm run start
```

---

## Notes

* Source of truth: **original image pixels**. Convert at edges (`display.scale`).
* Export uses visible Stage + `pixelRatio` → matches original dimensions.
* Persist only `{ project, view.display }` for now; layers/history later.

```
```
