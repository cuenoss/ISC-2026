import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import StickyRegistrationBar from './components/StickyRegistrationBar';
import Home from './pages/Home';
import Speakers from './pages/Speakers';
import Agenda from './pages/Agenda';
import Register from './pages/Register';
import SubmitPaper from './pages/SubmitPaper';
import PaperTracking from './pages/PaperTracking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminConference from './pages/AdminConference';
import AdminSpeakers from './pages/AdminSpeakers';
import AdminCertificates from './pages/AdminCertificates';
import AdminPapers from './pages/AdminPapers';
import AdminRegistrations from './pages/AdminRegistrations';

export default function App() {
  const location = useLocation();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const isAdminRoute = location.pathname.startsWith('/admin/') && location.pathname !== '/admin/login';
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    if (!isLandingPage) {
      setShowStickyBar(false);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.querySelector('.hero-section');
      
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setShowStickyBar(scrollY > heroBottom - 100);
      } else {
        setShowStickyBar(scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

  return (
    <div className="app">
      {isAdminRoute ? <AdminNavbar /> : location.pathname === '/admin/login' ? null : <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit-paper" element={<SubmitPaper />} />
          <Route path="/track-paper" element={<PaperTracking />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/conference" element={<AdminConference />} />
          <Route path="/admin/speakers" element={<AdminSpeakers />} />
          <Route path="/admin/papers" element={<AdminPapers />} />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
        </Routes>
      </div>
      {!isAdminRoute && location.pathname !== '/admin/login' && <Footer />}
      {isLandingPage && <StickyRegistrationBar className={showStickyBar ? 'visible' : ''} />}
    </div>
  );
}
