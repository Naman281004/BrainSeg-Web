import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Footer from './components/Footer'
import SignIn from './components/SignIn'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Upload from './components/Upload'
import Results from './components/Results'
import { Toaster } from 'react-hot-toast';
import Contact from './components/Contact'
import ReportsHistory from './components/ReportsHistory'
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/signin" element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } />

              <Route path="/upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportsHistory />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer/>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
