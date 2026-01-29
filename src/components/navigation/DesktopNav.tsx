
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import NavLink from './NavLink';
import { useAuth } from '@/contexts/auth';
import { useAdminCheck } from '@/hooks/useAdminCheck';

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
  const { isAdmin } = useAdminCheck();
  
  const navItems: NavItem[] = [
    { name: 'Home', path: '#home', isHashLink: true },
    { name: 'About', path: '/', isHashLink: true },
    { name: 'Services', path: '/', isHashLink: true },
    { name: 'Testimonials', path: '/', isHashLink: true },
    { name: 'Gallery', path: '/', isHashLink: true },
    { name: 'Contact', path: '/', isHashLink: true },
  ];

  return (
    <nav className="hidden md:flex items-center gap-6">
      <ul className="flex items-center gap-6">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              isHashLink={item.isHashLink}
              hashTarget={item.isHashLink && item.name !== 'Home' ? item.name.toLowerCase() : item.name === 'Home' ? 'home' : undefined}
              className="text-base font-medium transition-colors duration-200 hover:text-primary text-foreground"
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
      
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link 
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Admin
          </Link>
        )}
        
        <Link 
          to="/auth"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <User className="h-4 w-4" />
          {user ? 'My Account' : 'Sign In'}
        </Link>
        
        <Link 
          to="/booking"
          className="button-primary"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNav;
