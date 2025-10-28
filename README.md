# Eko Project

## Project Introduction

This is a monorepo template integrated with shadcn/ui for building modern web applications.

## Getting Started

### Frontend Setup

Install dependencies for the frontend:

```bash
pnpm install
```

### Backend Setup (Convex + Clerk + Sentry)

#### 1. Run Backend Setup

```bash
pnpm -F backend run setup
```

#### 2. Configure Environment Variables

Create a `.env.local` file in the `packages/backend` directory with the following content:

```bash
CLERK_JWT_ISSUER_DOMAIN=xxx
```

Create a `.env.local` file in the `/apps/web` directory with the following content:

```bash
NEXT_PUBLIC_CONVEX_URL=[same as your convex_url]
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx
CLERK_SECRET_KEY=xxx
```

> You can find the above values in the [Convex documentation](https://docs.convex.dev/home).

## Running the Application

To start the development server:

```bash
pnpm run dev
```