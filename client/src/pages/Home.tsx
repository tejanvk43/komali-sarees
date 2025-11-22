import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useEffect, useState } from "react";
import { getAllProducts } from "@/utils/firestore";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Tag, ProductWithTags } from "@/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithTags[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Tags for enrichment
        const tagsQuery = query(collection(db, "tags"), orderBy("name"));
        const tagsSnapshot = await getDocs(tagsQuery);
        const fetchedTags = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tag[];

        // Fetch Products
        const products = await getAllProducts();
        
        // Enrich and slice first 4
        const enriched = products.slice(0, 4).map(p => {
          const productTags: Tag[] = [];
          const colorTag = fetchedTags.find(t => t.category === 'color' && t.name === p.color);
          if (colorTag) productTags.push(colorTag);
          return { ...p, tags: productTags } as ProductWithTags;
        });

        setFeaturedProducts(enriched);
      } catch (error) {
        console.error("Error loading home products:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: ProductWithTags) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Featured Collection Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-primary">
                Featured Collection
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our exclusive handpicked favorites for this season.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} direction="up" delay={0.1 * (index + 1)}>
                <ProductCard
                  product={product}
                  onClick={() => window.location.href = '/products'} // Simple redirect for now
                  onAddToCart={() => handleAddToCart(product)}
                />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.5}>
            <div className="text-center mt-12">
              <Link href="/products">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                  View Full Collection
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
