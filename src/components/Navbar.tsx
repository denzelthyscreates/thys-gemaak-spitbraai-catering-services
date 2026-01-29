
import React from 'react';
import Brand from './navigation/Brand';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import { useNavbar } from './navigation/useNavbar';

const Navbar = () => {
  const { isMenuOpen, toggleMenu } = useNavbar();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 bg-white shadow-subtle w-full">
      <div className="container-width flex items-center justify-between">
        <Brand isScrolled={true} />
        <DesktopNav isScrolled={true} />
        <MobileNav isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
    </header>
  );
};

export default Navbar;
