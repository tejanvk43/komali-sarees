import { useState } from 'react';
import { ShoppingCart, Menu, X, Search, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface NavigationProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Navigation({ cartItemCount, onCartClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location === '/';
    }
    return location.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
                <img src="/images/logo.png" alt="Komali Sarees Logo" className="h-12 w-auto" />
                <span className="font-serif text-2xl font-bold hidden lg:block" style={{ color: '#D4AF37' }}>
                  Komali Sarees
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/">
                <button 
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                    isActive('/') 
                      ? 'text-white' 
                      : 'hover-elevate'
                  }`}
                  style={isActive('/') ? { backgroundColor: '#D4AF37' } : {}}
                  data-testid="link-home"
                >
                  Home
                </button>
              </Link>
              <Link href="/products">
                <button 
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    isActive('/products') 
                      ? 'font-bold text-white' 
                      : 'hover-elevate'
                  }`}
                  style={isActive('/products') ? { backgroundColor: '#D4AF37' } : {}}
                  data-testid="link-shop"
                >
                  Products
                </button>
              </Link>
              <Link href="/about">
                <button 
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                    isActive('/about') 
                      ? 'text-white' 
                      : 'hover-elevate'
                  }`}
                  style={isActive('/about') ? { backgroundColor: '#D4AF37' } : {}}
                  data-testid="link-about"
                >
                  About
                </button>
              </Link>
              <Link href="/contact">
                <button 
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                    isActive('/contact') 
                      ? 'text-white' 
                      : 'hover-elevate'
                  }`}
                  style={isActive('/contact') ? { backgroundColor: '#D4AF37' } : {}}
                  data-testid="link-contact"
                >
                  Contact
                </button>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sarees..."
                className="pl-10 pr-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setLocation('/products');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-clear-search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="relative"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")} className="hidden md:flex">
                  <UserIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => logout()} className="hidden md:flex">
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="hidden md:flex ml-2">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sarees..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-mobile-search"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setLocation('/products');
                    setMobileMenuOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-clear-mobile-search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
            
            <Link href="/">
              <button className="block w-full text-left px-3 py-2 hover-elevate rounded-md" data-testid="link-mobile-home" onClick={() => setMobileMenuOpen(false)}>
                Home
              </button>
            </Link>
            <Link href="/products">
              <button className="block w-full text-left px-3 py-2 hover-elevate rounded-md" data-testid="link-mobile-shop" onClick={() => setMobileMenuOpen(false)}>
                Products
              </button>
            </Link>
            <Link href="/about">
              <button className="block w-full text-left px-3 py-2 hover-elevate rounded-md" data-testid="link-mobile-about" onClick={() => setMobileMenuOpen(false)}>
                About
              </button>
            </Link>
            <Link href="/contact">
              <button className="block w-full text-left px-3 py-2 hover-elevate rounded-md" data-testid="link-mobile-contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </button>
            </Link>

            {user ? (
              <button 
                className="block w-full text-left px-3 py-2 hover-elevate rounded-md text-red-600" 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
              >
                Logout
              </button>
            ) : (
              <Link href="/auth">
                <button className="block w-full text-left px-3 py-2 hover-elevate rounded-md text-primary font-bold" onClick={() => setMobileMenuOpen(false)}>
                  Login / Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

