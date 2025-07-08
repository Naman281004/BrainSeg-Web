import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/HeroSection';
import FAQs from './components/FAQs';
import Blog from './components/Blog';
import Contact from './components/Contact';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Upload from './components/Upload';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ForgotPassword from './components/ForgotPassword';
import ResearchPapers from './components/ResearchPapers';

// Lazy-loaded components
const Results = lazy(() => import('./components/Results'));
const ReportsHistory = lazy(() => import('./components/ReportsHistory'));
const Reports = lazy(() => import('./components/Reports'));

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<div className="h-screen flex justify-center items-center">Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/research-papers" element={<ResearchPapers />} />
            
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            
            {/* The Upload component is used for both /demo and /upload */}
            <Route path="/demo" element={<Upload />} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            
            {/* Lazy-loaded routes */}
            <Route path="/results" element={<Results />} />
            <Route path="/reports-history" element={<ProtectedRoute><ReportsHistory /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          </Routes>
        </Suspense>
        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
      </AuthProvider>
    </Router>
  );
};

export default App;