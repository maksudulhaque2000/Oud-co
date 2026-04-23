# 🕌 Oud.co — Perfume Oil & Attar E-Commerce Platform

A perfume oil and attar e-commerce web application built with **Next.js (App Router)** and **Firebase Authentication**.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Features](#-pages--features)
  - [Landing Page (/)](#1-landing-page-)
  - [Products Page (/products)](#2-products-page-products)
  - [Product Details (/products/[id])](#3-product-details-page-productsid)
  - [About Page (/about)](#4-about-page-about)
  - [Authentication](#5-authentication-login--register)
  - [Add Product — Protected (/products/add)](#6-add-product-protected-productsadd)
  - [Manage Products — Protected (/products/manage)](#7-manage-products-protected-productsmanage)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)

---

## 🛠 Tech Stack

| Category         | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | Next.js 14+ (App Router)                |
| Styling          | Tailwind CSS                            |
| Authentication   | Firebase Auth (Email/Password + Google) |
| Data Storage     | localStorage                            |
| State Management | React Context API                       |
| Icons            | lucide-react                            |

---

## 📁 Project Structure

```
oud-co/
├── app/
│   ├── layout.tsx                  # Root layout (Navbar + Footer)
│   ├── page.tsx                    # Landing page (/)
│   ├── about/
│   │   └── page.tsx                # About page
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── register/
│   │   └── page.tsx                # Register page
│   └── products/
│       ├── page.tsx                # Products listing
│       ├── [id]/
│       │   └── page.tsx            # Product details
│       ├── add/
│       │   └── page.tsx            # Add product (Protected)
│       └── manage/
│           └── page.tsx            # Manage products (Protected)
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── firebase.ts
│   └── products.ts                 # Static product data
└── .env.local
```

---

## 📄 Pages & Features

---

### 1. Landing Page (`/`)

Must include **7 sections**:

---

#### Section 1 — Navbar

- Logo: **"Oud.co"**
- Navigation links (4+): Home, Products, About, Contact
- **Sticky** (stays on top when scrolling)
- **Responsive** — hamburger menu on mobile
- **When logged out:** Show Login and Register buttons
- **When logged in:** Show a dropdown with:
  - Logged-in user's name/email
  - Add Product → `/products/add`
  - Manage Products → `/products/manage`
  - Logout button

---

#### Section 2 — Hero

- Headline (e.g., _"The Soul of the Orient, Bottled for You"_)
- Subtitle (1–2 sentences about Oud.co)
- Primary CTA button → links to `/products`
- Optional background image or gradient

---

#### Section 3 — Featured Products

- Section title (e.g., _"Bestsellers"_)
- Show 4–6 product cards
- Each card: image, name, short description, price, "View Details" button
- Responsive grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Uniform card height, hover effect

---

#### Section 4 — Why Choose Us (Features)

- Section title (e.g., _"Why Oud.co?"_)
- 4 feature cards, each with an icon, title, and short description
- Example features:
  - 100% Pure & Natural Oils
  - Sourced from Arabian Peninsula
  - Long-lasting Fragrance
  - Free Delivery on Orders Over ৳2000

---

#### Section 5 — Testimonials

- Section title (e.g., _"What Our Customers Say"_)
- 3–4 testimonial cards, each with:
  - Customer name
  - Star rating
  - Short quote

---

#### Section 6 — Promotional Banner

- Full-width banner with a bold message
- Example: _"Explore Our New Arrivals"_
- CTA button linking to `/products`

---

#### Section 7 — Footer

- Logo and short tagline
- Navigation links (Home, Products, About, Contact)
- Optional social media icons
- Copyright text: `© 2025 Oud.co. All rights reserved.`
- Responsive layout

---

### 2. Products Page (`/products`)

- **Search bar** — filters products by name in real-time
- **Filters — minimum 2 fields:**
  - Filter by **Category** (e.g., Oud, Rose, Musk, Floral, Oriental)
  - Filter by **Price Range** (e.g., Under ৳500, ৳500–১000, Above ৳1000)
- **Minimum 6 products** displayed (from static data in `lib/products.ts`)
- Responsive grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)

#### Each Product Card must include:

- Product image
- Category badge
- Title
- Short description (1–2 lines)
- Price
- "View Details" button → navigates to `/products/[id]`
- Uniform card height with hover effect

---

### 3. Product Details Page (`/products/[id]`)

- Dynamic route using Next.js App Router `[id]` segment
- **Back button** → returns to `/products`

#### Must display:

- Product image
- Title
- Category and price
- Short description
- Full description
- Key specifications (e.g., Volume, Notes, Origin, Longevity)
- Related products — 2–4 cards from the same category (optional)

---

### 4. About Page (`/about`)

- Page title (e.g., _"Our Story"_)
- 2–3 paragraphs about Oud.co's mission and values
- Optional image or decorative section

---

### 5. Authentication (`/login` & `/register`)

#### Firebase Setup Required:

- Enable **Email/Password** sign-in
- Enable **Google** sign-in (recommended)

#### `/login` Page:

- Email input
- Password input
- Login with Google button
- Link to `/register`
- On success: redirect to `/`
- Show error message if login fails

#### `/register` Page:

- Display name input
- Email input
- Password input
- Link to `/login`
- On success: redirect to `/`

#### Auth State:

- Use **React Context API** to manage user state globally
- Use Firebase `onAuthStateChanged` to persist login state
- Provide `user`, `loading`, `logout()` via context

---

### 6. Add Product — Protected (`/products/add`)

> ⚠️ Redirect unauthenticated users to `/login`

#### Form Fields:

| Field             | Type            | Required      |
| ----------------- | --------------- | ------------- |
| Title             | Text input      | ✅ Yes        |
| Short Description | Text input      | ✅ Yes        |
| Full Description  | Textarea        | ✅ Yes        |
| Category          | Select dropdown | ✅ Yes        |
| Price (৳)         | Number input    | ✅ Yes        |
| Image URL         | Text input      | No (optional) |

#### Behavior:

- Show validation errors if required fields are empty
- Submit button shows loading state while saving
- On success: show a **toast/confirmation message**
- Save product to **localStorage**

---

### 7. Manage Products — Protected (`/products/manage`)

> ⚠️ Redirect unauthenticated users to `/login`

- List all products in a **table (desktop)** or **card grid (mobile)**
- Each row/card shows: image, name, category, price
- Each row/card has two action buttons:
  - **View** → navigates to `/products/[id]`
  - **Delete** → removes product from localStorage, shows confirmation

---

## 🗂 Static Product Data

Define at least **6 products** in `lib/products.ts`. Each product must have:

```js
{
  id: "1",
  title: "Royal Oud Al-Maliki",
  shortDescription: "A rich and deep oud fragrance.",
  fullDescription: "Full paragraph description...",
  category: "Oud",
  price: 1850,
  imageUrl: "https://...",
  rating: 4.8,
  volume: "12ml",
  origin: "Saudi Arabia",
  longevity: "12–16 hours",
  notes: "Oud, Amber, Sandalwood"
}
```

Suggested products:

1. Royal Oud Al-Maliki — Oud, ৳1,850
2. Taif Rose Elixir — Rose, ৳1,200
3. Black Musk Noir — Musk, ৳950
4. Amber Oriental — Oriental, ৳1,450
5. Jasmine Dream — Floral, ৳780
6. Sandalwood Serenity — Woody, ৳1,100

---

## 🎨 Basic UI Guidelines

- **Consistent color palette** — suggested: deep dark background, gold accent (`#C9A84C`), warm ivory for cards
- **Consistent typography** — one font for headings, one for body text
- **All cards** — uniform height, hover effect (slight lift or shadow)
- **All buttons** — visible hover and focus states
- **Forms** — show inline error messages below invalid fields
- **Responsive** — must work on mobile, tablet, and desktop

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/oud-co.git
cd oud-co

# 2. Install dependencies
npm install

# 3. Add environment variables
# Create .env.local and paste your Firebase config

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Professional Delivery Checklist

Use this checklist before production deployment:

- [ ] All pages render correctly on mobile, tablet, desktop
- [ ] Firebase Email/Password auth works
- [ ] Firebase Google auth works
- [ ] Protected routes redirect correctly when logged out
- [ ] Add Product form validates required fields
- [ ] Add Product saves data to localStorage
- [ ] Manage Products can view and delete custom products
- [ ] Product details route `/products/[id]` works for static and custom products
- [ ] No ESLint or TypeScript errors
- [ ] `npm run build` completes without errors

---

## 🔐 What You Must Provide (Input Checklist)

To complete final production setup, provide:

1. Firebase Project Configuration:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

2. Firebase Console Access Setup:

- Enable Email/Password sign-in
- Enable Google sign-in
- Add authorized domain(s) for deployment

3. Branding Assets (optional but recommended):

- Final logo (SVG/PNG)
- Favicon
- Social media URLs
- Contact email and phone

4. Deployment Target:

- Preferred platform: Vercel (recommended) or Firebase Hosting
- Production domain name (if custom)

---

## 🚢 Deployment Hardening Steps

Before go-live:

1. Set all Firebase env variables in hosting platform settings.
2. Run:

- `npm run lint`
- `npm run build`

3. Verify protected routes and auth flows in production mode.
4. Confirm there are no browser console errors on key pages.
5. Add fallback monitoring:

- Vercel Analytics / basic uptime check

6. Keep rollback option ready by preserving previous deployment snapshot.

---

_© 2025 Oud.co — Where Every Drop Tells a Story._
