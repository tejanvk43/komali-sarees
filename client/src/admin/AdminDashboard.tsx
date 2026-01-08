import { useState, useEffect } from "react";
import { getAllProducts, deleteProduct, getOrders, updateOrderStatus, getFeedback } from "@/utils/firestore";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductForm } from "./ProductForm";
import { TagManager } from "./TagManager";
import { Plus, Search, Edit, Trash2, LogOut, ShoppingBag, BarChart3, Package, DollarSign, Clock, CheckCircle, Star } from "lucide-react";
import { auth } from "@/firebase/client";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'tags' | 'orders' | 'stats' | 'feedback'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [, setLocation] = useLocation();

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadFeedback();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const loadFeedback = async () => {
    const data = await getFeedback();
    setFeedback(data);
  };

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
            <Button variant="ghost" onClick={() => setView('orders')}>Orders</Button>
            <Button variant="ghost" onClick={() => setView('stats')}>Stats</Button>
            <Button variant="ghost" onClick={() => setView('feedback')}>Feedback</Button>
            <Button variant="ghost" onClick={() => setView('tags')}>Attributes</Button>
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

        {view === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Button variant="outline" onClick={loadOrders}>Refresh</Button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-sm">₹{order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" onClick={async () => {
                           if(confirm('Mark as completed?')) {
                             await updateOrderStatus(order.id, 'completed');
                             loadOrders();
                           }
                        }}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground font-medium italic">Reflects all orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground font-medium italic">Successful placements</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Order</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{orders.length ? Math.round(orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length).toLocaleString() : 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-end gap-2 pb-8">
                 {(() => {
                   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                   const salesByDay = new Array(7).fill(0);
                   
                   // Group orders by day of week
                   orders.forEach(order => {
                     if (order.createdAt?.toDate) {
                       const date = order.createdAt.toDate();
                       const dayIndex = date.getDay();
                       salesByDay[dayIndex] += order.totalAmount || 0;
                     }
                   });

                   const maxSales = Math.max(...salesByDay, 1000); // Avoid division by zero

                   // Rotate days so it ends today
                   const today = new Date().getDay();
                   const orderedDays = [];
                   for (let i = 0; i < 7; i++) {
                     const idx = (today - 6 + i + 7) % 7;
                     orderedDays.push({
                       label: days[idx],
                       value: salesByDay[idx]
                     });
                   }

                   return orderedDays.map((day, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                       <div className="flex-1 w-full flex items-end">
                         <div 
                           className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t cursor-pointer relative group" 
                           style={{ height: `${(day.value / maxSales) * 100}%`, minHeight: day.value > 0 ? '4px' : '0' }}
                         >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                             ₹{day.value.toLocaleString()}
                           </div>
                         </div>
                       </div>
                       <span className="text-[10px] text-muted-foreground">{day.label}</span>
                     </div>
                   ));
                 })()}
              </CardContent>
            </Card>
          </div>
        )}

        {view === 'feedback' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Customer Feedback</h2>
              <Button variant="outline" onClick={loadFeedback}>Refresh</Button>
            </div>
            <div className="grid gap-4">
              {feedback.map((f) => (
                <Card key={f.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= f.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground italic">
                        {f.createdAt?.toDate ? f.createdAt.toDate().toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 font-serif italic">"{f.suggestion || 'No suggestion provided'}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {f.userName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">{f.userName}</p>
                        <p className="text-xs text-muted-foreground">{f.userEmail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {feedback.length === 0 && (
                <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">No feedback received yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
