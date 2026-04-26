import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CreatorLayout } from "@/components/creator/CreatorLayout";
import CreatorLoginPage from "./pages/creator/LoginPage";
import CreatorSignupPage from "./pages/creator/SignupPage";
import ForgotPasswordPage from "./pages/creator/ForgotPasswordPage";
import ResetPasswordPage from "./pages/creator/ResetPasswordPage";
import VerifyEmailPage from "./pages/creator/VerifyEmailPage";
import DashboardPage from "./pages/creator/DashboardPage";
import VideosPage from "./pages/creator/VideosPage";
import UploadPage from "./pages/creator/UploadPage";
import AnalyticsPage from "./pages/creator/AnalyticsPage";
import EarningsPage from "./pages/creator/EarningsPage";
import PayoutsPage from "./pages/creator/PayoutsPage";
import CommentsPage from "./pages/creator/CommentsPage";
import SubscribersPage from "./pages/creator/SubscribersPage";
import SettingsPage from "./pages/creator/SettingsPage";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import { AdminUsersPage, AdminVideosPage, AdminPayoutsPage, AdminReportsPage } from "./pages/admin/AdminSimplePages";
import {
  PrivacyPage,
  TermsPage,
  CookiesPage,
  RefundPage,
  MonetizationPage,
  CommunityGuidelinesPage,
  CopyrightPage,
  CreatorAgreementPage,
  TrustSafetyPage,
  AcceptableUsePage,
  DisclaimerPage,
  AccessibilityPage,
} from "./pages/legal/LegalPage";

// Don't retry on 4xx client errors (e.g. 404 = no channel yet, 403 = forbidden)
// Only retry on network failures or 5xx server errors
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/monetization" element={<MonetizationPage />} />
          <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
          <Route path="/copyright" element={<CopyrightPage />} />
          <Route path="/creator-agreement" element={<CreatorAgreementPage />} />
          <Route path="/trust-safety" element={<TrustSafetyPage />} />
          <Route path="/acceptable-use" element={<AcceptableUsePage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />

          <Route path="/creator/login" element={<CreatorLoginPage />} />
          <Route path="/creator/signup" element={<CreatorSignupPage />} />
          <Route path="/creator/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/creator/reset-password" element={<ResetPasswordPage />} />
          <Route path="/creator/verify-email" element={<VerifyEmailPage />} />
          <Route path="/creator" element={<ProtectedRoute role="creator"><CreatorLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="earnings" element={<EarningsPage />} />
            <Route path="payouts" element={<PayoutsPage />} />
            <Route path="comments" element={<CommentsPage />} />
            <Route path="subscribers" element={<SubscribersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="videos" element={<AdminVideosPage />} />
            <Route path="payouts" element={<AdminPayoutsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
