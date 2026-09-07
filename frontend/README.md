# DairyFresh Frontend Web Application

A responsive, high-performance web storefront and administrative control suite for the **DairyFresh Farm-to-Table Organic Dairy Platform**. Built with **React 18**, **Vite 6**, **Tailwind CSS**, and **Redux Toolkit**.

---

## 🌟 Key Features & Design Highlights

### 🥛 Customer Storefront Experience
- **Interactive 360° Product Viewer**: Signature 36-frame rotational viewer with smooth mouse drag, touch swipe, velocity dampening, auto-spin toggle, and fullscreen modal inspection.
- **Organic Catalog & Faceted Search**: Multi-category filter, live price range slider, in-stock only toggle, and sorting by price or newest arrivals.
- **Nutritional & Lab Purity Details**: Comprehensive breakdown of certified lab test results, storage conditions, and nutritional facts per serving.
- **Smart Shopping Basket**: Dynamic free-delivery progress meter (unlocked at ₹500+), coupon code support, and server-synchronized totals.
- **Customer Wishlist**: Quick save favorites and move items directly into the cart with one click.
- **Streamlined Checkout & Orders**: Delivery address management, Razorpay payment processing or Cash on Delivery, order confirmation with celebratory confetti.
- **Popup-Free Order Cancellation**: Interactive cancellation modal allowing customers to pick a cancellation reason and submit improvement feedback, with zero intrusive browser alert dialogs.

### 🛡️ Dedicated Administrator Operations Portal
- **Isolated Admin Portal Login** ([`/admin/login`](file:///d:/Ecommerce/frontend/src/pages/AdminLogin.jsx)): Sleek dark operations portal theme with **strictly NO "Create Account" or public registration link**.
- **AdminRoute Guard**: Automatically intercepts unauthenticated or non-admin attempts to access `/admin/*` and redirects them to the admin portal.
- **Prominent Header & Sidebar Logout**: Instantly accessible red/rose **Logout** button positioned in both the top header and the left sidebar.
- **Real-Time Analytics Dashboard**: Visual revenue metrics, order statuses, low-stock warnings, and recent transaction feeds.
- **Catalog & 360 Image Sequence Manager**: Add, edit, stock-adjust, and toggle active status for products.
- **Isolated User Management**:
  - **Tab 1: Customer Accounts**: Displays only verified customer profiles, contact info, and completed orders (0 admin contamination).
  - **Tab 2: Admin Team**: Displays platform administrators with an active **"+ Create New Admin"** modal.

---

## 🏗️ Technology Stack

- **Framework**: React v18.3.1
- **Build Tool**: Vite v6.2.1
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` v2.6) + `react-redux`
- **Routing**: React Router DOM v7.3.0
- **Styling**: Tailwind CSS v3.4.17 + Vanilla CSS
- **Iconography**: Lucide React (`lucide-react`)
- **Visual Micro-Interactions**: `canvas-confetti`
- **HTTP Client**: Axios with automatic JWT injection and 401 session purge interceptors

---

## 📂 Project Structure

```
frontend/
├── public/                     # Static assets & favicon
├── src/
│   ├── admin/                  # Administrative Suite
│   │   ├── AdminLayout.jsx     # Admin wrapper with Header, Sidebar & Logout buttons
│   │   ├── Dashboard.jsx       # Analytics KPI cards & sales charts
│   │   ├── Products.jsx        # Inventory list & stock toggles
│   │   ├── AddProduct.jsx      # Product creation form
│   │   ├── EditProduct.jsx     # Product edit form
│   │   ├── Categories.jsx      # Category management
│   │   ├── Orders.jsx          # Order fulfillment & status updates
│   │   └── Users.jsx           # Two-tab isolated Customers & Admin Team manager
│   ├── components/
│   │   ├── Navbar/             # Customer navigation, cart badge, mobile drawer
│   │   ├── Footer/             # Certification badges & farm links
│   │   ├── ProductCard/        # Catalog product card with 360 badge
│   │   ├── Product360Viewer/   # 36-frame rotational interactive viewer
│   │   ├── Rating/             # Star rating component
│   │   ├── ProtectedRoute/     # Customer authentication route guard
│   │   └── AdminRoute/         # Administrator route guard (redirects to /admin/login)
│   ├── pages/                  # Customer Pages
│   │   ├── Home.jsx            # Hero banner, 360 spotlight, categories, organic showcase
│   │   ├── Products.jsx        # Catalog with search & filter sidebar
│   │   ├── ProductDetails.jsx  # Nutrition, purity certificate, and customer reviews
│   │   ├── Cart.jsx            # Shopping cart with free-shipping meter
│   │   ├── Checkout.jsx        # Multi-step checkout with address selection
│   │   ├── OrderSuccess.jsx    # Celebration confetti & order summary
│   │   ├── MyOrders.jsx        # Customer order history
│   │   ├── OrderDetails.jsx    # Order tracking timeline & popup-free cancellation modal
│   │   ├── Wishlist.jsx        # Saved items grid
│   │   ├── Profile.jsx         # Customer profile management
│   │   ├── Login.jsx           # Customer sign in with "Create Account (Join Farm)"
│   │   ├── Register.jsx        # Customer account creation
│   │   ├── AdminLogin.jsx      # Dedicated Admin portal (no create account)
│   │   └── NotFound.jsx        # 404 page
│   ├── services/
│   │   └── api.js              # Centralized Axios instance with auth interceptors
│   ├── store/
│   │   ├── store.js            # Redux store configuration
│   │   ├── authSlice.js        # Authentication state, login, register, getMe, logout
│   │   ├── cartSlice.js        # Basket items, quantities, totals computation
│   │   ├── wishlistSlice.js    # Saved products
│   │   └── productSlice.js     # Catalog caching & active filters
│   ├── App.jsx                 # Route definitions & scroll restoration
│   ├── main.jsx                # React root mount with Redux Provider
│   └── index.css               # Global typography, colors, and animations
├── package.json
├── tailwind.config.js          # Custom dairy color tokens, font families, shadows
└── vite.config.js              # Vite server & API proxy configuration
```

---

## 🚦 Routing Matrix

| Route | Access | Component | Purpose |
|---|---|---|---|
| `/` | Public | `Home.jsx` | Landing page with Hero, 360 viewer, and top products |
| `/products` | Public | `Products.jsx` | Full dairy catalog with multi-facet filters |
| `/products/:id` | Public | `ProductDetails.jsx` | Detailed product specifications and 360 viewer |
| `/cart` | Public | `Cart.jsx` | Shopping cart with live shipping calculation |
| `/checkout` | Customer | `Checkout.jsx` | Address selection and payment flow |
| `/order-success/:id` | Customer | `OrderSuccess.jsx` | Order confirmation screen |
| `/orders` | Customer | `MyOrders.jsx` | Order history list |
| `/orders/:id` | Customer | `OrderDetails.jsx` | Step-by-step order tracking & cancellation |
| `/wishlist` | Public | `Wishlist.jsx` | Saved favorite products |
| `/profile` | Customer | `Profile.jsx` | Account settings and address management |
| `/login` | Public | `Login.jsx` | Customer sign in (has "Create Account" link) |
| `/register` | Public | `Register.jsx` | Customer registration |
| `/admin/login` | Public | `AdminLogin.jsx` | Dedicated Admin portal login (**strictly NO "Create Account"**) |
| `/admin` | Admin Only | `Dashboard.jsx` | Administrative analytics and metrics |
| `/admin/products` | Admin Only | `Products.jsx` | Inventory management |
| `/admin/products/add` | Admin Only | `AddProduct.jsx` | Add product to catalog |
| `/admin/products/edit/:id` | Admin Only | `EditProduct.jsx` | Modify product details |
| `/admin/categories`| Admin Only | `Categories.jsx` | Category taxonomy manager |
| `/admin/orders` | Admin Only | `Orders.jsx` | Order fulfillment and status dispatch |
| `/admin/users` | Admin Only | `Users.jsx` | Customer directory & Admin team onboarding |

---

## 🔧 Environment Configuration

Create a `.env` file in `frontend/` (optional for local development, as the Vite dev server automatically proxies `/api` requests to `http://localhost:5000`):

```env
# API Base URL (leave blank to use the Vite dev server proxy)
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Local Development & Scripts

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies using pnpm
pnpm install

# Start the Vite development server (port 5173)
pnpm dev

# Build for production (outputs to dist/)
pnpm build

# Preview production build locally
pnpm preview
```

Development server URL: **`http://localhost:5173`**
