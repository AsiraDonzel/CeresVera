import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ScanUpload from './pages/ScanUpload';
import Consultants from './pages/Consultants';
import Checkout from './pages/Checkout';
import WeatherDashboard from './pages/WeatherDashboard';
import Auth from './pages/Auth';
import ExpertDashboard from './pages/ExpertDashboard';
import Schedule from './pages/Schedule';
import Payouts from './pages/Payouts';
import Settings from './pages/Settings';
import About from './pages/About';
import Crops from './pages/Crops';
import Diseases from './pages/Diseases';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Chatbot from './pages/Chatbot';

function App() {
  useEffect(() => {
    // Push Notification Integration
    const oneSignalAppId = import.meta.env.VITE_ONESIGNAL_APP_ID;
    if (oneSignalAppId) {
      console.log('OneSignal mock initialized with App ID:', oneSignalAppId);
      // window.OneSignal.push(() => window.OneSignal.init({ appId: oneSignalAppId }));
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId="605914999241-ca9qb0iib923ma24ptkpc2j4rjhdk7le.apps.googleusercontent.com">
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/diseases" element={<Diseases />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/scan" element={<ScanUpload />} />
            <Route path="/consultants" element={<Consultants />} />
            <Route path="/checkout/:consultantId" element={<Checkout />} />
            <Route path="/hotspots" element={<WeatherDashboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
