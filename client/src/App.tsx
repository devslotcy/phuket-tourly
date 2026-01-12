import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/lib/auth";

import Home from "@/pages/Home";
import Tours from "@/pages/Tours";
import TourDetail from "@/pages/TourDetail";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Reviews from "@/pages/Reviews";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminTours from "@/pages/admin/Tours";
import TourForm from "@/pages/admin/TourForm";
import AdminCategories from "@/pages/admin/Categories";
import AdminInquiries from "@/pages/admin/Inquiries";
import AdminFAQs from "@/pages/admin/FAQs";
import AdminReviews from "@/pages/admin/ReviewsAdmin";
import AdminBlog from "@/pages/admin/BlogAdmin";
import BlogForm from "@/pages/admin/BlogForm";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !admin) {
      setLocation("/admin/login");
    }
  }, [admin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tours" component={Tours} />
      <Route path="/tours/:slug" component={TourDetail} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/contact" component={Contact} />
      
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        {() => (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/tours">
        {() => (
          <ProtectedRoute>
            <AdminTours />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/tours/:id">
        {() => (
          <ProtectedRoute>
            <TourForm />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/categories">
        {() => (
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/inquiries">
        {() => (
          <ProtectedRoute>
            <AdminInquiries />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/faqs">
        {() => (
          <ProtectedRoute>
            <AdminFAQs />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/reviews">
        {() => (
          <ProtectedRoute>
            <AdminReviews />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/blog">
        {() => (
          <ProtectedRoute>
            <AdminBlog />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/blog/:id">
        {() => (
          <ProtectedRoute>
            <BlogForm />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
