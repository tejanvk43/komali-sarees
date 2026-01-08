import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, getUserOrders } from "@/utils/firestore";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const ordersRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/auth");
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch Profile
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
            setNewName(userProfile.name);
          }

          // Fetch Orders
          const ordersData = await getUserOrders(user.uid);
          setOrders(ordersData);
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };
    fetchData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserProfile({
        id: user.uid,
        name: newName,
        email: user.email || ""
      });
      setProfile(prev => prev ? { ...prev, name: newName } : null);
      setIsEditing(false);
      toast({ title: "Profile updated successfully" });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center font-serif text-xl italic">Loading your elegant profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar/Quick Actions */}
            <div className="md:w-1/3 space-y-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold font-serif">{profile?.name || user.displayName || "Elegant User"}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3" 
                      onClick={() => ordersRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3 border-primary/40 text-primary hover:bg-primary/5" 
                      onClick={() => setIsFeedbackOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4" /> Give Feedback
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3" onClick={() => setIsEditing(!isEditing)}>
                      <Settings className="h-4 w-4" /> Account Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => logout()}>
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Personal Information</CardTitle>
                  <CardDescription>Manage your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input value={newName} onChange={(e) => setNewName(e.target.value)} required />
                      </div>
                      <div className="space-y-2 opacity-60">
                        <label className="text-sm font-medium">Email (Cannot be changed)</label>
                        <Input value={user.email || ""} disabled />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 border-b pb-4">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</p>
                          <p className="font-medium">{profile?.name || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 border-b pb-4">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Member Since</p>
                          <p className="font-medium">
                            {profile?.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString() : "Present"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order History */}
              <Card ref={ordersRef}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">My Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-muted-foreground italic">You haven't placed any orders yet. Time for some saree shopping!</p>
                      <Button variant="link" className="mt-4" onClick={() => setLocation("/products")}>
                        Browse Collection
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 space-y-4 bg-white">
                          <div className="flex justify-between items-start border-b pb-4">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">Order ID</p>
                              <p className="font-mono text-sm">{order.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-4 items-center">
                                <div className="w-12 h-16 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{item.productName}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold">₹{parseFloat(item.price).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>

                          <div className="border-t pt-4 flex justify-between items-center">
                            <div>
                              <p className="text-xs text-muted-foreground">Placed on</p>
                              <p className="text-sm">
                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Total Amount</p>
                              <p className="text-lg font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollReveal>

        <FeedbackModal 
          isOpen={isFeedbackOpen} 
          onClose={() => setIsFeedbackOpen(false)} 
        />
      </div>
    </div>
  );
}
