import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { ProductWithTags } from '@shared/schema';

interface ProductCardProps {
  product: ProductWithTags;
  onClick: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
  const colorTags = product.tags.filter(tag => tag.category === 'color');

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover-elevate active-elevate-2 transition-all"
      onClick={onClick}
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {product.images.length > 0 && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        )}
        
        {!product.inStock && (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2"
            data-testid="badge-out-of-stock"
          >
            Out of Stock
          </Badge>
        )}
        
        {product.featured && (
          <Badge
            className="absolute top-2 right-2 bg-primary"
            data-testid="badge-featured"
          >
            Featured
          </Badge>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            disabled={!product.inStock}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-serif text-xl font-medium mb-2 line-clamp-2"
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          {colorTags.slice(0, 4).map(tag => (
            <div
              key={tag.id}
              className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
              style={{ backgroundColor: tag.colorHex || '#ccc' }}
              title={tag.name}
              data-testid={`color-swatch-${tag.id}`}
            />
          ))}
          {colorTags.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{colorTags.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-2xl font-bold"
            data-testid={`text-price-${product.id}`}
          >
            ₹{parseFloat(product.price).toLocaleString('en-IN')}
          </span>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs">
              {product.fabric}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
