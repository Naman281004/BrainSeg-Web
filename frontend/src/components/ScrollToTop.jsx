import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Utility function that can be exported and used anywhere in the app
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Component that scrolls to the top of the page when the route changes
 */
function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname, hash, or key changes
    scrollToTop();
  }, [pathname, hash, key]);

  return null; // This component doesn't render anything
}

export default ScrollToTop; 