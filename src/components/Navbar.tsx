
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle smooth scrolling for hash links on the home page
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate to home first then to the target section
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      // We need to wait a bit for the navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80, // Offset for navbar
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // If we're already on the home page, just scroll to the section
      const element = document.getElementById(target);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80, // Offset for navbar
          behavior: 'smooth'
        });
      }
    }
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-white shadow-subtle' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-width flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
          aria-label="Thys Gemaak Spitbraai Catering Services"
        >
          <img 
            src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788542/TGS_Icon_t4gc9n.png" 
            alt="Thys Gemaak Spitbraai Catering Services Logo" 
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            onError={(e) => console.error("Logo failed to load:", e)}
          />
          <span className={`font-serif text-xl font-semibold tracking-tight transition-colors duration-300 ${
            isScrolled ? 'text-foreground' : 'text-foreground'
          }`}>
            Thys Gemaak Spitbraai Catering Services
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {['Home', 'About', 'Services', 'Testimonials', 'Contact'].map((item) => (
              <li key={item}>
                {item.toLowerCase() === 'home' ? (
                  <Link
                    to="/"
                    className={`text-base font-medium transition-colors duration-200 hover:text-primary ${
                      isScrolled ? 'text-foreground' : 'text-foreground'
                    }`}
                  >
                    {item}
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className={`text-base font-medium transition-colors duration-200 hover:text-primary ${
                      isScrolled ? 'text-foreground' : 'text-foreground'
                    }`}
                    onClick={(e) => handleNavClick(e, item.toLowerCase())}
                  >
                    {item}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link 
            to="/"
            className="button-primary"
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center p-2"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-[60px] left-0 right-0 h-screen bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container-width py-8">
          <ul className="flex flex-col items-center gap-6">
            {['Home', 'About', 'Services', 'Testimonials', 'Contact'].map((item, index) => (
              <li key={item} className={`w-full slide-in-bottom delay-${index * 100}`}>
                {item.toLowerCase() === 'home' ? (
                  <Link
                    to="/"
                    className="block py-3 text-center text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="block py-3 text-center text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={(e) => handleNavClick(e, item.toLowerCase())}
                  >
                    {item}
                  </Link>
                )}
              </li>
            ))}
            <li className="w-full mt-4 slide-in-bottom delay-500">
              <Link
                to="/"
                className="block w-full text-center button-primary"
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
