
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
    <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 flex-1 justify-end">
      <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              isHashLink={item.isHashLink}
              hashTarget={item.isHashLink && item.name !== 'Home' ? item.name.toLowerCase() : item.name === 'Home' ? 'home' : undefined}
              className="text-sm lg:text-base font-medium transition-colors duration-200 hover:text-primary text-foreground whitespace-nowrap"
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
      
      <div className="flex items-center gap-2 lg:gap-3 ml-4 lg:ml-6">
        {isAdmin && (
          <Link 
            to="/admin"
            className="inline-flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors whitespace-nowrap"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden lg:inline">Admin</span>
          </Link>
        )}
        
        <Link 
          to="/auth"
          className="inline-flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
        >
          <User className="h-4 w-4" />
          <span className="hidden lg:inline">{user ? 'My Account' : 'Sign In'}</span>
          <span className="lg:hidden">{user ? 'Account' : 'Sign In'}</span>
        </Link>
        
        <Link 
          to="/booking"
          className="button-primary text-sm lg:text-base px-4 lg:px-6 whitespace-nowrap"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNav;
