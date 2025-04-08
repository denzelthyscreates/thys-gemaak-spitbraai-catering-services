
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Clear event listener on component unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      } hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5 text-white" />
    </button>
  );
};

export default ScrollToTop;
