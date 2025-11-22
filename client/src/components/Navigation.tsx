import { useState } from 'react';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface NavigationProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Navigation({ cartItemCount, onCartClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link href="/">
              <span className="font-serif text-2xl font-bold text-primary" data-testid="link-logo">
                Komali Sarees
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/">
                <button className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-shop">
                  Shop
                </button>
              </Link>
              <button className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-collections">
                Collections
              </button>
              <button className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-about">
                About
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sarees..."
                className="pl-10 h-10"
                data-testid="input-search"
              />
            </div>
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
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sarees..."
                className="pl-10"
                data-testid="input-mobile-search"
              />
            </div>
            
            <Link href="/">
              <button className="block w-full text-left px-3 py-2 hover-elevate rounded-md" data-testid="link-mobile-shop">
                Shop
              </button>
            </Link>
            <button className="block w-full text-left px-3 py-2 hover-elevate rounded-md" data-testid="link-mobile-collections">
              Collections
            </button>
            <button className="block w-full text-left px-3 py-2 hover-elevate rounded-md" data-testid="link-mobile-about">
              About
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

