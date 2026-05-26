<div align="center">

# Oud.co - Premium Attar and Perfume Oil E-commerce Web Application

<img src="./public/preview.png" width="800" alt="Oud.co project preview" />

<p>
  A polished full-stack e-commerce platform for premium attars and perfume oils, built with modern Next.js architecture, secure authentication, online payment support, inventory-aware admin tools, and printable invoice workflows.
</p>

</div>

## 🌐 Live Links

- Live link: https://oud-co.vercel.app
- Portfolio Link: https://maksudul-haque.vercel.app

## 📞 Contact

- Phone: +8801518474975
- Email: smamksudulhaque2000@gmail.com

## ✨ Project Overview

Oud.co is designed as a production-ready fragrance storefront with a professional buying experience for customers and a practical operations dashboard for admins. The application covers product discovery, cart management, checkout, payment verification, order tracking, invoice generation, user management, and detailed skeleton loading states to keep the interface stable while data is fetched.

This project combines a refined visual identity with reliable backend workflows. It is suitable for deployment as a live e-commerce site or as a portfolio-grade full-stack case study.

## 🚀 What This Application Does

- Presents premium fragrance products with a premium storefront experience
- Allows customers to search, filter, and inspect product details
- Supports cart-based ordering with profile-based autofill at checkout
- Accepts both Cash on Delivery and SSLCommerz online payments
- Verifies payments through validation and IPN-based fallback handling
- Stores products, orders, and user profiles in MongoDB
- Uses Firebase Authentication for sign-in, sign-up, Google login, and role-based access
- Gives admins control over products, users, order statuses, and invoice exports
- Generates professional PDF invoices for single orders and batch date ranges
- Uses layout-matched skeleton loading screens across the entire app

## 🧩 Key Features

### Customer Experience

- Modern landing page with featured products and brand storytelling
- Product catalog with live search and price/category filters
- Product details page with related items
- Persistent cart state for a smoother shopping journey
- Checkout page with prefilled customer name, email, phone, and address when available
- Order history page with payment and fulfillment visibility
- Payment success, fail, and cancel flows for gateway handling

### Admin Experience

- Dedicated dashboard for managing products, orders, and users
- Separate fulfillment and payment status controls for clearer operational handling
- Product add, edit, and delete workflows
- User role management for admin/customer access control
- Single-order invoice download
- Batch invoice download for today, last 1 month, and last 1 year
- Professional admin loading states matched to each page layout

### Reliability and UX

- Skeleton loading screens tailored to each route and layout
- Stable server-side PDF generation
- Deployment-safe build and lint workflow
- Role-aware route protection and access gating

## 🛠 Tech Stack

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React icons

### Backend and Data

- MongoDB for persistent application data
- Next.js route handlers for API endpoints
- Server-side PDF generation using PDFKit

### Authentication and Access Control

- Firebase Authentication
- Google sign-in support
- Role-based access control for admin routes

### Payments

- SSLCommerz payment gateway
- Payment initiation, validation, and IPN handling

### Deployment and Tooling

- Vercel deployment support
- ESLint
- TypeScript compiler checks

## 🗂 Project Structure

- `src/app` - App Router pages, route handlers, and route-level loading states
- `src/components` - Reusable UI components, skeletons, modals, and forms
- `src/context` - Auth, cart, products, and toast state providers
- `src/lib` - MongoDB, Firebase, payments, products, users, orders, and PDF helpers
- `src/types` - Shared TypeScript models and interfaces
- `public` - Static assets such as the hero image and preview image

## 📱 Main Pages

- Home page with featured products and brand sections
- Products catalog with search and filtering controls
- Product details page with related product recommendations
- Cart and checkout pages
- Login and registration pages
- Profile page for customer contact information
- Orders page for customer order history
- Admin users page
- Admin orders page
- Admin product management pages
- Payment success, failure, and cancellation pages

## 🔐 Admin Capabilities

- Add new products
- Edit existing product records
- Delete products with confirmation
- Update user roles
- Review order payment status
- Update fulfillment status independently from payment state
- Download PDFs for a single order
- Export PDFs for date-based batches

## 📄 Invoice and PDF Workflow

Invoice generation is handled server-side using PDFKit. The invoice system supports:

- Single invoice export from an order record
- Batch exports for predefined date ranges
- Print-friendly formatting for packing and operations
- Cleaner typography and spacing for readability

The PDF output is designed to be practical for admin use while still looking polished enough for customer-facing delivery documentation.

## ⏳ Loading Experience

The project uses page-specific skeleton screens instead of generic placeholder text. Each loading state is sized to match the real page layout as closely as possible so the interface does not jump when data arrives.

This includes:

- Storefront landing page loading
- Product grid loading
- Product detail loading
- Product management loading
- Add/edit product form loading
- Admin orders loading
- Admin users loading
- Checkout, profile, login, register, and payment verification loading

## 🔧 Environment Variables

Create a `.env.local` file in the project root and configure the following values:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SITE_URL=https://oud-co.vercel.app
NEXT_PUBLIC_CURRENCY=BDT
NEXT_PUBLIC_ADMIN_EMAILS=email1@example.com,email2@example.com
NEXT_PUBLIC_ADMIN_UIDS=uid1,uid2

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id

SSL_COMMERZ_STORE_ID=your_sslcommerz_store_id
SSL_COMMERZ_STORE_PASSWORD=your_sslcommerz_store_password
SSL_COMMERZ_IS_TEST=true
```

### Variable Notes

- `MONGODB_URI` connects the app to MongoDB.
- `NEXT_PUBLIC_SITE_URL` should match the deployed domain in production.
- `NEXT_PUBLIC_ADMIN_EMAILS` and `NEXT_PUBLIC_ADMIN_UIDS` are used for bootstrap admin access.
- Firebase values are required for authentication and profile workflows.
- SSLCommerz values are required for payment initiation and validation.
- Set `SSL_COMMERZ_IS_TEST=false` only when moving to live payment mode.

## 🧪 Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create `.env.local` and paste the values listed above.

### 3. Start the development server

```bash
npm run dev
```

The application will run on the default Next.js development port.

## 🏗 Production Commands

```bash
npm run build
npm run start
```

## ✅ Quality Checks

```bash
npm run lint
npm run deploy:check
```

`npm run deploy:check` runs linting first and then executes the production build.

## 🚢 Deployment Notes

- The app is ready for deployment on Vercel.
- Configure all environment variables in Vercel before deploying.
- Make sure Firebase authorized domains include the live domain.
- Ensure SSLCommerz callback, success, fail, cancel, and IPN URLs resolve correctly in production.
- Verify that MongoDB connectivity is available from the deployment environment.

## 🧠 Technical Notes

- MongoDB access is implemented through shared helpers in `src/lib/mongodb.ts` and the related collection modules.
- Firebase Authentication is initialized on the client side through the auth context.
- PDF invoices are generated on the server and returned as downloadable attachments.
- Route-level loading states are implemented with layout-aware skeletons to reduce layout shift.
- Admin pages use protected routing and role-aware access checks.

## 🧭 Useful Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create the production build
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run deploy:check` - Run lint and build together

## 📷 Visual Identity

The interface uses a dark luxury theme with gold accents, soft gradients, and page-specific loading skeletons. The goal is to keep the application feeling premium, stable, and visually coherent while still remaining fast and practical.

## 📌 Summary

Oud.co is a full-featured, portfolio-ready e-commerce solution that combines premium visual design with production-minded backend workflows. It is built to support real customer shopping, admin operations, payment verification, and invoice generation in a single integrated system.

## 📜 License

This project is provided for commercial and personal portfolio use by the owner.
