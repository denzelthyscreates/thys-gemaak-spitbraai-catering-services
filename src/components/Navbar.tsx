
import { useState, useEffect } from 'react';
import { ChefHat, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-white shadow-subtle' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-width flex items-center justify-between">
        <a 
          href="#" 
          className="flex items-center gap-2 group"
          aria-label="Thys Gemaak Spitbraai Catering"
        >
          <ChefHat 
            className={`h-8 w-8 transition-colors duration-300 ${
              isScrolled ? 'text-primary' : 'text-primary'
            }`} 
          />
          <span className={`font-serif text-xl font-semibold tracking-tight transition-colors duration-300 ${
            isScrolled ? 'text-foreground' : 'text-foreground'
          }`}>
            Thys Gemaak
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {['Home', 'About', 'Services', 'Testimonials', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className={`text-base font-medium transition-colors duration-200 hover:text-primary ${
                    isScrolled ? 'text-foreground' : 'text-foreground'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="button-primary">
            Book Now
          </a>
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
                <a
                  href={`#${item.toLowerCase()}`}
                  className="block py-3 text-center text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  {item}
                </a>
              </li>
            ))}
            <li className="w-full mt-4 slide-in-bottom delay-500">
              <a
                href="#contact"
                className="block w-full text-center button-primary"
                onClick={toggleMenu}
              >
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
