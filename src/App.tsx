import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import AppLayout from "./components/AppLayout";

const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Mentor = lazy(() => import("./pages/Mentor"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Chat = lazy(() => import("./pages/Chat"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const RecruiterDashboard = lazy(() => import("./pages/RecruiterDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  const homeRedirect = user?.role === "recruiter" ? "/recruiter" : "/dashboard";

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={homeRedirect} /> : <Landing />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to={homeRedirect} /> : <Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/mentor" element={<ProtectedRoute><Mentor /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/recruiter" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/onboarding" element={isAuthenticated ? <Onboarding /> : <Navigate to="/auth" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
