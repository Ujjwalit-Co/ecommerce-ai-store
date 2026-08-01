# E-Commerce AI Store — UDP Web Development Batch 2026

> A modern AI-powered e-commerce platform built during the UDP Web Development Training & Internship Program. Interns can clone, fork, and build upon this project as they learn full-stack development with cutting-edge technologies.

<div align="center">

| Stack | Technologies |
|:-----:|:-------------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **CMS** | Sanity (App SDK + Embedded Studio, GROQ) |
| **Auth** | Clerk |
| **UI** | shadcn/ui (Base UI) + Tailwind CSS v4 |
| **Payments** | Stripe *(planned — scaffolded)* |
| **AI** | Vercel AI Gateway *(planned — scaffolded)* |
| **Tooling** | TypeScript, Biome, Sanity TypeGen |

</div>

> **Note:** This project is in early development. Auth, the CMS (Sanity Studio + typed GROQ queries), and the shadcn/ui component library are wired up. Checkout (Stripe), the AI shopping assistant, and the admin dashboard are **planned** — the data model and queries are already scaffolded for them (see [Current Status](#current-status)).

---

## Fork & Clone

### Fork the Repository

1. Go to the project repository on GitHub
2. Click the **Fork** button (top-right)
3. Select your GitHub account as the destination

### Clone Your Fork

#### macOS / Linux

```bash
git clone https://github.com/<YOUR_USERNAME>/ecommerce-ai-store.git
cd ecommerce-ai-store
```

#### Windows (PowerShell)

```powershell
git clone https://github.com/<YOUR_USERNAME>/ecommerce-ai-store.git
cd ecommerce-ai-store
```

#### Windows (Git Bash)

```bash
git clone https://github.com/<YOUR_USERNAME>/ecommerce-ai-store.git
cd ecommerce-ai-store
```

### Add Upstream Remote (to pull future changes)

```bash
git remote add upstream https://github.com/Ujjwalit-Co/ecommerce-ai-store.git
```

To pull the latest changes later:

```bash
git fetch upstream
git merge upstream/main
```

---

## Prerequisites

| Tool | Minimum Version | Check Command |
|------|-----------------|---------------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | 2.x | `git --version` |

### Create Accounts (Free)

| Service | Purpose | Link |
|---------|---------|------|
| **Sanity** | Headless CMS, content management | [sanity.io](https://www.sanity.io/) |
| **Clerk** | Authentication (sign-in, sign-up) | [clerk.com](https://clerk.com/) |
| **Stripe** | Payment processing *(needed for checkout, not required to run the storefront)* | [stripe.com](https://stripe.com/) |
| **Vercel** | AI Gateway *(optional, for AI features)* | [vercel.com](https://vercel.com/) |

---

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and fill in the values:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-13
SANITY_API_WRITE_TOKEN=your_token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Stripe (optional for now — needed for checkout)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Vercel AI Gateway (optional — for AI chat features)
AI_GATEWAY_API_KEY=xxxxx
```

### 3. Configure Clerk

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key** into `.env.local`

Clerk is already wired up via `ClerkProvider` in `app/(app)/layout.tsx` and route protection in `proxy.ts` (`/checkout`, `/orders`, `/checkout/success`).

### 4. Configure Sanity

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Create a new project (or select an existing one)
3. Copy your **Project ID** and **Dataset** name
4. Add these to `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-13
```

5. Create an API token with **Editor** permissions and add it as `SANITY_API_WRITE_TOKEN` if needed

### 5. Configure Stripe *(only if working on checkout)*

1. Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret Key** (use `sk_test_` for development)
3. For local webhook testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the webhook signing secret it provides into `STRIPE_WEBHOOK_SECRET` in `.env.local`

### 6. Import Sample Data

```bash
npx sanity dataset import sample-data.ndjson
```

This loads sample product and category data into your Sanity dataset.

### 7. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sanity Studio is embedded at [http://localhost:3000/studio](http://localhost:3000/studio).

---

## Project Architecture

```
ecommerce-ai-store/
│
├── app/
│   ├── (app)/                   # Storefront route group (Clerk + live CMS)
│   │   ├── layout.tsx           # ClerkProvider + <SanityLive/>
│   │   └── page.tsx             # Homepage (WIP: GROQ filter/sort/search)
│   ├── (admin)/                 # Admin dashboard (placeholder — empty)
│   ├── about/page.tsx           # About page (placeholder)
│   ├── studio/[[...tool]]/      # Embedded Sanity Studio (/studio/**)
│   ├── globals.css              # Tailwind v4 + shadcn theme
│   └── layout.tsx               # Root layout (fonts, metadata)
│
├── components/
│   └── ui/                      # 20 shadcn/ui components (Base UI primitives)
│
├── lib/
│   ├── constants/
│   │   ├── filters.ts           # Colors, materials, sort options
│   │   ├── orderStatus.ts       # Order status config + emojis (AI display)
│   │   └── stock.ts             # Stock thresholds & helpers
│   └── utils.ts                 # cn(), formatPrice()
│
├── sanity/
│   ├── schemaTypes/             # product, category, order, customer
│   ├── queries/                 # 28 typed GROQ queries
│   │   ├── products.ts          # List, search, filter, AI search, stock
│   │   ├── categories.ts        # Categories
│   │   ├── orders.ts            # Orders (user, detail, webhook idempotency)
│   │   ├── customers.ts         # Customers (email, Stripe ID)
│   │   └── stats.ts             # Admin analytics / AI insights
│   └── lib/
│       ├── client.ts            # next-sanity client
│       ├── live.ts              # sanityFetch / <SanityLive/>
│       └── image.ts             # urlFor() image builder
│
├── public/                      # Static assets
├── proxy.ts                     # Clerk middleware (protects /checkout, /orders)
├── sanity.config.ts             # Studio config (desk + vision tools)
├── sanity.cli.ts                # Sanity CLI config
├── sanity.types.ts              # Generated types (Sanity TypeGen)
├── schema.json                  # Generated schema (Sanity TypeGen)
├── sanity-typegen.json          # TypeGen config
├── sample-data.ndjson           # Sample data for import
├── .env.example                 # Environment variable template
├── .env.local                   # Your local env (not committed)
├── biome.json                   # Biome linter/formatter config
├── eslint.config.mjs            # ESLint config
├── components.json              # shadcn/ui config
├── next.config.ts               # Next.js config (React Compiler enabled)
├── postcss.config.mjs           # PostCSS + Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies & scripts
```

### Current Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Homepage  │  │ Product  │  │  Cart    │  │  Admin   │       │
│  │ (WIP)    │  │  Pages   │  │  (planned)│  │(planned) │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │              │              │              │
└───────┼──────────────┼──────────────┼──────────────┼─────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS 16 APP                             │
│                                                                 │
│  Server Components ──► GROQ Queries ──► Sanity (live)          │
│  ClerkProvider     ──► Auth (proxy.ts middleware)              │
│  API Routes        ──► (planned: Stripe webhooks, AI chat)     │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│         Sanity CMS           │  │          Clerk               │
│  • Products • Categories     │  │  • Authentication            │
│  • Orders   • Customers      │  │  • Route protection          │
│  • Live Content API          │  │                              │
│  • Embedded Studio (/studio) │  └──────────────────────────────┘
└──────────────────────────────┘
```

### Intended Shopping Flow *(planned)*

```
Browse Products ──► Add to Cart ──► Checkout ──► Stripe Payment
                                                     │
                                                     ▼
                                            Webhook Fires
                                                     │
                                                     ▼
                                       Order Created in Sanity
                                                     │
                                                     ▼
                                          Stock Auto-Updated
```

### Intended AI Chat Flow *(planned)*

```
User Message ──► Clerk Auth Check ──► AI Agent (Claude)
                                           │
                                           ├──► searchProducts ──► GROQ ──► Sanity
                                           │
                                           └──► getMyOrders (if signed in) ──► Sanity
                                                     │
                                                     ▼
                                              AI Response to User
```

---

## Sanity Schema Overview

### Product

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Product name |
| `slug` | slug | URL-friendly identifier |
| `description` | text | Product description |
| `price` | number | Price in GBP |
| `category` | reference → category | Product category |
| `material` | string | wood, metal, fabric, leather, glass |
| `color` | string | black, white, oak, walnut, grey, natural |
| `dimensions` | string | e.g., "120cm x 80cm x 75cm" |
| `images` | array of image | Product images (hotspot enabled) |
| `stock` | number | Current inventory count |
| `featured` | boolean | Show on homepage |
| `assemblyRequired` | boolean | Requires assembly? |

### Category

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Category name |
| `slug` | slug | URL-friendly identifier |
| `image` | image | Category thumbnail |

### Order

| Field | Type | Description |
|-------|------|-------------|
| `orderNumber` | string | Unique order ID |
| `items` | array | Products with quantity & price at purchase |
| `total` | number | Order total in GBP |
| `status` | string | paid, shipped, delivered, cancelled |
| `customer` | reference → customer | Link to customer |
| `clerkUserId` | string | Clerk user identifier |
| `email` | string | Customer email |
| `address` | object | Shipping address |
| `stripePaymentId` | string | Stripe payment intent ID |
| `createdAt` | datetime | Order creation timestamp |

### Customer

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Customer name |
| `email` | string | Customer email |
| `clerkUserId` | string | Clerk user identifier |
| `stripeCustomerId` | string | Stripe customer ID |
| `createdAt` | datetime | Account creation timestamp |

> Enumerated values (colors, materials, order status) are defined once in `lib/constants/` and shared between the Sanity Studio schema and the frontend filters, so they can never drift out of sync.

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |
| `npm run typegen` | Regenerate Sanity types (`sanity.types.ts`) |
| `npx sanity dataset import sample-data.ndjson` | Load sample products/categories |

---

## Current Status

This project is **actively under development**. Here's what is built today versus what is planned.

### ✅ Implemented

- **Next.js 16 App Router** with React 19 and the React Compiler enabled
- **Clerk authentication** (`ClerkProvider` + `proxy.ts` route protection)
- **Sanity CMS** — embedded Studio at `/studio` with desk + vision tools, 4 document types (`product`, `category`, `order`, `customer`), Live Content API (`<SanityLive/>`)
- **Sanity TypeGen** — 28 typed GROQ queries across `products`, `categories`, `orders`, `customers`, `stats`, with generated types in `sanity.types.ts`
- **Homepage query layer** — server-side product search, filtering (category, color, material, price, in-stock), and sorting via GROQ (currently a WIP/debug page)
- **shadcn/ui component library** (20 components, built on Base UI primitives) + Tailwind CSS v4
- **Shared constants** for filters, order statuses, and stock levels

### 🚧 Planned / Scaffolded

- **Checkout & Stripe** — order/customer schemas, `PRODUCTS_BY_IDS_QUERY`, webhook idempotency queries, and env vars are ready; API routes and the cart store are **not built yet**
- **AI shopping assistant** — `AI_SEARCH_PRODUCTS_QUERY` and status emoji helpers exist; no AI SDK integration yet
- **Admin dashboard** — `app/(admin)/` route group reserved; stats/analytics GROQ queries (`stats.ts`) are ready
- **Order history pages** — `ORDERS_BY_USER_QUERY` / `ORDER_BY_ID_QUERY` are ready
- **Storefront UI** — homepage renders a placeholder while the query layer is validated

### Pulling Updates

Interns should regularly pull the latest changes to stay up to date.

```bash
# Fetch and merge latest changes from upstream
git fetch upstream
git merge upstream/main

# Install any new dependencies
npm install
```

> **Tip:** Always pull before starting new work to avoid merge conflicts.

---

## Tech Stack Deep Dive

| Technology | Role | Docs |
|------------|------|------|
| **Next.js 16** | React framework with App Router, Server Components, Server Actions | [nextjs.org/docs](https://nextjs.org/docs) |
| **React 19** | UI library | [react.dev](https://react.dev) |
| **Sanity** | Headless CMS with real-time content, GROQ queries, embedded Studio | [sanity.io/docs](https://www.sanity.io/docs) |
| **next-sanity** | Sanity client, Live Content API, and Studio integration for Next.js | [sanity.io/next-sanity](https://next-sanity.vercel.app) |
| **@sanity/icons** | Icon library for Sanity Studio UI | [sanity.io/icons](https://www.sanity.io/icons) |
| **Clerk** | Authentication & user management | [clerk.com/docs](https://clerk.com/docs) |
| **Stripe** *(planned)* | Payment processing, checkout, webhooks | [stripe.com/docs](https://stripe.com/docs) |
| **shadcn/ui** | Reusable UI components (built on Base UI primitives) | [ui.shadcn.com](https://ui.shadcn.com) |
| **Base UI** | Headless UI primitives used by the shadcn components | [base-ui.com](https://base-ui.com) |
| **Tailwind CSS v4** | Utility-first CSS framework | [tailwindcss.com](https://tailwindcss.com) |
| **Vercel AI SDK** *(planned)* | AI chat integration with multi-provider support | [sdk.vercel.ai](https://sdk.vercel.ai) |
| **Sonner** | Toast notifications | [sonner.emilkowal.ski](https://sonner.emilkowal.ski) |
| **next-themes** | Light/dark theme support | [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes) |
| **Biome** | Fast linter and formatter | [biomejs.dev](https://biomejs.dev) |
| **TypeScript** | Static type checking | [typescriptlang.org](https://www.typescriptlang.org) |

---

## License

This project is for educational purposes as part of the **UDP Web Development Training & Internship Program 2026**.

---

<div align="center">

**Built for UDP Web Development Batch 2026**

</div>
