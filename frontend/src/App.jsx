import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from './store/authSlice';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AdminAddProduct from './admin/AddProduct';
import AdminEditProduct from './admin/EditProduct';
import AdminCategories from './admin/Categories';
import AdminOrders from './admin/Orders';
import AdminUsers from './admin/Users';

// Scroll to top helper on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout with Navbar and Footer for public & customer pages
const StoreLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Customer & Public Pages */}
        <Route
          path="/"
          element={
            <StoreLayout>
              <Home />
            </StoreLayout>
          }
        />
        <Route
          path="/products"
          element={
            <StoreLayout>
              <Products />
            </StoreLayout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <StoreLayout>
              <ProductDetails />
            </StoreLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <StoreLayout>
              <Cart />
            </StoreLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <StoreLayout>
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </StoreLayout>
          }
        />
        <Route
          path="/order-success/:id"
          element={
            <StoreLayout>
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            </StoreLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <StoreLayout>
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            </StoreLayout>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <StoreLayout>
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            </StoreLayout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <StoreLayout>
              <Wishlist />
            </StoreLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <StoreLayout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </StoreLayout>
          }
        />
        <Route
          path="/login"
          element={
            <StoreLayout>
              <Login />
            </StoreLayout>
          }
        />
        <Route
          path="/register"
          element={
            <StoreLayout>
              <Register />
            </StoreLayout>
          }
        />

        {/* Administrator Login (Isolated from Customer Login) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Administrator Suite */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminEditProduct />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Customer Category shortcut */}
        <Route path="/categories" element={<Navigate to="/products" replace />} />

        {/* 404 Not Found Catch-All */}
        <Route
          path="*"
          element={
            <StoreLayout>
              <NotFound />
            </StoreLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
