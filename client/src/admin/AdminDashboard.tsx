import { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "@/utils/firestore";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductForm } from "./ProductForm";
import { TagManager } from "./TagManager";
import { Plus, Search, Edit, Trash2, LogOut } from "lucide-react";
import { auth } from "@/firebase/client";
import { useLocation } from "wouter";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'tags'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [, setLocation] = useLocation();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.fabric.toLowerCase().includes(query) ||
        p.color.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setView('list')}>Products</Button>
            <Button variant="ghost" onClick={() => setView('tags')}>Tags & Attributes</Button>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {view === 'list' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => { setEditingProduct(undefined); setView('add'); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={product.images?.[0] || 'placeholder.jpg'} alt="" className="h-10 w-10 rounded object-cover bg-gray-100" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(view === 'add' || view === 'edit') && (
          <div>
             <Button variant="ghost" onClick={() => setView('list')} className="mb-4">← Back to List</Button>
             <ProductForm 
               initialData={editingProduct} 
               onSuccess={() => { setView('list'); loadProducts(); }} 
             />
          </div>
        )}

        {view === 'tags' && (
          <div>
            <Button variant="ghost" onClick={() => setView('list')} className="mb-4">← Back to Products</Button>
            <TagManager />
          </div>
        )}
      </main>
    </div>
  );
}
