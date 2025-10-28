# Eko Project

## 1. Project Introduction

This is a monorepo template with shadcn/ui for building modern web applications.

## 2. Initialization Instructions

### frontend

```bash
pnpm install
```
### backend (convex + clerk + sentry)

#### 1. run setup

```bash
pnpm -F backend run setup
```

#### 2. fill env.local
Add content below to packages/backend/.env.local
```bash
CLERK_JWT_ISSUER_DOMAIN=xxx
```
Add content below to packages/backend/.env.local
```bash

NEXT_PUBLIC_CONVEX_URL=[same to your convex_url]

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx
CLERK_SECRET_KEY=xxx
```
> can find above content in https://docs.convex.dev/home

## 3. Run
```bash
pnpm run dev
```