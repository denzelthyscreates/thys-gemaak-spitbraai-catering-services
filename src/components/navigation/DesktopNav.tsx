
import React from 'react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';

interface NavItem {
  name: string;
  path: string;
  isHashLink: boolean;
}

interface DesktopNavProps {
  isScrolled: boolean;
}

const DesktopNav = ({ isScrolled }: DesktopNavProps) => {
  const navItems: NavItem[] = [
    { name: 'Home', path: '#home', isHashLink: true },
    { name: 'About', path: '/', isHashLink: true },
    { name: 'Services', path: '/', isHashLink: true },
    { name: 'Testimonials', path: '/', isHashLink: true },
    { name: 'Gallery', path: '/', isHashLink: true },
    { name: 'Contact', path: '/', isHashLink: true },
  ];

  return (
    <nav className="hidden md:flex items-center gap-8">
      <ul className="flex items-center gap-8">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              isHashLink={item.isHashLink}
              hashTarget={item.isHashLink && item.name !== 'Home' ? item.name.toLowerCase() : item.name === 'Home' ? 'home' : undefined}
              className={`text-base font-medium transition-colors duration-200 hover:text-primary ${
                isScrolled ? 'text-foreground' : 'text-foreground'
              }`}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
      
      <Link 
        to="/booking"
        className="button-primary"
      >
        Book Now
      </Link>
    </nav>
  );
};

export default DesktopNav;
