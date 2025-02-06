import { Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import logo from "../assets/image.jpg";
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const isHomePage = location.pathname === '/';
  const isSignInPage = location.pathname === '/signin';
  
  return (
    <nav className={`sticky top-0 z-50 py-4 border-neutral-700/80 ${isHomePage || isSignInPage ? 'backdrop-blur-lg' : 'bg-background-dark'}`}>
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <Link to={currentUser ? "/upload" : "/"}>
            <img className="h-33 w-44 px-0" src={logo} alt="Logo" />
          </Link>
          <div className="hidden lg:flex items-center">
            {!isSignInPage && !currentUser && (
              <Link 
                to="/signin" 
                className="font-bold text-white text-2xl py-2 px-3 mr-[7rem]"
              >
                Sign in
              </Link>
            )}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="font-bold text-white text-2xl py-2 px-3 mr-[7rem]"
              >
                Log out
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-white"
              >
                <Menu size={45}/>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 text-center bg-background-dark rounded-md shadow-lg py-0">
                  {currentUser && (
                    <Link
                      to="/"
                      className="block px-4 py-5 text-xl font-bold text-white hover:bg-custom-blue transition-colors duration-800"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Home Page
                    </Link>
                  )}
                  {currentUser && (
                    <Link
                      to="/upload"
                      className="block px-4 py-5 text-xl font-bold text-white hover:bg-custom-blue transition-colors duration-800"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Upload
                    </Link>
                  )}
                  {currentUser && (
                    <Link
                      to="/reports"
                      className="block px-4 py-5 text-xl font-bold text-white
                      hover:bg-custom-blue transition-colors duration-800"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Reports
                    </Link>
                  )}
                  <Link
                    to="/contact"
                    className="block px-4 py-5 text-xl font-bold text-white 
                    hover:bg-custom-blue transition-colors duration-800"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

