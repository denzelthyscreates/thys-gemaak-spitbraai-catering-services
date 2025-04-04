
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
        src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788542/TGS_Icon_t4gc9n.png" 
        alt="Thys Gemaak Spitbraai Catering Services Logo" 
        className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
        onError={(e) => console.error("Logo failed to load:", e)}
      />
      <span className={`font-serif text-xl font-semibold tracking-tight transition-colors duration-300 ${
        isScrolled ? 'text-foreground' : 'text-foreground'
      }`}>
        Thys Gemaak Spitbraai Catering Services
      </span>
    </Link>
  );
};

export default Brand;
