import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Shop from "@/pages/Shop";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AuthPage from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/not-found";
import { AdminLogin } from "@/admin/AdminLogin";
import { AdminDashboard } from "@/admin/AdminDashboard";
import { AuthGuard } from "@/admin/AuthGuard";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider, useCart } from "@/hooks/use-cart";
import { Navigation } from "@/components/Navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/Footer";

// Public Layout with Navigation and Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  const { items, cartOpen, setCartOpen, updateQuantity, removeFromCart } = useCart();
  
  return (
    <>
      <Navigation cartItemCount={items.length} onCartClick={() => setCartOpen(true)} />
      <main>{children}</main>
      <Footer />
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        items={items} 
        onUpdateQuantity={updateQuantity} 
        onRemoveItem={removeFromCart} 
      />
    </>
  );
}

// Admin Layout without Navigation and Footer
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>{children}</main>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      <Route path="/products">
        <PublicLayout>
          <Shop />
        </PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout>
          <About />
        </PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout>
          <Contact />
        </PublicLayout>
      </Route>
      <Route path="/auth">
        <PublicLayout>
          <AuthPage />
        </PublicLayout>
      </Route>
      <Route path="/profile">
        <PublicLayout>
          <Profile />
        </PublicLayout>
      </Route>
      <Route path="/checkout">
        <PublicLayout>
          <Checkout />
        </PublicLayout>
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/login">
        <AdminLayout>
          <AdminLogin />
        </AdminLayout>
      </Route>
      <Route path="/admin">
        <AdminLayout>
          <AuthGuard>
            <AdminDashboard />
          </AuthGuard>
        </AdminLayout>
      </Route>
      
      {/* 404 */}
      <Route>
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <PageLoader />
      <Toaster />
      <AuthProvider>
        <CartProvider>
          <Router />
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
