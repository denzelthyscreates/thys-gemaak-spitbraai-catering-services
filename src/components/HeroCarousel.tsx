
import React, { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const heroImages = [
  {
    id: "1",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788469/IMG-20241110-WA0010_umlczd.jpg",
  },
  {
    id: "2",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788468/IMG-20241110-WA0014_wfywk3.jpg",
  },
  {
    id: "3",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788467/IMG-20241110-WA0015_xrads9.jpg",
  },
  {
    id: "4",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788467/IMG-20241110-WA0012_k3zeob.jpg",
  },
  {
    id: "5",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0022_k5cdid.jpg",
  },
  {
    id: "6",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0033_vcwpvp.jpg",
  },
  {
    id: "7",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788465/IMG-20241110-WA0036_snwetl.jpg",
  },
  {
    id: "8",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0024_fasc43.jpg",
  },
  {
    id: "9",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0028_og9dmr.jpg",
  },
  {
    id: "10",
    url: "https://res.cloudinary.com/dlsjdyti8/image/upload/v1740791600/IMG-20240826-WA0043_zlnaci.jpg",
  },
];

const AUTOPLAY_INTERVAL = 3500; // ms

const HeroCarousel = () => {
  const [current, setCurrent] = React.useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setCurrent((old) => (old - 1 + heroImages.length) % heroImages.length);
    if (e.key === "ArrowRight") setCurrent((old) => (old + 1) % heroImages.length);
  };

  return (
    <div
      className="absolute inset-0 -z-10"
      tabIndex={0}
      aria-label="Event Gallery Carousel"
      onKeyDown={handleKeyDown}
      role="region"
    >
      <Carousel
        opts={{ loop: true }}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {heroImages.map((img, idx) => (
            <CarouselItem
              key={img.id}
              className={`h-full transition-opacity duration-1000 ease-in-out absolute w-full inset-0 ${
                idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={img.url}
                alt="Event photo"
                className="object-cover w-full h-full transition-transform duration-1000"
                draggable={false}
                style={{
                  filter: "brightness(0.6)",
                  pointerEvents: "none",
                  userSelect: "none",
                  minHeight: "400px",
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-3 h-3 rounded-full ${idx === current ? "bg-primary" : "bg-white/40"}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;

