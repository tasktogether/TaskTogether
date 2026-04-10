import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import Login from './pages/Login';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ParentalConsent from './pages/ParentalConsent';
import SafetyGuidelines from './pages/SafetyGuidelines';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import StoriesPage from './pages/StoriesPage';
import LearnMorePage from './pages/LearnMorePage';
import ApplyPage from './pages/ApplyPage';
import ConsentFormDownload from './pages/ConsentFormDownload';
import RegisterSeniorHomePage from './pages/RegisterSeniorHomePage';
import { AuthProvider } from './context/AuthContext';
import { StoriesProvider } from './context/StoriesContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import SetPassword from './pages/SetPassword';

// Helper for scroll to top on route change
function ScrollToTopHelper() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <StoriesProvider>
              <ScrollToTopHelper />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/login" element={<Login />} />
                <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/learn-more" element={<LearnMorePage />} />
                <Route path="/apply" element={<ApplyPage />} />
                <Route path="/register-senior-home" element={<RegisterSeniorHomePage />} />
                <Route path="/consent-form" element={<ConsentFormDownload />} />
                <Route path="/parental-consent" element={<ParentalConsent />} />
                <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/set-password" element={<SetPassword />} />
              </Routes>
              <Toaster position="top-center" richColors />
            </StoriesProvider>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </Router>
  );
}
