import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  

  if (currentUser && (location.pathname === '/signin' || location.pathname === '/register')) {
    return <Navigate to="/upload" replace />;
  }
  
  return children;
};

export default PublicRoute; 