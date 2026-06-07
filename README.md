# Yuan Sensing

> A calm mind–body growth web app that blends modern minimalism with Chinese classical aesthetics.

---

## Overview

Yuan Sensing guides users back to the present moment through "perception practice".
The visual language draws on an "unrolling ancient scroll" metaphor, accented with
Chinese elements (serif/Song typography for titles and golden lines, solar terms and
time-of-day cues). The guiding interaction principle is **gentle and smooth**: every
state change should fade/slide/ease, never flash or jump.

**Current target platform**

- Mobile-first **H5 web app**, served as a static site (e.g. Aliyun) and opened in
  mobile browsers — including the WeChat in-app browser and Safari.
- **PWA** enabled for an app-like, installable experience.
- Native apps / mini-programs are **out of scope** for the current phase.

## Tech Stack

| Area             | Choice                                                          |
| ---------------- | -------------------------------------------------------------- |
| Framework        | React 18 + TypeScript                                          |
| Build            | Vite 6                                                         |
| Styling          | TailwindCSS 4 + custom CSS-variable design tokens (`theme.css`) |
| UI primitives    | Radix UI (shadcn/ui-style components under `components/ui`)     |
| Icons            | lucide-react                                                   |
| PWA              | vite-plugin-pwa (`registerType: "autoUpdate"`)                 |
| Routing          | Custom in-memory stack router in `App.tsx` (no router lib used) |
| Transitions      | CSS-based (`PageTransition` / `CrossFade`); no animation lib    |
| Package manager  | pnpm                                                           |

> Note: `react-router` and `motion` are present in `package.json` but are **not
> currently imported** — routing and animation are handled in-house.

## Design System

- **Palette**: amber gold `#C49A6C` (primary) · sage green `#8BAA7D` (secondary) ·
  warm cream `#FAF7F2` (background) · warm dark-brown text `#3A3028`.
- **Typography**: serif/Song for titles and "golden lines"; system fonts for body.
- **Responsive units**: 750px design baseline. `--rpx = 100vw / 750`; sizes use
  `calc(var(--rpx) * <design-px>)`, with the container capped at 750px width.
- **Tokens** (colors, spacing, radius, z-index, surfaces) live in
  [`src/styles/theme.css`](src/styles/theme.css).

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Root: state-based stack router + global bottom nav
│   ├── pages/               # Screen assembly layer (~32 screens)
│   ├── config/              # Data + style constants (data / UI separation)
│   ├── components/
│   │   ├── shared/          # Reusable building blocks (BottomSheet, Toast, ...)
│   │   ├── navigation/      # Bottom navigation + BottomNavContext
│   │   ├── ui/              # Radix / shadcn-style primitives
│   │   ├── hero/            # Hero / landing sections
│   │   ├── content/         # Content sections
│   │   ├── player/          # Audio / chapter player
│   │   ├── onboarding/      # Onboarding flows
│   │   ├── breathing/       # Breathing session
│   │   ├── auth/            # Auth / login
│   │   └── figma/           # Figma-imported helpers
│   ├── hooks/               # Custom hooks (useReaderPrefs, useScrollDirection, ...)
│   └── utils/
└── styles/theme.css         # Design tokens
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

| Command            | Description                                                       |
| ------------------ | ---------------------------------------------------------------- |
| `pnpm dev`         | Start the Vite dev server.                                       |
| `pnpm build`       | Production build to `dist/`.                                     |
| `pnpm build:deploy`| Build, then assemble a `deploy/` folder for static hosting.      |

## Deployment

- `vite.config.ts` uses `base: "./"` (relative paths) so the app can be served from a
  subdirectory.
- Output goes to `dist/`; `pnpm build:deploy` additionally produces a `deploy/` layout
  ready to upload to static hosting.
- The PWA service worker uses `autoUpdate`. When verifying a new deploy, prefer a
  private/incognito window or clear site data to avoid being served stale cached
  assets. See §13.8 of the UI design system doc for the caching contingency notes.

## Documentation

| Document                                                                         | Description                                            |
| -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [spec/design/ui-design-system.md](spec/design/ui-design-system.md)               | UI design system, interaction principles, scroll/sheet architecture |
| [spec/engineering/development-guide.md](spec/engineering/development-guide.md)    | Engineering & development guide                        |
| [spec/components/components-guide.md](spec/components/components-guide.md)         | Component architecture guide                           |
| [spec/overall-technical-roadmap-plan.md](spec/overall-technical-roadmap-plan.md)  | Overall technical roadmap                              |
| [spec/versions-plan/](spec/versions-plan/)                                        | Versioned product plans (1.0, 2.0, 2.1, ...)          |

---

**Last updated**: 2026-06-07
