import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Common/ScrollToTop';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import ArtisanProfile from './pages/Artisan/ArtisanProfile';
import AddProduct from './pages/Artisan/AddProduct';
import EditProduct from './pages/Artisan/EditProduct';
import MyProducts from './pages/Artisan/MyProducts';
import ImageInspection from './pages/Artisan/ImageInspection';
import SalesAnalytics from './pages/Artisan/SalesAnalytics';
import Logistics from './pages/Artisan/Logistics';
import BlockchainSupplyChain from './pages/Artisan/BlockchainSupplyChain';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/Orders/OrderDetail';
import Analytics from './pages/Analytics/Analytics';
import VRViewer from './pages/VR/VRViewer';
import ARViewer from './pages/AR/ARViewer';
import SupplyChain from './pages/Blockchain/SupplyChain';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ArtisansPage from './pages/Artisans';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

// Styles
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const AppLayout = ({ children }) => {
    const location = useLocation();
    const normalizedPath = location.pathname.replace(/\/$/, "");
    const hideLayout = ['/login', '/register', '/forgot-password'].includes(normalizedPath) || normalizedPath.startsWith('/reset-password') || location.pathname === '/login/' || location.pathname === '/register/';

    return (
      <div className="App">
        <ScrollToTop />
        {!hideLayout && <Navbar />}
        <main className={hideLayout ? "" : "main-content"}>
          {children}
        </main>
        {!hideLayout && <Footer />}
      </div>
    );
  };

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Router>
                  <AppLayout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        
                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />

                        {/* Protected Browsing Routes */}
                        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                        <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                        <Route path="/artisans" element={<ProtectedRoute><ArtisansPage /></ProtectedRoute>} />
                        <Route path="/artisan/:id" element={<ProtectedRoute><ArtisanProfile /></ProtectedRoute>} />
                        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

                        {/* Protected Routes */}
                        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                        {/* Artisan Routes */}
                        <Route path="/artisan/my-products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
                        <Route path="/artisan/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                        <Route path="/artisan/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
                        <Route path="/artisan/image-inspection" element={<ProtectedRoute><ImageInspection /></ProtectedRoute>} />
                        <Route path="/artisan/sales" element={<ProtectedRoute><SalesAnalytics /></ProtectedRoute>} />
                        <Route path="/artisan/logistics" element={<ProtectedRoute><Logistics /></ProtectedRoute>} />
                        <Route path="/artisan/blockchain" element={<ProtectedRoute><BlockchainSupplyChain /></ProtectedRoute>} />

                        {/* VR/AR Routes */}
                        <Route path="/vr/:id" element={<ProtectedRoute><VRViewer /></ProtectedRoute>} />
                        <Route path="/ar/:id" element={<ProtectedRoute><ARViewer /></ProtectedRoute>} />

                        {/* Blockchain Routes */}
                        <Route path="/supply-chain/:id" element={<ProtectedRoute><SupplyChain /></ProtectedRoute>} />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#363636',
                          color: '#fff',
                        },
                        success: {
                          duration: 3000,
                          iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                          },
                        },
                        error: {
                          duration: 5000,
                          iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                          },
                        },
                      }}
                    />
                </Router>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
