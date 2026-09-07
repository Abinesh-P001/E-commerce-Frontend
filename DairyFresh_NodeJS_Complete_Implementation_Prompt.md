# DairyFresh — Dairy Products E-Commerce Platform
## Complete Node.js Backend + React Frontend Implementation Prompt

---

## 1. PROJECT OBJECTIVE

Build a complete production-ready full-stack Dairy Products E-Commerce Website.

Customers should be able to:

- Register and log in
- Browse dairy products
- Search products
- Filter and sort products
- View detailed product information
- Rotate products using a 360-degree image viewer
- Add products to cart
- Update cart quantities
- Add products to wishlist
- Checkout
- Manage delivery addresses
- Pay using Razorpay
- View order history
- Track order status
- Submit product reviews

Administrators should be able to:

- Manage products
- Manage categories
- Upload product images
- Upload 360-degree product images
- Manage inventory
- Manage customers
- Manage orders
- Update order status
- View sales analytics

The application should look like a modern premium dairy brand rather than a basic CRUD application.

---

# 2. TECHNOLOGY STACK

## Frontend

- React.js
- Vite
- JavaScript or TypeScript
- React Router DOM
- Axios
- Tailwind CSS
- Redux Toolkit
- React Redux
- React Hook Form
- Framer Motion
- Recharts
- Lucide React
- React 360/image-sequence viewer

## Backend

- Node.js
- Express.js
- JavaScript or TypeScript
- Prisma ORM
- MySQL
- JWT
- bcrypt
- express-validator or Zod
- Multer
- Cloudinary
- Razorpay
- Helmet
- CORS
- Morgan
- dotenv

## Development Tools

- VS Code
- Git
- GitHub
- Postman
- MySQL Workbench
- npm
- Docker

## Deployment

Frontend:
- Vercel or Netlify

Backend:
- Render or Railway

Database:
- Managed MySQL database

Images:
- Cloudinary

---

# 3. HIGH-LEVEL ARCHITECTURE

React Frontend
        ↓
Redux Toolkit
        ↓
Axios
        ↓
Express REST API
        ↓
Middleware
        ↓
Controllers
        ↓
Services
        ↓
Prisma ORM
        ↓
MySQL

External Services:

Express Backend
    ├── Cloudinary → Product images
    └── Razorpay → Payments

---

# 4. COMPLETE PROJECT STRUCTURE

dairy-ecommerce/
│
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── banners/
│   │   │   └── icons/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── ProductCard/
│   │   │   ├── ProductGrid/
│   │   │   ├── Product360Viewer/
│   │   │   ├── SearchBar/
│   │   │   ├── CategoryCard/
│   │   │   ├── CartItem/
│   │   │   ├── Rating/
│   │   │   ├── Modal/
│   │   │   ├── Loader/
│   │   │   ├── ProtectedRoute/
│   │   │   └── AdminRoute/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── CategoryProducts.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Addresses.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   ├── EditProduct.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Analytics.jsx
│   │   │
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── productSlice.js
│   │   │   ├── cartSlice.js
│   │   │   └── wishlistSlice.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   └── paymentService.js
│   │   │
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── layouts/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   └── razorpay.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── reviewController.js
│   │   │   ├── wishlistController.js
│   │   │   ├── addressController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   ├── paymentService.js
│   │   │   ├── imageService.js
│   │   │   └── analyticsService.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── wishlistRoutes.js
│   │   │   ├── addressRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── adminMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   │
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── productValidator.js
│   │   │   ├── orderValidator.js
│   │   │   └── reviewValidator.js
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   ├── calculateTotal.js
│   │   │   └── pagination.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── product.test.js
│   │   ├── cart.test.js
│   │   └── order.test.js
│   │
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── docker-compose.yml
├── README.md
└── .gitignore

---

# 5. DATABASE DESIGN

Use MySQL with Prisma ORM.

## User

Fields:
- id
- name
- email
- password
- phone
- role
- createdAt
- updatedAt

Roles:
- CUSTOMER
- ADMIN

## Category

Fields:
- id
- name
- description
- image
- createdAt

## Product

Fields:
- id
- name
- slug
- description
- price
- discountPrice
- stock
- weight
- unit
- ingredients
- nutrition
- storageInstructions
- deliveryInformation
- mainImage
- active
- categoryId
- createdAt
- updatedAt

## ProductImage

Fields:
- id
- productId
- imageUrl
- imageIndex
- imageType
- createdAt

imageType:
- MAIN
- GALLERY
- VIEW_360

## Cart

Fields:
- id
- userId
- createdAt
- updatedAt

## CartItem

Fields:
- id
- cartId
- productId
- quantity
- price

## Address

Fields:
- id
- userId
- fullName
- phone
- addressLine
- city
- state
- pincode
- isDefault

## Order

Fields:
- id
- userId
- addressId
- totalAmount
- shippingAmount
- discountAmount
- orderStatus
- paymentStatus
- createdAt
- updatedAt

Order statuses:
- PENDING
- CONFIRMED
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

## OrderItem

Fields:
- id
- orderId
- productId
- quantity
- price

## Payment

Fields:
- id
- orderId
- razorpayOrderId
- razorpayPaymentId
- amount
- paymentMethod
- paymentStatus
- createdAt

## Review

Fields:
- id
- userId
- productId
- rating
- comment
- createdAt

## Wishlist

Fields:
- id
- userId

## WishlistItem

Fields:
- id
- wishlistId
- productId

---

# 6. DATABASE RELATIONSHIPS

User 1 → N Orders
User 1 → 1 Cart
User 1 → 1 Wishlist
User 1 → N Addresses
User 1 → N Reviews

Category 1 → N Products

Product 1 → N ProductImages
Product 1 → N Reviews

Cart 1 → N CartItems
CartItem N → 1 Product

Order 1 → N OrderItems
OrderItem N → 1 Product

Order 1 → 1 Payment

Wishlist 1 → N WishlistItems
WishlistItem N → 1 Product

---

# 7. INITIAL DAIRY CATEGORIES

Create:

- Milk
- Curd
- Butter
- Cheese
- Paneer
- Ghee
- Cream
- Buttermilk
- Lassi
- Flavoured Milk

Add realistic demo products for each category.

---

# 8. AUTHENTICATION

Implement:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

Use:

- JWT
- bcrypt password hashing
- Role-based authorization
- Protected routes
- Admin routes

Never store plain-text passwords.

For production, prefer secure HTTP-only cookies for refresh/session handling and keep access-token handling appropriately secured.

---

# 9. PRODUCT API

GET /api/products
GET /api/products/:id
GET /api/products/category/:categoryId
GET /api/products/search?keyword=
GET /api/products?minPrice=&maxPrice=
GET /api/products?sort=price_asc
GET /api/products?page=1&limit=12

Admin:

POST /api/admin/products
PUT /api/admin/products/:id
DELETE /api/admin/products/:id
PATCH /api/admin/products/:id/stock

---

# 10. CATEGORY API

GET /api/categories

Admin:

POST /api/admin/categories
PUT /api/admin/categories/:id
DELETE /api/admin/categories/:id

---

# 11. CART API

GET /api/cart
POST /api/cart/items
PUT /api/cart/items/:id
DELETE /api/cart/items/:id
DELETE /api/cart/clear

Rules:

- User must be authenticated.
- Quantity must be positive.
- Quantity cannot exceed available stock.
- Calculate totals on the backend.
- Never trust price values supplied by the frontend.

---

# 12. WISHLIST API

GET /api/wishlist
POST /api/wishlist/:productId
DELETE /api/wishlist/:productId

---

# 13. ADDRESS API

GET /api/addresses
POST /api/addresses
PUT /api/addresses/:id
DELETE /api/addresses/:id

---

# 14. ORDER API

POST /api/orders
GET /api/orders
GET /api/orders/:id
PUT /api/orders/:id/cancel

Admin:

GET /api/admin/orders
PUT /api/admin/orders/:id/status

Order flow:

Customer
→ Cart
→ Checkout
→ Address
→ Backend validates stock
→ Backend calculates total
→ Payment
→ Payment verification
→ Order confirmation
→ Stock update
→ Admin processing
→ Shipping
→ Delivery

Use Prisma transactions for operations that must update multiple records atomically.

---

# 15. RAZORPAY PAYMENT

Implement:

POST /api/payment/create-order
POST /api/payment/verify

Flow:

React Checkout
        ↓
Backend creates Razorpay order
        ↓
Razorpay Checkout
        ↓
Customer Payment
        ↓
Razorpay returns payment details
        ↓
Backend verifies signature
        ↓
Payment status updated
        ↓
Order confirmed

Important:

- Never trust the amount from the frontend.
- Calculate the amount from the database.
- Verify Razorpay signatures on the backend.
- Store only required payment identifiers.
- Never store card information.

Use environment variables:

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET

---

# 16. CLOUDINARY IMAGE STORAGE

Use Cloudinary for production image storage.

Product images:

- Main image
- Gallery images
- 360-degree images

Backend upload flow:

React Admin
    ↓
Multipart/FormData
    ↓
Express + Multer
    ↓
Cloudinary
    ↓
Image URL
    ↓
ProductImage table

Do not store large image binary data directly in MySQL.

---

# 17. 360-DEGREE PRODUCT VIEWER

This is a core feature.

Each product should support approximately 36 images.

Example:

products/
    milk-001/
        360/
            01.jpg
            02.jpg
            03.jpg
            ...
            36.jpg

Database:

ProductImage

id | productId | imageUrl | imageIndex | imageType

Example:

1 | 101 | cloudinary-url-01 | 1 | VIEW_360
2 | 101 | cloudinary-url-02 | 2 | VIEW_360
...
36 | 101 | cloudinary-url-36 | 36 | VIEW_360

Create:

Product360Viewer.jsx

Requirements:

- 36 image support
- Mouse drag
- Touch swipe
- Autoplay
- Pause
- Fullscreen
- Responsive
- Loading indicator
- Image preloading
- Smooth image switching
- Mobile support

Interaction:

Mouse/touch movement
        ↓
Calculate direction
        ↓
Calculate image index
        ↓
01 → 02 → 03 → ... → 36
        ↓
Display image

Do not create a fake 3D model. The first version should use a sequence of real product photographs.

Admin must be able to upload and reorder 360 images.

---

# 18. PRODUCT DETAILS PAGE

URL:

/products/:id

Display:

- Product name
- Main image
- Gallery
- 360-degree viewer
- Price
- Discount
- Weight
- Stock
- Rating
- Quantity selector
- Add to Cart
- Buy Now
- Wishlist
- Description
- Ingredients
- Nutritional information
- Storage instructions
- Delivery information
- Customer reviews
- Related products

---

# 19. HOME PAGE

Create a premium dairy-brand homepage.

Sections:

1. Navbar
2. Hero banner
3. Shop by category
4. Featured products
5. Best sellers
6. New arrivals
7. Special offers
8. 360° product highlight
9. Why choose us
10. Freshness guarantee
11. Customer testimonials
12. Newsletter
13. Footer

Use smooth animations but avoid excessive animation.

---

# 20. PRODUCT CARD

Each card should contain:

- Product image
- Product name
- Category
- Weight
- Price
- Discount
- Rating
- Stock status
- Wishlist button
- Add to cart
- Quick view

---

# 21. SEARCH AND FILTER

Implement:

- Search by product name
- Search by category
- Price range
- Category filter
- Availability filter
- Rating filter
- Sort by price
- Sort by popularity
- Sort by newest
- Pagination

Use backend pagination rather than loading the entire product catalog into the browser.

---

# 22. CUSTOMER PAGES

Public:

/
 /products
 /products/:id
 /category/:id
 /search
 /login
 /register

Authenticated:

/cart
/checkout
/orders
/orders/:id
/wishlist
/profile
/addresses

---

# 23. ADMIN DASHBOARD

Create:

/admin

Dashboard cards:

- Total Users
- Total Products
- Total Orders
- Total Revenue
- Pending Orders
- Low Stock Products

Charts:

- Daily sales
- Weekly sales
- Monthly revenue
- Orders
- Top products

Admin pages:

/admin/products
/admin/products/add
/admin/products/edit/:id
/admin/categories
/admin/orders
/admin/users
/admin/analytics

---

# 24. ADMIN PRODUCT MANAGEMENT

Admin can:

- Add product
- Edit product
- Delete product
- Enable/disable product
- Update stock
- Upload main image
- Upload gallery images
- Upload 360 images
- Reorder 360 images
- Set category
- Set price
- Set discount
- Set weight
- Set nutrition
- Set ingredients
- Set storage instructions

When uploading 360 images:

1. Select multiple images.
2. Validate file type.
3. Validate file size.
4. Display previews.
5. Allow drag-and-drop ordering.
6. Assign image indexes.
7. Upload to Cloudinary.
8. Save URLs to ProductImage.
9. Mark imageType as VIEW_360.

---

# 25. INVENTORY

Display:

- Current stock
- Low stock
- Out of stock
- Stock update
- Product active/inactive

Rules:

- Do not allow purchase when stock is insufficient.
- Validate stock again during checkout.
- Update stock using a database transaction.
- Prevent negative inventory.

---

# 26. FRONTEND STATE MANAGEMENT

Use Redux Toolkit.

Slices:

authSlice
productSlice
cartSlice
wishlistSlice

Store:

- User
- Authentication state
- Products
- Cart
- Wishlist

Use Axios interceptors for API requests and centralized error handling.

---

# 27. SECURITY

Backend security requirements:

- Helmet
- CORS configuration
- JWT authentication
- bcrypt password hashing
- Input validation
- Rate limiting on authentication endpoints
- Secure cookies where appropriate
- Role-based authorization
- Environment variables
- Request validation
- Centralized error handling
- Parameterized/database-safe Prisma queries

Never commit:

- .env
- JWT secrets
- Database passwords
- Razorpay secret
- Cloudinary secret
- API keys

---

# 28. ERROR HANDLING

Create:

errorMiddleware.js

Return consistent API responses.

Success:

{
  "success": true,
  "message": "Products fetched successfully",
  "data": {}
}

Error:

{
  "success": false,
  "message": "Product not found",
  "error": "PRODUCT_NOT_FOUND"
}

Handle:

- Validation errors
- Authentication errors
- Authorization errors
- Not found errors
- Database errors
- Payment errors
- Upload errors
- Unexpected server errors

Never expose stack traces or secrets in production responses.

---

# 29. PERFORMANCE

Implement:

- Lazy-loaded React routes
- Lazy-loaded images
- Image compression
- Cloudinary transformations
- 360-image preloading
- API pagination
- Database indexes
- Efficient Prisma queries
- Avoid N+1 queries
- Backend filtering
- Backend sorting
- Caching where useful

For the 360 viewer:

- Load the first few frames immediately.
- Preload remaining frames progressively.
- Use optimized WebP/AVIF where practical.
- Avoid loading huge original images.

---

# 30. RESPONSIVE DESIGN

Support:

- Desktop
- Laptop
- Tablet
- Mobile

The 360 viewer must support:

- Mouse drag
- Touch swipe
- Mobile screen sizes

Navigation must provide a mobile menu.

---

# 31. UI DESIGN

Use a premium dairy brand style.

Design principles:

- Clean white/light backgrounds
- Natural dairy/freshness feel
- Rounded cards
- Soft shadows
- High-quality product photography
- Clear typography
- Good spacing
- Responsive grids
- Smooth hover states
- Accessible buttons
- Skeleton loaders
- Empty states
- Error states

Do not create a generic Bootstrap-style CRUD interface.

---

# 32. TESTING

Backend:

- Jest
- Supertest

Test:

1. Register
2. Login
3. Invalid login
4. Product listing
5. Product details
6. Product search
7. Product filtering
8. Cart creation
9. Cart update
10. Out-of-stock validation
11. Order creation
12. Payment verification
13. Authorization
14. Admin product management
15. Admin order management

Frontend:

- React Testing Library
- Vitest

Test:

1. Product card
2. Product details
3. 360 viewer
4. Cart
5. Login
6. Checkout
7. Admin pages

---

# 33. DOCKER

Create docker-compose.yml.

Services:

- mysql
- backend
- frontend

Development flow:

docker compose up

Backend connects to:

mysql:3306

Do not hard-code localhost database settings inside production configuration.

---

# 34. ENVIRONMENT VARIABLES

Backend .env:

PORT=5000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/dairy_shop"

JWT_SECRET="CHANGE_THIS_IN_PRODUCTION"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

FRONTEND_URL="http://localhost:5173"

Frontend .env:

VITE_API_URL="http://localhost:5000/api"
VITE_RAZORPAY_KEY_ID=""

Never commit .env files.

Create .env.example files for documentation.

---

# 35. PRISMA

Use Prisma ORM.

Commands:

npm install prisma @prisma/client
npx prisma init
npx prisma migrate dev
npx prisma generate
npx prisma studio

Create:

backend/prisma/schema.prisma

Create:

backend/prisma/seed.js

Seed:

- Admin user
- Demo customer
- Categories
- Products
- Product gallery images
- 360-degree image URLs

---

# 36. API RESPONSE DESIGN

Use consistent response structures.

Example:

GET /api/products

{
  "success": true,
  "data": {
    "products": [],
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}

Product response should include:

{
  "id": 1,
  "name": "A2 Cow Milk",
  "price": 80,
  "stock": 50,
  "mainImage": "...",
  "galleryImages": [],
  "view360Images": []
}

---

# 37. ORDER TOTAL CALCULATION

Never trust totals from React.

Backend should calculate:

subtotal
+
shipping
-
discount
=
grand total

Example:

Product:
₹80

Quantity:
2

Subtotal:
₹160

Shipping:
₹30

Discount:
₹10

Grand Total:
₹180

The backend performs this calculation using database product prices.

---

# 38. ORDER STATUS FLOW

PENDING
   ↓
CONFIRMED
   ↓
PROCESSING
   ↓
SHIPPED
   ↓
DELIVERED

Cancellation:

PENDING/CONFIRMED
   ↓
CANCELLED

Do not allow invalid status transitions.

---

# 39. PROJECT DEVELOPMENT PHASES

PHASE 1 — PROJECT SETUP

Create:

frontend
backend

Install dependencies.

Configure:

- React
- Vite
- Express
- Prisma
- MySQL
- Environment variables

---

PHASE 2 — DATABASE

Create Prisma schema.

Create:

- User
- Category
- Product
- ProductImage
- Cart
- CartItem
- Address
- Order
- OrderItem
- Payment
- Review
- Wishlist
- WishlistItem

Run migration.

Seed database.

---

PHASE 3 — BACKEND FOUNDATION

Implement:

- Express server
- Prisma connection
- Middleware
- Error handling
- CORS
- Helmet
- Environment configuration

---

PHASE 4 — AUTHENTICATION

Implement:

- Register
- Login
- JWT
- bcrypt
- Protected routes
- Admin authorization

Test using Postman.

---

PHASE 5 — PRODUCT SYSTEM

Implement:

- Categories
- Products
- Search
- Filtering
- Sorting
- Pagination
- Product images

Test APIs.

---

PHASE 6 — FRONTEND FOUNDATION

Create:

- React routing
- Navbar
- Footer
- Layout
- API service
- Redux store
- Authentication state

---

PHASE 7 — PRODUCT UI

Create:

- Home
- Product listing
- Category page
- Search
- Product card
- Product details

---

PHASE 8 — 360 PRODUCT VIEWER

Implement:

Product360Viewer

Features:

- 36 frames
- Mouse rotation
- Touch rotation
- Autoplay
- Pause
- Fullscreen
- Loading
- Preloading

Connect viewer to ProductImage API data.

---

PHASE 9 — CART

Implement:

- Add cart
- Update quantity
- Remove
- Clear cart
- Stock validation
- Cart totals

---

PHASE 10 — WISHLIST

Implement:

- Add wishlist
- Remove wishlist
- Wishlist page

---

PHASE 11 — CHECKOUT

Implement:

- Address selection
- Address creation
- Order summary
- Backend total calculation

---

PHASE 12 — PAYMENT

Integrate Razorpay.

Implement:

- Create payment order
- Open Razorpay checkout
- Verify payment
- Update order
- Handle failed payments

---

PHASE 13 — ORDERS

Implement:

- Order creation
- Order history
- Order details
- Cancellation
- Order status

---

PHASE 14 — REVIEWS

Implement:

- Add review
- Rating
- Review listing
- Average rating

Only allow reviews for appropriate completed purchases.

---

PHASE 15 — ADMIN DASHBOARD

Implement:

- Dashboard
- Product management
- Category management
- User management
- Order management
- Inventory
- Analytics
- 360 image upload

---

PHASE 16 — TESTING

Run:

- Backend tests
- Frontend tests
- API tests
- Authentication tests
- Payment tests
- 360 viewer tests

---

PHASE 17 — PERFORMANCE

Optimize:

- Images
- API queries
- Database indexes
- React rendering
- 360 frames
- Pagination

---

PHASE 18 — DOCKER

Create:

docker-compose.yml

Test the complete application using Docker.

---

PHASE 19 — DEPLOYMENT

Deploy:

Frontend → Vercel/Netlify
Backend → Render/Railway
Database → Managed MySQL
Images → Cloudinary

Configure production environment variables.

---

# 40. IMPORTANT DEVELOPMENT RULE

Do NOT generate the entire application blindly in one step.

Build module by module.

After every module:

1. Install dependencies.
2. Run the application.
3. Compile/check syntax.
4. Test API.
5. Check database.
6. Test frontend.
7. Fix errors.
8. Continue to the next module.

Do not create unnecessary microservices.

Use a modular monolith for the first production version.

---

# 41. GITHUB WORKFLOW

Use branches:

main
develop
feature/auth
feature/products
feature/cart
feature/360-viewer
feature/payment
feature/admin

Commit examples:

feat: add JWT authentication
feat: add product catalog
feat: implement 360 product viewer
feat: add shopping cart
feat: integrate Razorpay
feat: add admin dashboard
fix: validate product stock
fix: payment signature verification

---

# 42. FINAL ACCEPTANCE CHECKLIST

The project is complete only when:

[ ] React frontend runs
[ ] Node/Express backend runs
[ ] MySQL connects
[ ] Prisma migrations work
[ ] Seed data works
[ ] Registration works
[ ] Login works
[ ] JWT protection works
[ ] Admin authorization works
[ ] Products display
[ ] Search works
[ ] Filters work
[ ] Pagination works
[ ] Product details work
[ ] Gallery works
[ ] 360 viewer works
[ ] Mouse rotation works
[ ] Touch rotation works
[ ] 360 autoplay works
[ ] Cart works
[ ] Wishlist works
[ ] Address management works
[ ] Checkout works
[ ] Razorpay payment works
[ ] Payment verification works
[ ] Orders work
[ ] Order status works
[ ] Reviews work
[ ] Admin products work
[ ] Admin categories work
[ ] Admin users work
[ ] Admin orders work
[ ] Inventory works
[ ] Analytics work
[ ] Cloudinary upload works
[ ] Mobile responsive design works
[ ] Error handling works
[ ] Security middleware works
[ ] Tests pass
[ ] Docker works
[ ] Production deployment works
[ ] README is complete

---

# 43. FINAL DELIVERABLE

At the end of development, provide:

1. Complete source code
2. Complete folder structure
3. Prisma schema
4. Database relationship explanation
5. REST API documentation
6. Postman collection
7. Environment variable template
8. Frontend setup instructions
9. Backend setup instructions
10. MySQL setup instructions
11. Cloudinary setup
12. Razorpay setup
13. 360-degree image preparation guide
14. Docker setup
15. Testing instructions
16. Deployment instructions
17. GitHub README
18. Demo admin credentials for local development only

The final architecture must be:

React
   ↓
Axios
   ↓
Node.js
   ↓
Express.js
   ↓
Controller
   ↓
Service
   ↓
Prisma ORM
   ↓
MySQL

External integrations:

Node.js
 ├── Cloudinary
 └── Razorpay

The 360-degree viewer must use product-specific image sequences managed through the ProductImage model and should work on both desktop and mobile.
