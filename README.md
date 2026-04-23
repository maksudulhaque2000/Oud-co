# Oud.co

Oud.co is a Next.js e-commerce style project for perfume oils and attar products.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy env template and add Firebase values:

```bash
cp .env.local.example .env.local
```

3. Run the app:

```bash
npm run dev
```

4. Open http://localhost:3000

## Pre-Deploy Validation

Run this before any deployment:

```bash
npm run deploy:check
```

## Deploy to Vercel (CLI)

1. Login once:

```bash
npx vercel login
```

2. Link project (first time only):

```bash
npx vercel link
```

3. Set required environment variables in Vercel:

```bash
npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
```

4. Deploy to production:

```bash
npx vercel deploy --prod
```

## Deploy from Vercel Dashboard

1. Import repository into Vercel
2. Framework preset: Next.js
3. Build command: npm run build
4. Install command: npm ci
5. Add all NEXT*PUBLIC_FIREBASE*\* variables
6. Deploy

## Post-Deployment Checklist

1. Verify login/register and Google auth
2. Verify protected routes
3. Verify add/edit/delete product flows
4. Verify image previews and product images
