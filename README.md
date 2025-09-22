# Image Text Composer

A **desktop-only**, single-page editor for overlaying fully customizable text on PNG images.
Built with **Next.js + TypeScript**, **Konva** for canvas interactions, and **Zustand** for state management.

![Editor Preview](public/editor.png)

- **Repo:** [GitHub Repository](https://github.com/CaesarBourne/AdomateImage)
- **Video Walkthrough:** [Google Drive Link](https://drive.google.com/file/d/1cLmlyOTva-s0pLvDJCdTI_68xa_NGXyR/view?usp=sharing)
- **Live Demo:** _(Add your Vercel URL here)_

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Keyboard & Snapping](#keyboard--snapping)
- [Design Decisions](#design-decisions)
- [Performance Notes](#performance-notes)
- [Roadmap](#roadmap)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **PNG Upload:** Canvas auto-matches image aspect ratio; export at original resolution.
- **Multiple Text Layers:** Add, select, drag, rotate, reorder, and lock layers.
- **Typography Controls:** Google Fonts integration, font size, weight, opacity, alignment, multi-line text support.
- **Layer Management:** Left panel with inline text editing and drag-to-reorder support.
- **Snap & Nudge:** Snap to center/edges with arrow-key nudging.
- **Undo/Redo:** History stack with ≥ 20 steps.
- **Autosave:** LocalStorage persistence; restore session on reload.
- **Export to PNG:** Always at the original image size.
- **Canvas Meta Bar:** Displays Original / On-screen / Export dimensions (e.g., `1200×628 px`).

_Non-goals:_ Mobile/touch UI, collaboration, non-PNG formats.

---

## Screenshots

Add real screenshots inside `/public`.

| Editor UI                    | Export Size Chip                        |
| ---------------------------- | --------------------------------------- |
| ![Editor](public/editor.png) | ![Export](public/screenshot-export.png) |

---

## Quick Start

```bash
git clone https://github.com/CaesarBourne/AdomateImage.git
cd AdomateImage
npm install
```

Create `.env.local` as described in [Environment Variables](#environment-variables), then:

```bash
npm run dev       # Starts at http://localhost:3000
npm run build
npm run start
npm run lint
```

Deploy to **Vercel** with the same environment variables.

---

## Environment Variables

Two ways to access Google Fonts metadata:

### 1. Recommended (Server-side proxy)

Keeps your API key secure:

```env
GOOGLE_FONTS_API_KEY=your-google-fonts-key
```

Used in `src/app/api/fonts/route.ts` to fetch:

```
https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=...
```

### 2. Simple (Client-side)

Public key for demo purposes only:

```env
NEXT_PUBLIC_GOOGLE_FONTS_API_KEY=your-google-fonts-key
```

Used in `src/store/fontStore.ts` via `lib/googleFonts.ts`.

---

## How It Works

- **Coordinate System:**

  - All geometry stored in **original image pixels**:
    `TextLayer: { x, y, width?, rotation, fontSize, ... }`
  - View layer computes display scale; export renders off-screen at full size.

- **Fonts:**

  - `api/fonts/route.ts` fetches the Google Fonts catalog (server-side).
  - `useGoogleFonts()` caches metadata in LocalStorage.
  - `useFontLoader()` loads only active font families & weights.

- **Export:**

  - `useExportOriginal()` renders via `exportPNGOriginal()` at original dimensions.
  - Meta bar shows Original / On-screen / Export sizes for verification.

---

## Project Structure

```
AdomateImage
├── public
├── src
│   ├── app
│   │   ├── api/fonts/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── editor
│   │   │   ├── canvas
│   │   │   ├── left
│   │   │   ├── right/propertiesPanel
│   │   │   ├── top
│   │   │   └── EditorPage.tsx
│   │   ├── theme-provider
│   │   └── ui (shadcn/ui)
│   ├── hooks
│   ├── lib
│   ├── store
│   └── types
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## Keyboard & Snapping

| Action         | Shortcut                             |
| -------------- | ------------------------------------ |
| Nudge          | Arrow keys (1px)                     |
| Fast Nudge     | Shift + Arrow (10px)                 |
| Snap to Edges  | Ctrl + Arrow                         |
| Snap to Center | Ctrl + Alt + Left/Up                 |
| Undo / Redo    | Ctrl+Z / Ctrl+Shift+Z (Cmd on macOS) |

---

## Design Decisions

- **Konva** for robust canvas interactions with React bindings.
- **Zustand** for predictable state management & undo/redo snapshots.
- **Original-Pixel Model** ensures accurate export dimensions.
- **Server-side Font Proxy** keeps API keys secure in production.

---

## Performance Notes

- Loads only active font families/weights to reduce payload.
- Google Fonts catalog cached locally for faster loads.
- First load may show Chrome fallback font warnings (expected).

---

## Roadmap

- Line-height & letter-spacing controls
- Text shadow options
- Multi-select with group transforms
- Alignment guides & spacing hints
- Curved / warped text support
- Unit & E2E tests

---

## Development

- **TypeScript + ESLint** for code quality
- **shadcn/ui** for UI components
- Undo/redo history uses **snapshot-based state management**
- SEO: Metadata in `app/layout.tsx`, preconnect/dns-prefetch for fonts

---

## Contributing

- Fork & branch from `main`
- Run `npm i && npm run dev` locally
- Keep PRs focused & clean
- Run `npm run lint` before pushing

---

## License

MIT — see [LICENSE](LICENSE) for details.
