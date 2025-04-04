
import React from 'react';
import Brand from './navigation/Brand';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import { useNavbar } from './navigation/useNavbar';

const Navbar = () => {
  const { isScrolled, isMenuOpen, toggleMenu } = useNavbar();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled ? 'py-3 bg-white shadow-subtle' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-width flex items-center justify-between">
        <Brand isScrolled={isScrolled} />
        <DesktopNav isScrolled={isScrolled} />
        <MobileNav isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
    </header>
  );
};

export default Navbar;
