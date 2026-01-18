# Smipay

This repository contains the front-end app, UI components, and static assets used by the Smipay web presence.

**Tech stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Vercel-friendly.

## Getting started

Recommended package manager: `pnpm` (project contains `pnpm-lock.yaml`). Alternative: `npm`.

Install dependencies:

```bash
pnpm install
# or
npm install
```

Run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open http://localhost:3000 in your browser.

## Available scripts

- `dev` — Runs the Next.js dev server.
- `build` — Builds the production app.
- `start` — Runs the production server after `build`.
- `lint` — Runs ESLint.

Run them with `pnpm <script>` or `npm run <script>`.

## Configuration & environment

- Copy environment variables into a local `.env.local` file. Example variables are provided in `.env.example`.
- Public runtime variables should be prefixed with `NEXT_PUBLIC_`.

## Project structure

- `app/` — Next.js App Router pages and layouts.
- `components/` — Reusable UI components and shared design blocks.
- `public/` — Static assets (images, svgs).
- `lib/` — Utility helpers.

## Styling & fonts

- Tailwind CSS is used for styling. Global styles are in `app/globals.css`.
- Fonts are loaded/optimized via `next/font` in the app layout.

## Deployment

This project is deployable to Vercel with zero-config. To deploy:

```bash
pnpm build
pnpm start
```

Or connect the repository to Vercel and use their automatic build/deploy flow.

## Contributing

Contributions are welcome. Typical workflow:

1. Fork the repo and create a feature branch.
2. Run the app locally and add tests where appropriate.
3. Open a pull request describing your changes.

## Troubleshooting

- If ports are in use, run the dev server on a different port: `pnpm dev -- -p 3001`.
- If types or imports fail, run `pnpm install` and ensure `node` and `pnpm` are recent.

## License & credits

Include license details here (e.g., MIT) and attribute libraries used.

---

Files changed: see the project root for `app/`, `components/`, and `public/` for implementation details.
