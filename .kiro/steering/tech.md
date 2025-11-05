---
inclusion: always
---

# Tech Stack

## Backend

- **Framework**: MedusaJS 2.0 (v2.10.2)
- **Runtime**: Node.js 22.x
- **Language**: TypeScript 5.7
- **Package Manager**: pnpm 9.10.0
- **Database**: PostgreSQL with MikroORM 6.4.3
- **ORM**: MikroORM with Knex
- **Module Resolution**: node16

### Key Dependencies
- `@medusajs/framework` - Core commerce framework
- `@medusajs/admin-sdk` & `@medusajs/dashboard` - Admin UI
- `@medusajs/payment-stripe` - Stripe integration
- `@rokmohar/medusa-plugin-meilisearch` - Search functionality
- `minio` - Object storage client
- `resend` - Email service
- `pg` - PostgreSQL client

### Backend Commands
```bash
cd backend/
pnpm install          # Install dependencies
pnpm ib              # Initialize backend (migrations + seed)
pnpm dev             # Start dev server (admin at localhost:9000/app)
pnpm build           # Build for production
pnpm start           # Run production build
pnpm seed            # Seed database
```

## Storefront

- **Framework**: Next.js 15.1.4 with App Router
- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.x
- **Package Manager**: npm
- **Styling**: Tailwind CSS 3.4
- **UI Components**: @medusajs/ui 4.0.7, @headlessui/react
- **Module Resolution**: bundler

### Key Dependencies
- `@medusajs/js-sdk` - Medusa API client
- `next-intl` - Internationalization
- `@stripe/react-stripe-js` - Stripe checkout
- `react-instantsearch` & `algoliasearch` - Search UI
- `embla-carousel-react` - Carousels
- `react-hook-form` & `zod` - Form handling
- `date-fns` - Date utilities

### Storefront Commands
```bash
cd storefront/
npm install          # Install dependencies
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Development Tools

- **Storybook**: Component development and documentation
- **ESLint**: Code linting with Next.js config
- **React Email**: Email template development

## Build System

- **Backend**: Medusa CLI with SWC compilation
- **Storefront**: Next.js with Turbopack (dev) and Webpack (prod)
- **TypeScript**: Strict mode enabled on storefront

## Path Aliases

- **Backend**: `*` maps to `./src/*`
- **Storefront**: `@/*` maps to `./src/*`
