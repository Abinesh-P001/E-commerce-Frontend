# DairyFresh Backend REST API Engine

Production-grade, high-leverage REST API service powering the **DairyFresh Farm-to-Table E-Commerce Platform**. Built with **Node.js (ESM)**, **Express.js**, **Prisma ORM (v6)**, and **MySQL 8.0** (`Dairy_Fresh_Product`).

---

## 🏗️ Architecture & Technology Stack

- **Runtime**: Node.js v24.20.0 (Native ECMAScript Modules `"type": "module"`)
- **Framework**: Express.js v4.21.2
- **ORM & Database**: Prisma ORM v6.4.1 + MySQL 8.0 (`Dairy_Fresh_Product`)
- **Authentication**: JWT (`jsonwebtoken`) with `bcryptjs` (salt rounds: 10)
- **Security & Hardening**: `helmet`, `cors`, `cookie-parser`, `express-validator`
- **File & Media Handling**: `multer` with local static serving and Cloudinary SDK
- **Payment Processing**: Razorpay Node SDK with cryptographic HMAC SHA-256 signature verification
- **Asset Engine**: Automated 36-frame interactive 360-degree rotation SVG frame generator

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection (MySQL 8.0)
DATABASE_URL="mysql://root:root@localhost:3306/Dairy_Fresh_Product"

# JWT Authentication
JWT_SECRET=dairyfresh_jwt_super_secret_production_key_2026
JWT_EXPIRES_IN=7d

# Razorpay Payment Gateway (Optional in Demo / Mock mode)
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret

# Cloudinary Storage (Optional - falls back to local /uploads)
CLOUDINARY_CLOUD_NAME=dairyfresh
CLOUDINARY_API_KEY=placeholder_api_key
CLOUDINARY_API_SECRET=placeholder_api_secret
```

---

## 🗄️ Database Schema & Relational Models

The MySQL database **`Dairy_Fresh_Product`** consists of 13 Prisma models defined in [`prisma/schema.prisma`](file:///d:/Ecommerce/backend/prisma/schema.prisma):

| Model | Description |
|---|---|
| `User` | Customer and Administrator identities with hashed passwords, contact info, and roles (`CUSTOMER`, `ADMIN`). |
| `Address` | Shipping and billing addresses with default indicator flags and coordinates. |
| `Category` | Taxonomy classification with slug, cover image, and metadata. |
| `Product` | Dairy inventory with price, stock, SKU, nutritional facts, storage instructions, and 360 capabilities. |
| `ProductImage`| Gallery photos associated with each dairy product. |
| `Product360Frame` | 36 sequential frame assets enabling smooth 360° interactive rotation. |
| `Cart` & `CartItem` | Customer shopping basket with live server-side price computation. |
| `Wishlist` & `WishlistItem` | Customer saved items. |
| `Order` & `OrderItem` | Atomic orders with status lifecycle (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), tracking numbers, and cancellation reason / suggestions. |
| `Review` | Customer product ratings (1-5 stars) and feedback. |

### Prisma CLI Workflow

```bash
# Generate Prisma Client
pnpm prisma:generate

# Sync schema with MySQL database
npx prisma db push

# Seed sample dairy catalog, categories, and 360-degree asset sequences
pnpm prisma:seed

# Inspect database visually in browser
pnpm prisma:studio
```

---

## 🔐 Core Business Logic & Security

### 1. Customer vs Admin Authentication Isolation
- **`POST /api/auth/register`**: Registers customers. The very first user created in a fresh database automatically receives the `ADMIN` role; all subsequent users receive `CUSTOMER`.
- **`POST /api/auth/login`**: Authenticates customers. Returns user profile and JWT.
- **`POST /api/auth/admin-login`**: Dedicated Administrator portal authentication. Rejects non-admin users with `403 Forbidden` (*"Access denied. You do not have administrator privileges."*).

### 2. Admin & Customer Data Isolation
- **`GET /api/admin/users`**: Strictly queries `where: { role: 'CUSTOMER' }`. Administrator profiles are **never** returned or mixed into customer lists.
- **`GET /api/admin/administrators`**: Dedicated endpoint returning only administrator team members.
- **`POST /api/admin/create-admin`**: Allows logged-in administrators to create and onboard new Administrators directly from the admin dashboard.

### 3. Popup-Free Order Cancellation with Audit Trail
- **`PUT /api/orders/:id/cancel`**: Customers can cancel orders that have not yet been dispatched.
- Accepts `{ reason: string, suggestion?: string }` in the request body.
- Atomically restores product inventory stock.
- Stores `cancelReason` and `cancelSuggestion` in the database for fulfillment analytics.

---

## 📡 Complete REST API Endpoint Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new customer account
- `POST /api/auth/login` — Sign in as customer
- `POST /api/auth/admin-login` — Sign in to the administrator portal
- `GET  /api/auth/me` — Retrieve currently authenticated user profile
- `PUT  /api/auth/update-profile` — Update user details
- `PUT  /api/auth/change-password` — Change account password
- `POST /api/auth/logout` — Invalidate session

### Categories (`/api/categories`)
- `GET  /api/categories` — List all active dairy categories
- `GET  /api/categories/:slug` — Get category details with products

### Products (`/api/products`)
- `GET  /api/products` — Browse products with search, category filtering, price range, and sorting
- `GET  /api/products/featured` — Retrieve featured showcase products
- `GET  /api/products/:id` — Get single product details, nutrition breakdown, and 360 frames

### Shopping Cart (`/api/cart`)
- `GET    /api/cart` — Get active customer cart and computed totals
- `POST   /api/cart/add` — Add item to cart with stock validation
- `PUT    /api/cart/update` — Update item quantity
- `DELETE /api/cart/remove/:productId` — Remove product from cart
- `DELETE /api/cart/clear` — Empty cart

### Wishlist (`/api/wishlist`)
- `GET    /api/wishlist` — Get customer wishlist
- `POST   /api/wishlist/toggle` — Add or remove product from wishlist

### Orders & Tracking (`/api/orders`)
- `GET  /api/orders` — List current customer's order history
- `GET  /api/orders/:id` — Order status, shipping details, and cancellation metadata
- `POST /api/orders` — Place order (validates stock atomically and clears cart)
- `PUT  /api/orders/:id/cancel` — Cancel order with reason & optional suggestion

### Payments (`/api/payments`)
- `POST /api/payments/create-order` — Initialize Razorpay payment order
- `POST /api/payments/verify` — Verify cryptographic HMAC SHA-256 signature

### Administrator Management (`/api/admin`) *(Requires ADMIN role)*
- `GET    /api/admin/dashboard` — Revenue KPIs, orders count, low stock items, sales graph
- `GET    /api/admin/products` — Full inventory table with stock adjustment
- `POST   /api/admin/products` — Create new product with image uploads
- `PUT    /api/admin/products/:id` — Edit product details and inventory
- `DELETE /api/admin/products/:id` — Delete product
- `GET    /api/admin/orders` — Manage all customer orders
- `PUT    /api/admin/orders/:id/status` — Update order progress (`PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
- `GET    /api/admin/users` — List verified customers only (zero admins)
- `GET    /api/admin/administrators` — List administrator team members
- `POST   /api/admin/create-admin` — Create a new Administrator account

---

## 🧪 Automated Testing

An automated 15-step integration and end-to-end test suite validates the entire API against `Dairy_Fresh_Product`:

```bash
# Run automated verification suite
node tests/e2e.test.js
```

### Verified Test Cases
1. Frontend HTTP Server Availability (Port 5173)
2. Backend Health Status (Port 5000)
3. Category Taxonomy Retrieval
4. Products & 36-Frame 360° Sequence Verification
5. ADMIN Authentication & Privileges
6. Second User Registration (CUSTOMER Role Assignment)
7. Customer Address Creation & Management
8. Cart Operations & Dynamic Totals Computation
9. Atomic Order Placement & Inventory Reservation
10. Cryptographic Payment Verification
11. Admin Analytics & Status Transitions
12. Admin Login Guard (403 Forbidden for Customers)
13. Customer vs Administrator Data Isolation
14. In-Dashboard Administrator Creation
15. Order Cancellation with Stored Reason & Suggestion

---

## 🚀 Running the Server

```bash
# Install dependencies
pnpm install

# Start in watch mode for development
pnpm dev

# Start in production mode
pnpm start
```
Default Server URL: **`http://localhost:5000`**
