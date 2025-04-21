
import React, { useState, useEffect } from "react";

// Curated gallery images used for the carousel
const heroImages = [
  {
    id: '1',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788469/IMG-20241110-WA0010_umlczd.jpg'
  },
  {
    id: '2',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788468/IMG-20241110-WA0014_wfywk3.jpg'
  },
  {
    id: '3',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788467/IMG-20241110-WA0015_xrads9.jpg'
  },
  {
    id: '4',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788467/IMG-20241110-WA0012_k3zeob.jpg'
  },
  {
    id: '5',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0022_k5cdid.jpg'
  },
  {
    id: '6',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0033_vcwpvp.jpg'
  },
  {
    id: '7',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788465/IMG-20241110-WA0036_snwetl.jpg'
  },
  {
    id: '8',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0024_fasc43.jpg'
  },
  {
    id: '9',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0028_og9dmr.jpg'
  },
  {
    id: '10',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740791600/IMG-20240826-WA0043_zlnaci.jpg'
  }
];

const AUTOPLAY_INTERVAL = 3500; // ms

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Autoplay functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500); // Fade transition time
    }, AUTOPLAY_INTERVAL);

    return () => clearTimeout(timer);
  }, [current]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((old) => (old - 1 + heroImages.length) % heroImages.length);
        setIsTransitioning(false);
      }, 500);
    }
    if (e.key === "ArrowRight") {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((old) => (old + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500);
    }
  };

  return (
    <div
      className="absolute inset-0 -z-10"
      tabIndex={0}
      aria-label="Event Gallery Carousel"
      onKeyDown={handleKeyDown}
      role="region"
    >
      <div className="w-full h-full">
        {heroImages.map((img, idx) => (
          <div
            key={img.id}
            className={`h-full transition-opacity duration-1000 ease-in-out absolute w-full inset-0 ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img.url}
              alt={`Event photo ${idx + 1}`}
              className="object-cover w-full h-full transition-transform duration-1000"
              draggable={false}
              style={{
                filter: "brightness(0.6)",
                pointerEvents: "none",
                userSelect: "none",
                minHeight: "400px",
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === current ? "bg-primary" : "bg-white/40"
            }`}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrent(idx);
                setIsTransitioning(false);
              }, 500);
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
