import { ArrowRight } from 'lucide-react';
import React, { useEffect } from 'react';
import HeroCarousel from "./HeroCarousel";

const Hero = () => {
  useEffect(() => {
    // Add intersection observer for scroll animations
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-enter');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    sections.forEach((section) => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);
  
  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden scroll-mt-20 transition-all duration-700 transform flex items-center"
    >
      {/* Carousel replaces static background */}
      <HeroCarousel />
      {/* Background Pattern (reduced opacity) */}
      <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-earth-200 blur-[100px]" />
        <div className="absolute left-1/3 top-1/3 h-[500px] w-[500px] rounded-full bg-spice-200 blur-[100px]" />
      </div>

      <div className="container-width relative z-10">
        <div className="mx-auto max-w-8xl text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xl font-medium rounded-full bg-primary/20 text-white animate-fade-in">
            Enhanced Spitbraai Experience
          </span>
          
          <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-white mb-6 animate-slide-down">
            Premium South African Spitbraai for Every Occasion
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-down delay-100">
            Providing expertly prepared spitbraai with effective methods to deliver exceptional 
            catering experiences for private, business, and large-scale events.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-down delay-200">
            <a href="#contact" className="button-primary transform transition-transform hover:scale-105">
              Book Your Experience
            </a>
            <a 
              href="#services" 
              className="bg-white/20 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-md flex items-center justify-center gap-2 group transition-all hover:bg-white/30 transform hover:scale-105"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-scale-in">
            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-colors duration-300">
              <span className="block text-sm font-medium text-white/70 mb-1">Private Events</span>
              <span className="text-lg font-medium text-white">Intimate gatherings with personalized service</span>
            </div>
            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-colors duration-300">
              <span className="block text-sm font-medium text-white/70 mb-1">Corporate Functions</span>
              <span className="text-lg font-medium text-white">Professional catering for business events</span>
            </div>
            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-colors duration-300">
              <span className="block text-sm font-medium text-white/70 mb-1">Large Celebrations</span>
              <span className="text-lg font-medium text-white">Scalable solutions for hundreds of guests</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
