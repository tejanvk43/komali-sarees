import { useState } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ProductWithTags } from '@shared/schema';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithTags | null;
  onAddToCart: () => void;
}

export function ProductDetailModal({ isOpen, onClose, product, onAddToCart }: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const colorTags = product.tags.filter(tag => tag.category === 'color');
  const styleTags = product.tags.filter(tag => tag.category === 'style');
  const designTags = product.tags.filter(tag => tag.category === 'design');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 z-50 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        data-testid="overlay-product-detail"
      />
      
      <div
        className={`fixed inset-4 md:inset-8 lg:inset-16 bg-background z-50 rounded-lg shadow-2xl overflow-hidden transition-all ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        data-testid="modal-product-detail"
      >
        <div className="h-full flex flex-col md:flex-row">
          <div className="relative flex-1 bg-muted">
            {product.images.length > 0 && (
              <>
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                
                {product.images.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      onClick={prevImage}
                      data-testid="button-prev-image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      onClick={nextImage}
                      data-testid="button-next-image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-foreground w-8'
                              : 'bg-foreground/30 hover-elevate'
                          }`}
                          data-testid={`button-image-dot-${index}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="w-full md:w-96 lg:w-[28rem] flex flex-col">
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex-1 pr-4">
                <h2
                  className="font-serif text-2xl lg:text-3xl font-medium mb-2"
                  data-testid="text-product-detail-name"
                >
                  {product.name}
                </h2>
                <div className="flex items-center gap-2">
                  {product.featured && (
                    <Badge className="bg-primary" data-testid="badge-detail-featured">
                      Featured
                    </Badge>
                  )}
                  <Badge
                    variant={product.inStock ? 'secondary' : 'destructive'}
                    data-testid="badge-detail-stock"
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                data-testid="button-close-detail"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <div className="text-3xl font-bold mb-4" data-testid="text-product-detail-price">
                  ₹{parseFloat(product.price).toLocaleString('en-IN')}
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Fabric</h3>
                  <Badge variant="secondary">{product.fabric}</Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Occasion</h3>
                  <Badge variant="secondary">{product.occasion}</Badge>
                </div>

                {colorTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Available Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {colorTags.map(tag => (
                        <div
                          key={tag.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted"
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: tag.colorHex || '#ccc' }}
                          />
                          <span className="text-sm">{tag.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {styleTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Style</h3>
                    <div className="flex flex-wrap gap-2">
                      {styleTags.map(tag => (
                        <Badge key={tag.id} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {designTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Design</h3>
                    <div className="flex flex-wrap gap-2">
                      {designTags.map(tag => (
                        <Badge key={tag.id} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border">
              <Button
                className="w-full h-12"
                onClick={onAddToCart}
                disabled={!product.inStock}
                data-testid="button-add-to-cart-detail"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
