
import React from 'react';
import { X, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';

interface MobileNavProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileNav = ({ isMenuOpen, toggleMenu }: MobileNavProps) => {
  const navItems = [
    { name: 'Home', path: '/', isHashLink: false },
    { name: 'About', path: '/', isHashLink: true },
    { name: 'Services', path: '/', isHashLink: true },
    { name: 'Gallery', path: '/', isHashLink: true },
    { name: 'Testimonials', path: '/', isHashLink: true },
    { name: 'Contact', path: '/', isHashLink: true },
  ];

  return (
    <>
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

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-[60px] left-0 right-0 w-full h-screen bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container-width py-8">
          <ul className="flex flex-col items-center gap-6">
            {navItems.map((item, index) => (
              <li key={item.name} className={`w-full slide-in-bottom delay-${index * 100}`}>
                <NavLink
                  to={item.path}
                  isHashLink={item.isHashLink}
                  hashTarget={item.isHashLink ? item.name.toLowerCase() : undefined}
                  onClick={toggleMenu}
                  className="block py-3 text-center text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            
            <li className="w-full mt-4 slide-in-bottom delay-600">
              <NavLink
                to="/"
                isHashLink={true}
                hashTarget="contact"
                onClick={toggleMenu}
                className="block w-full text-center button-primary"
              >
                Book Now
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
