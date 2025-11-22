import { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "@/utils/firestore";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./ProductForm";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }}>
          Add Product
        </Button>
      </div>

      {isFormOpen ? (
        <div className="mb-8">
          <Button variant="outline" onClick={() => setIsFormOpen(false)} className="mb-4">Cancel</Button>
          <ProductForm 
            initialData={editingProduct} 
            onSuccess={() => { setIsFormOpen(false); loadProducts(); }} 
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded shadow border">
              <div className="flex items-center gap-4">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">₹{product.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
