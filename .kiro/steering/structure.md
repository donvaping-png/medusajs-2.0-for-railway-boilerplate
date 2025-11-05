---
inclusion: always
---

# Project Structure

## Monorepo Layout

```
medusajs-2.0-for-railway-boilerplate/
├── backend/          # MedusaJS backend
└── storefront/       # Next.js storefront
```

## Backend Structure

```
backend/src/
├── admin/            # Admin dashboard customizations
├── api/              # API route handlers
│   ├── admin/        # Admin API routes
│   ├── store/        # Storefront API routes
│   └── key-exchange/ # Custom API endpoints
├── jobs/             # Background jobs
├── lib/              # Shared utilities (constants, helpers)
├── migrations/       # Database migrations
├── modules/          # Custom Medusa modules
│   ├── email-notifications/  # Resend email integration
│   └── minio-file/          # MinIO file storage
├── scripts/          # Build and seed scripts
├── subscribers/      # Event subscribers
├── utils/            # Utility functions
└── workflows/        # Custom workflows
```

### Backend Conventions

- **Configuration**: `medusa-config.js` at root with environment-based module loading
- **Environment**: `.env` file (from `.env.template`)
- **Migrations**: Named with timestamp prefix `Migration{YYYYMMDDHHMMSS}_{description}.ts`
- **Module Resolution**: Use bare imports (e.g., `lib/constants`) via tsconfig paths
- **Build Output**: `.medusa/server/`

## Storefront Structure

```
storefront/src/
├── app/              # Next.js App Router
│   ├── [locale]/     # Internationalized routes
│   ├── api/          # API routes
│   └── layout.tsx    # Root layout
├── components/       # React components (Atomic Design)
│   ├── atoms/        # Basic building blocks
│   ├── cells/        # Small composite components
│   ├── molecules/    # Medium composite components
│   ├── organisms/    # Large composite components
│   ├── providers/    # Context providers
│   └── sections/     # Page sections
├── const/            # Constants
├── data/             # Mock data and static data
├── hooks/            # Custom React hooks
├── icons/            # Icon components
├── lib/              # Core utilities
│   ├── data/         # Data fetching functions
│   ├── helpers/      # Helper functions
│   ├── client.tsx    # Medusa SDK client
│   ├── config.ts     # App configuration
│   └── utils.ts      # Utility functions
└── types/            # TypeScript type definitions
```

### Storefront Conventions

- **Component Organization**: Atomic Design pattern (atoms → cells → molecules → organisms → sections)
- **Routing**: File-based with `[locale]` for i18n
- **Path Aliases**: Use `@/` prefix for imports (e.g., `@/components/atoms/Button`)
- **Environment**: `.env.local` file (from `.env.template`)
- **Styling**: Tailwind CSS with custom configuration
- **Type Definitions**: Centralized in `src/types/`

## Configuration Files

### Backend
- `medusa-config.js` - Medusa configuration with conditional module loading
- `tsconfig.json` - TypeScript config with node16 resolution
- `.env.template` - Environment variable template

### Storefront
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript config with bundler resolution
- `.storybook/` - Storybook configuration

## Key Patterns

1. **Conditional Module Loading**: Backend modules (MinIO, Resend, Stripe, MeiliSearch) load conditionally based on environment variables
2. **Fallback Strategies**: Local file storage and simulated Redis when cloud services unavailable
3. **Internationalization**: Storefront uses `next-intl` with locale-based routing
4. **Type Safety**: Strict TypeScript on storefront, shared types in dedicated directories
5. **Environment-First**: All configuration driven by environment variables
