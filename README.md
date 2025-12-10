# Eko Monorepo

Eko is a full‑stack learning playground that combines a production‑ready Next.js application, an embeddable React widget, and a Convex backend that is wired up with Clerk authentication, shadcn/ui, and Sentry instrumentation. The repository is organized as a PNPM workspace that is orchestrated with Turborepo so every project shares the same tooling, lint rules, and UI kit.

## Highlights

- **Multi-app workspace** – `apps/web` (Next.js 15), `apps/widget` (Vite + React), and `apps/embed` (lightweight embed shell) ship together but can be developed independently.
- **Convex backend** – `packages/backend` hosts Convex functions with integrations for Clerk, S3-compatible storage, and AI model providers.
- **Shared UI system** – `packages/ui` exposes shadcn/ui + Radix primitives, Tailwind styles, and reusable hooks/components for every frontend project.
- **Consistent developer experience** – PNPM, Turborepo, TypeScript project references, and custom ESLint/TS configs keep builds, linting, and formatting aligned.
- **Observability & auth baked in** – Sentry instrumentation files live inside the Next app, and every client talks to Clerk/Convex with strongly typed helpers.

## Repository Layout

| Path | Description |
| --- | --- |
| `apps/web` | Main Next.js application with Clerk auth, Convex client, Sentry instrumentation, and shadcn/ui components. |
| `apps/widget` | Standalone Vite widget that can be embedded elsewhere; consumes the shared UI kit and Convex backend. |
| `apps/embed` | Minimal Vite build that provides an embeddable shell/loader for the widget bundle. |
| `packages/backend` | Convex backend functions plus helpers for Clerk, S3, and AI providers; exposes re-usable Convex modules. |
| `packages/ui` | Design system and shadcn/ui exports (components, hooks, Tailwind globals, PostCSS config). |
| `packages/math` | Example shared TypeScript utilities compiled to ESM/TS for client packages. |
| `packages/eslint-config` & `packages/typescript-config` | Centralized linting and tsconfig presets applied across the monorepo. |
| `pages/api` | Placeholder for legacy Next API routes (kept for compatibility with some deployments). |

## Prerequisites

- Node.js **20.x** or newer (the root `package.json` enforces this via `engines`).
- PNPM **10.4.1** (automatically used through `packageManager` metadata, install via `npm i -g pnpm@10.4.1`).
- Access to Convex, Clerk, Sentry, and an S3-compatible storage provider if you want to exercise those integrations locally.

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Bootstrap Convex**
   ```bash
   pnpm -F backend run setup
   ```
   The setup command runs `convex dev --until-success`, creates the `.env.local` template Convex expects, and prints the `CONVEX_URL` you will reuse in each client application.

3. **Create environment files**

   `packages/backend/.env.local`
   ```bash
   CLERK_JWT_ISSUER_DOMAIN=<your-clerk-issuer-domain>
   CLERK_SECRET_KEY=<clerk-secret-key>
   CLERK_WEBHOOK_SECRET=<optional-clerk-webhook-secret>
   S3_ENDPOINT=<s3-endpoint-url>
   S3_REGION=<aws-region>
   S3_ACCESS_KEY=<s3-access-key>
   S3_SECRET_KEY=<s3-secret-key>
   S3_BUCKET_NAME=<bucket-name>
   S3_ENCRYPTION_KEY=<optional-encryption-key>
   ```

   `apps/web/.env.local`
   ```bash
   NEXT_PUBLIC_CONVEX_URL=<convex-url-from-setup>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
   CLERK_SECRET_KEY=<same-as-backend-if-needed-for-SSR>
   ```

   `apps/widget/.env`
   ```bash
   VITE_PUBLIC_CONVEX_URL=<convex-url-from-setup>
   VITE_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
   ```

   `apps/embed/.env`
   ```bash
   VITE_WIDGET_URL=http://localhost:3001 # or wherever the widget is hosted
   ```

   > Tip: Keep Convex, Clerk, and S3 credentials in your preferred secret manager and source them before running `pnpm dev` to avoid leaking values.

4. **Start developing**
   - `pnpm dev` – launches every package’s dev server via Turborepo (Next.js, Convex, widget, etc.).
   - `pnpm -F web dev` – run only the Next.js app.
   - `pnpm -F widget dev` – run the widget at `http://localhost:3001`.
   - `pnpm -F embed dev` – build the lightweight embed shell.
   - `pnpm -F backend dev` – start Convex independently if you prefer to run clients separately.

## Build, Test, and Lint

- **Build everything**
  ```bash
  pnpm build
  ```
  Turborepo caches each task and respects the dependency graph (`apps/web` waits for `packages/ui`, etc.).

- **Lint**
  ```bash
  pnpm lint            # run ESLint for every package
  pnpm -F web lint:fix # package-specific helpers
  ```

- **Type-check**
  ```bash
  pnpm -F web typecheck
  pnpm -F widget test  # includes vitest + jsdom assertions
  ```

- **Format**
  ```bash
  pnpm format
  ```
  The root formatter runs Prettier on `ts`, `tsx`, and `md` files.

## Deployment Notes

- The Next.js app ships through the standard `next build && next start` flow; Sentry config files (`instrumentation.ts`, `sentry.*.config.ts`) are ready for Vercel or Next standalone builds.
- Convex deployments can be handled through `convex deploy` (run inside `packages/backend`) once your production environment variables are configured.
- Because every frontend consumes the shared `@workspace/ui` package, publish or build it before promoting a production release—`pnpm build` handles this automatically.

## Troubleshooting

- If Turborepo caches stale environment variables, delete `.turbo` and rerun `pnpm dev`.
- `packages/backend` relies on `convex dev`; make sure the Convex CLI can open a tunnel/port locally.
- Clerk/S3 secrets are read at runtime via `process.env`; missing variables manifest as runtime errors in Convex logs, so double-check `.env.local`.
