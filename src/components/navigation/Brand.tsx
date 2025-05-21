
import React from 'react';
import { Link } from 'react-router-dom';

interface BrandProps {
  isScrolled: boolean;
}

const Brand = ({ isScrolled }: BrandProps) => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 group"
      aria-label="Thys Gemaak Spitbraai Catering Services"
    >
      <img 
        src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1747773654/TGS_icon_website_navbar_180x200px_a0epx3.png" 
        alt="Thys Gemaak Spitbraai Catering Services Logo" 
        className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
      />
      <span className={`font-montserrat text-xl font-semibold tracking-tight transition-colors duration-300 ${
        isScrolled ? 'text-foreground' : 'text-foreground'
      }`}>
        Thys Gemaak Spitbraai Catering Services
      </span>
    </Link>
  );
};

export default Brand;
