import { useState, useEffect, useMemo } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { useSearch } from "wouter";

import { ProductDetailModal } from "@/components/ProductDetailModal";
import { useToast } from "@/hooks/use-toast";
import { getAllProducts } from "@/utils/firestore";
import { Tag } from "@/types";
import { useCart } from "@/hooks/use-cart";
import type { ProductWithTags, FilterState } from "@/types";

import { getAllProducts, getTags } from "@/utils/firestore";

export default function Shop() {
  const { toast } = useToast();
  const searchString = useSearch();
  
  const [tags, setTags] = useState<Tag[]>([]);
  const [products, setProducts] = useState<ProductWithTags[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Tags and Products in parallel
        const [fetchedTags, productsData] = await Promise.all([
          getTags(),
          getAllProducts()
        ]);
        
        setTags(fetchedTags);

        // Enrich products with tag objects based on their string attributes
        const productList = Array.isArray(productsData) ? productsData : [];
        const tagList = Array.isArray(fetchedTags) ? fetchedTags : [];

        const enrichedProducts = productList.map(p => {
          const productTags: Tag[] = [];
          
          // Find matching tags for the product's attributes
          const colorTag = tagList.find(t => t.category === 'color' && t.name === p.color);
          if (colorTag) productTags.push(colorTag);

          const fabricTag = fetchedTags.find(t => t.category === 'fabric' && t.name === p.fabric);
          if (fabricTag) productTags.push(fabricTag);

          const occasionTag = fetchedTags.find(t => t.category === 'occasion' && t.name === p.occasion);
          if (occasionTag) productTags.push(occasionTag);

          return { ...p, tags: productTags } as ProductWithTags;
        });

        setProducts(enrichedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithTags | null>(null);
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    fabrics: [],
    occasions: [],
    styles: [],
    dressTypes: [],
    priceRange: [0, 50000],
  });

  // Update search query when search string changes
  useEffect(() => {
    const searchParams = new URLSearchParams(searchString);
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchString]);

  const handleAddToCart = (product: ProductWithTags) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  // Use useMemo to recalculate when searchQuery or products/filters change
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search Filter
      const query = searchQuery.toLowerCase();
      
      if (query) {
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesFabric = product.fabric.toLowerCase().includes(query);
        const matchesColor = product.color.toLowerCase().includes(query);
        const matchesOccasion = product.occasion.toLowerCase().includes(query);
        
        if (!matchesName && !matchesFabric && !matchesColor && !matchesOccasion) return false;
      }

      if (filters.colors.length > 0 && !filters.colors.includes(product.color)) return false;
      if (filters.fabrics.length > 0 && !filters.fabrics.includes(product.fabric)) return false;
      if (filters.occasions.length > 0 && !filters.occasions.includes(product.occasion)) return false;
      if (filters.dressTypes && filters.dressTypes.length > 0 && product.dressType && !filters.dressTypes.includes(product.dressType)) return false;
      
      const price = Number(product.price);
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;

      return true;
    });
  }, [products, filters, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`
              lg:w-64 flex-shrink-0
              fixed lg:sticky inset-y-0 lg:inset-y-auto left-0 lg:left-auto w-full lg:w-auto z-[60] lg:z-30 bg-background lg:bg-transparent
              lg:top-24
              transform transition-transform duration-300 ease-in-out
              ${filterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              p-6 lg:p-0 overflow-y-auto lg:overflow-visible
              max-h-screen lg:max-h-[calc(100vh-6rem)]
            `}>
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setFilterOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <FilterSidebar
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                // Auto‑close sidebar on mobile after applying filters
                if (window.innerWidth < 1024) {
                  setFilterOpen(false);
                }
              }}
              tags={tags}
            />
          </aside>

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-serif font-bold text-primary">Collection</h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setFilterOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <span className="text-muted-foreground">{filteredProducts.length} Products</span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-lg text-muted-foreground">Loading products...</div>
            ) : (
              filteredProducts.length === 0 ? (
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
                      dressTypes: [],
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
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </div>
              )
            )}
          </main>
        </div>
      </div>



      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={() => selectedProduct && handleAddToCart(selectedProduct)}
      />
    </div>
  );
}
