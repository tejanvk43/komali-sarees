import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductWithTags } from "@/types";
import { X, ShoppingCart, Share2, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithTags | null;
  onAddToCart: () => void;
}

export function ProductDetailModal({ isOpen, onClose, product, onAddToCart }: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [];

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out this ${product.name} on Komali Sarees!`;

    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied to clipboard" });
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white">
        <div className="grid md:grid-cols-2 h-[80vh] md:h-auto overflow-y-auto md:overflow-visible">
          
          <div className="relative bg-gray-100">
            <div className="aspect-[3/4] w-full">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0 ${
                      selectedImageIndex === idx ? 'border-primary' : 'border-white'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary">{product.name}</h2>
                <p className="text-muted-foreground mt-1">{product.fabric} • {product.occasion}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold min-w-[80px]">Color:</span>
              <div className="flex items-center gap-2">
                {/* Try to find a matching color tag if available in props, otherwise just show text */}
                {/* In a real app, we'd pass the full tag object or fetch it. For now, we just show the name. */}
                {/* If we had the hex, we'd show: <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: hex }} /> */}
                <span>{product.color}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold">₹{Number(product.price).toLocaleString()}</span>
              {product.discountPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{Number(product.discountPrice).toLocaleString()}
                </span>
              )}
            </div>

            <div className="prose prose-sm mb-8 flex-grow">
              <p>{product.description}</p>
            </div>

            <div className="space-y-4 mt-auto">
              <Button onClick={onAddToCart} className="w-full h-12 text-lg gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>

              <div className="flex items-center justify-center gap-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Share:</span>
                <Button variant="ghost" size="icon" onClick={() => handleShare('whatsapp')} className="text-green-600">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare('copy')}>
                  <LinkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
