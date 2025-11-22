import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Shop from "@/pages/Shop";
import NotFound from "@/pages/not-found";
import { AdminLogin } from "@/admin/AdminLogin";
import { AdminDashboard } from "@/admin/AdminDashboard";
import { AuthGuard } from "@/admin/AuthGuard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Shop} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <AuthGuard>
          <AdminDashboard />
        </AuthGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
