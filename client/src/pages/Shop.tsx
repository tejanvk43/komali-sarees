import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroCarousel } from '@/components/HeroCarousel';
import { Navigation } from '@/components/Navigation';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar, type FilterState } from '@/components/FilterSidebar';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { ProductWithTags, Tag, CartItemWithProduct } from '@shared/schema';

export default function Shop() {
  const { toast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithTags | null>(null);
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem('sessionId');
    if (existing) return existing;
    const newId = crypto.randomUUID();
    localStorage.setItem('sessionId', newId);
    return newId;
  });

  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    fabrics: [],
    occasions: [],
    styles: [],
    priceRange: [0, 50000],
  });

  const { data: products = [] } = useQuery<ProductWithTags[]>({
    queryKey: ['/api/products/with-tags'],
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart', sessionId],
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) =>
      apiRequest('POST', '/api/cart', { sessionId, productId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      toast({
        title: 'Added to cart',
        description: 'Product has been added to your cart',
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      apiRequest('PATCH', `/api/cart/${itemId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const removeCartMutation = useMutation({
    mutationFn: (itemId: string) =>
      apiRequest('DELETE', `/api/cart/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      toast({
        title: 'Removed from cart',
        description: 'Product has been removed from your cart',
      });
    },
  });

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    if (filters.fabrics.length > 0 && !filters.fabrics.includes(product.fabric)) {
      return false;
    }

    if (filters.occasions.length > 0 && !filters.occasions.includes(product.occasion)) {
      return false;
    }

    const productColorTags = product.tags.filter(t => t.category === 'color').map(t => t.name);
    if (filters.colors.length > 0 && !filters.colors.some(c => productColorTags.includes(c))) {
      return false;
    }

    const productStyleTags = product.tags.filter(t => t.category === 'style').map(t => t.name);
    if (filters.styles.length > 0 && !filters.styles.some(s => productStyleTags.includes(s))) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        cartItemCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onAdminClick={() => window.location.href = '/admin'}
      />

      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                tags={tags}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-serif font-medium">
                  Our Collection
                </h2>
                <p className="text-muted-foreground mt-1">
                  {filteredProducts.length} sarees available
                </p>
              </div>

              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setFilterOpen(true)}
                data-testid="button-open-filters"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <X className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button
                  onClick={() => setFilters({
                    colors: [],
                    fabrics: [],
                    occasions: [],
                    styles: [],
                    priceRange: [0, 50000],
                  })}
                  data-testid="button-clear-all-filters"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                    onAddToCart={() => addToCartMutation.mutate(product.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {filterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden">
            <FilterSidebar
              tags={tags}
              filters={filters}
              onFilterChange={setFilters}
              onClose={() => setFilterOpen(false)}
              isMobile
            />
          </div>
        </>
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(itemId, quantity) => updateCartMutation.mutate({ itemId, quantity })}
        onRemoveItem={(itemId) => removeCartMutation.mutate(itemId)}
      />

      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={() => {
          if (selectedProduct) {
            addToCartMutation.mutate(selectedProduct.id);
          }
        }}
      />
    </div>
  );
}
