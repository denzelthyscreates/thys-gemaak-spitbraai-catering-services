
import React from 'react';
import { Link } from 'react-router-dom';

interface BrandProps {
  isScrolled: boolean;
}

const Brand = ({ isScrolled }: BrandProps) => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 group flex-shrink min-w-0"
      aria-label="Thys Gemaak Spitbraai Catering Services"
    >
      <img 
        src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1747773654/TGS_icon_website_navbar_180x200px_a0epx3.png" 
        alt="Thys Gemaak Spitbraai Catering Services Logo" 
        className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
      />
      <span className="font-montserrat font-semibold tracking-tight transition-colors duration-300 text-foreground text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl truncate">
        <span className="lg:hidden">Thys Gemaak Spitbraai</span>
        <span className="hidden lg:inline">Thys Gemaak Spitbraai Catering Services</span>
      </span>
    </Link>
  );
};

export default Brand;
