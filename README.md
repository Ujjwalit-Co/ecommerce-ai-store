# E-Commerce AI Store — UDP Web Development Batch 2026

> A modern AI-powered e-commerce platform built during the UDP Web Development Training & Internship Program. Interns can clone, fork, and build upon this project as they learn full-stack development with cutting-edge technologies.

<div align="center">

| Stack | Technologies |
|:-----:|:-------------|
| **Framework** | Next.js 16 (App Router) |
| **CMS** | Sanity (App SDK + Embedded Studio) |
| **Auth** | Clerk |
| **Payments** | Stripe |
| **UI** | shadcn/ui + Tailwind CSS v4 |
| **AI** | Vercel AI SDK + Claude Sonnet |
| **State** | Zustand |

</div>

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
| **Stripe** | Payment processing | [stripe.com](https://stripe.com/) |
| **Vercel** | AI Gateway (optional, for AI features) | [vercel.com](https://vercel.com/) |

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
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Vercel AI Gateway (optional — for AI chat features)
AI_GATEWAY_API_KEY=xxxxx
```

> **Note:** The `sanity/env.ts` also expects `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`. These are read from your `.env.local` as well. You will configure them in Step 4 below.

### 3. Configure Clerk

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key** into `.env.local`

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

### 5. Configure Stripe

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
│   ├── (app)/                  # Customer-facing pages
│   │   ├── layout.tsx          # App layout with providers
│   │   └── page.tsx            # Homepage / product listing
│   ├── (admin)/                # Admin dashboard (in progress)
│   ├── studio/                 # Embedded Sanity Studio
│   ├── about/                  # About page
│   ├── api/                    # API routes (webhooks, AI chat)
│   ├── globals.css             # Global styles + Tailwind
│   └── layout.tsx              # Root layout (fonts, metadata)
│
├── components/
│   └── ui/                     # shadcn/ui components
│
├── lib/
│   ├── constants/              # Filter options, order statuses
│   └── utils.ts                # Utility functions (cn, etc.)
│
├── sanity/
│   ├── env.ts                  # Sanity env config (projectId, dataset)
│   ├── lib/                    # Sanity client, fetch helpers
│   ├── schemaTypes/            # Document schemas
│   │   ├── productType.ts      # Product schema
│   │   ├── categoryType.ts     # Category schema
│   │   ├── orderType.ts        # Order schema
│   │   ├── customerType.ts     # Customer schema
│   │   └── index.ts            # Schema barrel export
│   └── structure.ts            # Sanity desk structure
│
├── public/                     # Static assets
├── sanity.config.ts            # Sanity Studio configuration
├── sample-data.ndjson          # Sample data for import
├── .env.example                # Environment variable template
├── .env.local                  # Your local env (not committed)
├── biome.json                  # Biome linter/formatter config
├── components.json             # shadcn/ui config
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS + Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies & scripts
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Homepage  │  │ Product  │  │  Cart    │  │  Admin   │       │
│  │          │  │  Pages   │  │(Zustand) │  │Dashboard │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │              │              │              │
└───────┼──────────────┼──────────────┼──────────────┼─────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS 16 APP                             │
│                                                                 │
│  Server Components ──► GROQ Queries ──► Sanity                 │
│  Server Actions    ──► Mutations     ──► Sanity                 │
│  API Routes        ──► Webhooks      ──► Stripe                 │
│                     ──► AI Chat       ──► Vercel AI Gateway     │
└───────────┬───────────────┬───────────────────┬────────────────┘
            │               │                   │
            ▼               ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│  Sanity CMS  │  │ Stripe       │  │ Vercel AI Gateway    │
│              │  │              │  │ (Claude Sonnet)      │
│ • Products   │  │ • Payments   │  │                      │
│ • Categories │  │ • Webhooks   │  │ • Product Search     │
│ • Orders     │  │ • Checkout   │  │ • Order Tracking     │
│ • Customers  │  │              │  │ • Recommendations    │
│              │  │              │  │                      │
│ Studio:      │  │              │  │                      │
│ /studio      │  │              │  │                      │
└──────────────┘  └──────────────┘  └──────────────────────┘
```

### User Shopping Flow

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

### AI Chat Flow

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
| `status` | string | pending, paid, shipped, delivered, cancelled |
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

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |

---

## Current Status & Pulling Updates

This project is **actively under development**. New features, components, and integrations are being added over time. Interns should regularly pull the latest changes to stay up to date.

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
| **@sanity/icons** | Icon library for Sanity Studio UI | [sanity.io/icons](https://www.sanity.io/icons) |
| **Clerk** | Authentication & user management | [clerk.com/docs](https://clerk.com/docs) |
| **Stripe** | Payment processing, checkout, webhooks | [stripe.com/docs](https://stripe.com/docs) |
| **shadcn/ui** | Reusable UI components built on Radix primitives | [ui.shadcn.com](https://ui.shadcn.com) |
| **Tailwind CSS v4** | Utility-first CSS framework | [tailwindcss.com](https://tailwindcss.com) |
| **Vercel AI SDK** | AI chat integration with multi-provider support | [sdk.vercel.ai](https://sdk.vercel.ai) |
| **Zustand** | Lightweight state management for cart | [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs) |
| **Biome** | Fast linter and formatter | [biomejs.dev](https://biomejs.dev) |
| **TypeScript** | Static type checking | [typescriptlang.org](https://www.typescriptlang.org) |

---

## License

This project is for educational purposes as part of the **UDP Web Development Training & Internship Program 2026**.

---

<div align="center">

**Built for UDP Web Development Batch 2026**

</div>
