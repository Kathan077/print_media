import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home/Home';
import AboutPage from './pages/About/AboutPage';
import ServicesPage from './pages/Services/ServicesPage';
import QuotePage from './pages/Quote/QuotePage';
import GalleryPage from './pages/Gallery/GalleryPage';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/Cursor/CustomCursor';
import AdminPanel from './pages/Admin/AdminPanel';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CustomCursor />
      <div className="mesh-gradient" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        {/* Fallback route to prevent the blank screen issue if a user clicks an unbuilt link like /catalog */}
        <Route path="*" element={
          <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', flexDirection: 'column' }}>
            <h1>Page Not Found</h1>
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>Looks like this link hasn't been built yet.</p>
            <a href="/" className="pro-btn pro-btn--primary" style={{ marginTop: '2rem' }}>Back to Home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
