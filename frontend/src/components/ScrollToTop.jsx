import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};


function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname, hash, key]);

  return null; 
}

export default ScrollToTop; 