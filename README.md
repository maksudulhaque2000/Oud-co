# Oud.co

<div align="center">
  <img src="./public/preview.png" height="400" width="800" alt="Smart Inventory Cover"/>
</div>

Premium perfume oil and attar e-commerce application built with Next.js App Router, React, TypeScript, Tailwind CSS v4, Firebase Authentication, and MongoDB.

## Project Summary

Oud.co is a modern storefront experience for browsing, searching, filtering, and managing perfume products.

Core capabilities:

- Public product browsing and product details.
- Firebase authentication (Email/Password + Google).
- Protected product management routes.
- Live product persistence using MongoDB through the API routes.
- Responsive UI for desktop and mobile.

## Tech Stack

- Framework: Next.js 16.2.4 (App Router)
- Runtime/UI: React 19.2.4 + React DOM 19.2.4
- Language: TypeScript 5
- Styling: Tailwind CSS 4 + PostCSS
- Auth + Database: Firebase Web SDK 12
- Icons: lucide-react, react-icons
- Linting: ESLint 9 + eslint-config-next

## Runtime Requirements

- Node.js >= 20.0.0 (defined in package engines)
- npm (project uses package-lock.json)

## Main Features

### Public Experience

- Home page with:
  - Hero section
  - Featured products
  - Why choose us section
  - Testimonials
  - Promotional CTA banner
- Products page:
  - Real-time text search by title
  - Category filter
  - Price range filter
- Product details page:
  - Full description and specifications
  - Related products from same category
- About page and Contact page

### Authentication

- Register with name, email, and password.
- Login with email/password.
- Google sign-in support.
- Session state persisted via Firebase auth listener.

### Protected Product Management

- Add product route (protected)
- Manage products route (protected)
- Edit product route (protected)
- Create, update, and delete products in the MongoDB `products` collection

### Notifications and UX

- Global toast notification system.
- Confirmation modal before destructive actions.
- Responsive navbar with user dropdown + mobile menu.

## Route Map

### App Routes

- `/` Home page
- `/products` Product listing with search + filters
- `/products/[id]` Product details
- `/about` About page
- `/contact` Contact page
- `/login` Login page
- `/register` Register page

### Protected Routes

- `/products/add` Add product
- `/products/manage` Manage products
- `/products/manage/[id]` Edit product

Unauthenticated access to protected routes redirects to:

- `/login?next=<encoded-current-path>`

## Architecture and Data Flow

### Auth Layer

- `src/context/AuthContext.tsx`
  - Exposes: `user`, `loading`, `login`, `register`, `loginWithGoogle`, `logout`
  - Uses Firebase `onAuthStateChanged` for session sync

### UI Shell

- `src/app/layout.tsx`
  - Loads global fonts and styles
  - Wraps app with:
    - `AuthProvider`
    - `ProductsProvider`
    - `ToastProvider`
  - Shared layout includes `Navbar` and `Footer`

### Product Data Layer

- `src/lib/products.ts`
  - Product form defaults, image normalization, and request helpers
  - Image source normalization and validation

- `src/context/ProductsContext.tsx`
  - Loads live product data from the API and manages client-side state
  - Exposes `products`, `loading`, `error`, and CRUD actions

### Product Types

- `src/types/product.ts`
  - `ProductCategory`
  - `Product`
  - `NewProductInput`

## Project Structure

```text
.
|- public/
|- src/
|  |- app/
|  |  |- about/page.tsx
|  |  |- contact/page.tsx
|  |  |- login/page.tsx
|  |  |- register/page.tsx
|  |  |- products/
|  |  |  |- page.tsx
|  |  |  |- [id]/page.tsx
|  |  |  |- add/page.tsx
|  |  |  |- manage/page.tsx
|  |  |  |- manage/[id]/page.tsx
|  |  |- globals.css
|  |  |- layout.tsx
|  |  |- page.tsx
|  |- components/
|  |  |- ConfirmModal.tsx
|  |  |- Footer.tsx
|  |  |- Navbar.tsx
|  |  |- ProductCard.tsx
|  |  |- ProductForm.tsx
|  |  |- ProtectedRoute.tsx
|  |- context/
|  |  |- AuthContext.tsx
|  |  |- ToastContext.tsx
|  |- lib/
|  |  |- firebase.ts
|  |  |- products.ts
|  |- types/
|     |- product.ts
|- next.config.ts
|- package.json
```

## Environment Variables

Create `.env.local` with Firebase web config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_EMAILS=
NEXT_PUBLIC_ADMIN_UIDS=
```

Firebase setup checklist:

- Create Firebase project
- Enable Authentication
- Create a Firestore database
- Enable Email/Password provider
- Enable Google provider
- Add your localhost and Vercel domains to Firebase Authentication > Settings > Authorized domains
- Set the Firebase web config variables in Vercel Project Settings > Environment Variables for Production and Preview deployments
- Optionally set `NEXT_PUBLIC_ADMIN_EMAILS` or `NEXT_PUBLIC_ADMIN_UIDS` to restrict product add/edit/delete access to specific accounts

If login or registration works locally but fails on the live Vercel URL, the usual cause is that the deployed domain is missing from Firebase Authorized domains or one of the `NEXT_PUBLIC_FIREBASE_*` variables is not configured in Vercel.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local`.

3. Run development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` Start local dev server
- `npm run build` Create production build
- `npm run start` Start production server
- `npm run lint` Run ESLint
- `npm run deploy:check` Run lint + build before deployment

## Image Configuration

Remote image loading is configured in `next.config.ts` for:

- `images.unsplash.com`

If additional external image hosts are required, add them to `images.remotePatterns`.

## Product Management Behavior

- The `products` collection stays empty until you manually add records.
- New products are created in MongoDB with generated document IDs.
- Editing a product updates the corresponding MongoDB document.
- Deleting a product removes the MongoDB document.
- If the product API is unavailable, the UI shows an error/empty state instead of auto-seeding data.
- If no admin allowlist is configured, any authenticated user can manage products; otherwise only allowlisted users can write.

## Deployment Notes

- Vercel configuration file exists: `vercel.json`
- Before deploying, confirm the live domain is listed in Firebase Authorized domains and that all Firebase environment variables are set in Vercel.
- Recommended pre-deploy check:

```bash
npm run deploy:check
```

## Known Constraints

- Product data depends on `MONGODB_URI` for live persistence.
- Contact form currently simulates submission and does not call a backend API.

## Maintenance Suggestions

- Add role-based authorization for admin-only product management.
- Add automated tests (unit/integration/e2e).
- Add CI workflow for lint/build checks on pull requests.

## License

Copyright (c) 2026 Oud.co. All rights reserved.
