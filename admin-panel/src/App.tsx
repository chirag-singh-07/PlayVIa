import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

import LandingPage from "./pages/public/LandingPage";
import AboutPage from "./pages/public/AboutPage";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import CookiesPage from "./pages/public/CookiesPage";
import CommunityGuidelinesPage from "./pages/public/CommunityGuidelinesPage";
import DMCAPage from "./pages/public/DMCAPage";
import CareersPage from "./pages/public/CareersPage";
import AdvertisePage from "./pages/public/AdvertisePage";

import AdminLoginPage from "./pages/admin/LoginPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import VideosPage from "./pages/admin/VideosPage";
import UsersPage from "./pages/admin/UsersPage";
import RevenuePage from "./pages/admin/RevenuePage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import CommentsPage from "./pages/admin/CommentsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import CreatorsPage from "./pages/admin/CreatorsPage";
import BannedUsersPage from "./pages/admin/BannedUsersPage";
import WithdrawalsPage from "./pages/admin/WithdrawalsPage";
import AdsPage from "./pages/admin/AdsPage";
import AppVersionsPage from "./pages/admin/AppVersionsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import BannersPage from "./pages/admin/BannersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import LogsPage from "./pages/admin/LogsPage";
import ProfilePage from "./pages/admin/ProfilePage";
import InboxPage from "./pages/admin/InboxPage";
import StoragePage from "./pages/admin/StoragePage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
            <Route path="/dmca" element={<DMCAPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/advertise" element={<AdvertisePage />} />

            {/* Admin auth */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin (protected via AdminLayout guard) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="videos" element={<VideosPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="comments" element={<CommentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="creators" element={<CreatorsPage />} />
              <Route path="banned" element={<BannedUsersPage />} />
              <Route path="revenue" element={<RevenuePage />} />
              <Route path="withdrawals" element={<WithdrawalsPage />} />
              <Route path="ads" element={<AdsPage />} />
              <Route path="app-versions" element={<AppVersionsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admins" element={<AdminUsersPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="storage" element={<StoragePage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
