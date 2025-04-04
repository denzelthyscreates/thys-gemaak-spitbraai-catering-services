
import React from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';
import { useAuth } from '@/contexts/auth';

interface NavItem {
  name: string;
  path: string;
  isHashLink: boolean;
}

interface DesktopNavProps {
  isScrolled: boolean;
}

const DesktopNav = ({ isScrolled }: DesktopNavProps) => {
  const { user } = useAuth();
  
  const navItems: NavItem[] = [
    { name: 'Home', path: '/', isHashLink: false },
    { name: 'About', path: '/', isHashLink: true },
    { name: 'Services', path: '/', isHashLink: true },
    { name: 'Gallery', path: '/', isHashLink: true },
    { name: 'Testimonials', path: '/', isHashLink: true },
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
              hashTarget={item.isHashLink ? item.name.toLowerCase() : undefined}
              className={`text-base font-medium transition-colors duration-200 hover:text-primary ${
                isScrolled ? 'text-foreground' : 'text-foreground'
              }`}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
        
        {/* Account Link */}
        <li>
          <NavLink
            to="/auth"
            className={`flex items-center gap-1 text-base font-medium transition-colors duration-200 hover:text-primary ${
              isScrolled ? 'text-foreground' : 'text-foreground'
            }`}
          >
            <User size={18} />
            {user ? 'Account' : 'Sign In'}
          </NavLink>
        </li>
      </ul>
      
      <NavLink 
        to="/"
        isHashLink={true}
        hashTarget="contact"
        className="button-primary"
      >
        Book Now
      </NavLink>
    </nav>
  );
};

export default DesktopNav;
