
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isHashLink?: boolean;
  hashTarget?: string;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ 
  to, 
  children, 
  isHashLink = false, 
  hashTarget, 
  onClick,
  className = "text-base font-medium transition-colors duration-200 hover:text-primary"
}: NavLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHashLink && hashTarget) {
      e.preventDefault();
      
      // If we're not on the home page, navigate to home first then to the target section
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
        // We need to wait a bit for the navigation to complete before scrolling
        setTimeout(() => {
          const element = document.getElementById(hashTarget);
          if (element) {
            window.scrollTo({
              top: element.offsetTop - 80, // Offset for navbar
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        // If we're already on the home page, just scroll to the section
        const element = document.getElementById(hashTarget);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80, // Offset for navbar
            behavior: 'smooth'
          });
        }
      }
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      to={to}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
