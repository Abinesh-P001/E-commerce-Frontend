# DairyFresh — Complete Farm-to-Table Dairy E-Commerce Platform

A production-ready, full-stack Dairy Products E-Commerce web application built with a **Node.js + Express + Prisma + MySQL** backend and a modern **React + Vite + Tailwind CSS + Redux Toolkit** frontend featuring a signature **360-degree interactive product viewer**.

---

## 🌟 Key Features

### 🥛 Customer Experience
- **Organic Dairy Catalog**: Browse 10 dairy categories (Milk, Curd & Yogurt, Butter, Cheese, Paneer, Ghee, Cream, Buttermilk, Lassi, Flavoured Milk).
- **Interactive 360° Product Viewer**: 36 sequential frame viewer with smooth mouse drag, touch swipe, velocity dampening, auto-spin mode, and fullscreen inspection.
- **Search & Multi-Facet Filtering**: Category checkboxes, price range slider, in-stock only, and sorting by newest/price.
- **Nutritional & Purity Breakdown**: Comprehensive tables for ingredients, storage instructions, and certified laboratory facts.
- **Shopping Basket**: Real-time totals computed securely on backend, free shipping meter progress bar (unlocked above ₹500).
- **Customer Wishlist**: Save favorite items and move them directly to the cart with one click.
- **Multi-Address Book**: Manage multiple delivery addresses with default indicators.
- **Secure Checkout & Payments**: Razorpay payment integration with automated signature verification and Cash on Delivery option.
- **Visual Order Tracking**: Step-by-step progress tracking (`CONFIRMED` → `PROCESSING` → `SHIPPED` → `DELIVERED`), with cancellation capabilities for pending orders.
- **Verified Customer Reviews**: Rate and review products.

### 🛡️ Administrator Operations
- **Analytics Dashboard**: Real-time metrics for Total Revenue, Total Orders, Active Catalog Items, Low-Stock alerts, and monthly sales trends.
- **Catalog Management**: Add, edit, delete products, toggle active status, and adjust stock quantities.
- **360° Sequence Manager**: Upload and manage multi-frame sequences (up to 36 frames) with live interactive preview.
- **Category Management**: Create and manage dairy categories and descriptions.
- **Order Fulfillment**: Update order status (`PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) with automatic customer timeline synchronization.
- **Customer Directory**: View customer profiles, contact info, and completed order history.

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, Vanilla CSS
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Celebration Animations**: Canvas Confetti
- **HTTP Client**: Axios with JWT request/response interceptors

### Backend
- **Runtime**: Node.js (v24.20.0, ESM `"type": "module"`)
- **Framework**: Express.js
- **Database & ORM**: MySQL 8.0, Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing
- **Security**: Helmet, CORS, Cookie Parser
- **File Uploads**: Multer with local storage and Cloudinary integration support
- **Payments**: Razorpay Node SDK with cryptographic HMAC signature verification

---

## 🚀 Quick Start Guide

### 1. Database Setup
Ensure MySQL 8.0 is running on port 3306:
```bash
# Database: Dairy_Fresh_Product

```

### 2. Backend Setup
```bash
cd backend
pnpm install
npx prisma generate
npx prisma db push
node prisma/seed.js
pnpm dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
# App runs on http://localhost:5173
```

---

## 🔑 Clean Authentication (No Demo Credentials)

The database and application have zero hardcoded demo credentials:
- Visit **`/register`** to register your personal account.
- **The first user who registers automatically receives the `ADMIN` role** and full access to the Admin Portal (`/admin`).
- All subsequent registered users receive the standard `CUSTOMER` role.

---

## 📂 Project Structure

```
d:/Ecommerce/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # 13 relational Prisma models
│   │   └── seed.js             # Comprehensive database seeder
│   ├── src/
│   │   ├── config/             # Database (Prisma), Cloudinary, Razorpay
│   │   ├── controllers/        # Auth, Product, Cart, Order, Payment, Admin, etc.
│   │   ├── middleware/         # Auth, AdminOnly, Error, Upload
│   │   ├── routes/             # REST API routers
│   │   ├── utils/              # Token generation, response formatters, 360 generators
│   │   ├── app.js              # Express app setup & middleware
│   │   └── server.js           # Server entrypoint with graceful shutdown
│   ├── uploads/360/            # 72 generated 360-degree rotation SVG frames
│   ├── tests/e2e.test.js       # 11-step automated integration test suite
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── admin/              # Dashboard, Products, AddProduct, EditProduct, Orders, Users
│   │   ├── components/
│   │   │   ├── Navbar/         # Top bar with search, badges, mobile drawer
│   │   │   ├── Footer/         # Certification badges, newsletter, links
│   │   │   ├── ProductCard/    # Card with ratings, stock status, 360 badge
│   │   │   ├── Product360Viewer/ # Signature 36-frame interactive viewer
│   │   │   └── Rating/         # Star rating component
│   │   ├── pages/              # Home, Products, ProductDetails, Cart, Checkout, etc.
│   │   ├── services/           # Axios API service
│   │   ├── store/              # Redux slices (auth, cart, wishlist, products)
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # React root with Redux provider
│   │   └── index.css           # Custom styles and scrollbars
│   ├── package.json
│   └── vite.config.js          # Vite config with backend proxy
├── docker-compose.yml
└── README.md
```

---

## 🧪 Testing & Verification

Run the automated end-to-end verification suite:
```bash
cd backend
node tests/e2e.test.js
```
The test suite validates:
1. Frontend server response & branding
2. Backend health status
3. Category taxonomy
4. Products & 36-frame 360° image assets
5. Customer authentication
6. Cart operations, totals, and stock limits
7. Address management
8. Atomic order creation & inventory decrement
9. Cryptographic payment verification
10. Admin analytics & dashboard KPIs
11. Admin order status transitions
