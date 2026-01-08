import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { db } from "@/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CheckCircle2, ChevronLeft, CreditCard, MapPin, User, Phone, MessageSquare } from "lucide-react";

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const { items, removeFromCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    customization: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth?redirect=/checkout");
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user, authLoading, setLocation]);

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.uid,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        customization: formData.customization,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0]
        })),
        totalAmount: subtotal,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);
      
      // Clear cart
      items.forEach(item => removeFromCart(item.id));
      
      setOrderComplete(true);
      toast({ title: "Order placed successfully!" });
    } catch (err: any) {
      toast({ title: "Error placing order", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ScrollReveal>
          <Card className="max-w-md w-full text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">Shukriya!</h2>
            <p className="text-muted-foreground mb-8">
              Your order has been placed successfully. Our team will contact you shortly for customization details.
            </p>
            <Button onClick={() => setLocation("/profile")} className="w-full">
              View My Orders
            </Button>
          </Card>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" onClick={() => setLocation("/products")} className="mb-6 gap-2">
          <ChevronLeft className="h-4 w-4" /> Back to Shopping
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <ScrollReveal direction="left">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Shipping Details</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" /> Full Name
                      </label>
                      <Input 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone Number
                      </label>
                      <Input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        placeholder="10-digit mobile number"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Shipping Address
                    </label>
                    <Textarea 
                      value={formData.address} 
                      onChange={e => setFormData({...formData, address: e.target.value})} 
                      placeholder="Complete address with pincode"
                      className="min-h-[100px]"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Customization Notes
                    </label>
                    <Textarea 
                      value={formData.customization} 
                      onChange={e => setFormData({...formData, customization: e.target.value})} 
                      placeholder="e.g., Blouse size, specific drape style, or gift message"
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting || items.length === 0}>
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </ScrollReveal>

          {/* Order Summary */}
          <ScrollReveal direction="right">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[40vh] overflow-y-auto space-y-4 pr-2">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{(parseFloat(item.product.price) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-center text-muted-foreground py-8 italic">Your cart is empty</p>}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Standard Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3 mt-6">
                  <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm text-primary">
                    <strong>Note:</strong> We currently only support **Cash on Delivery** or **Bank Transfer**. Our team will call you to confirm payment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
