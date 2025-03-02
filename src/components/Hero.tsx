
import { ArrowRight } from 'lucide-react';
import React, { useEffect } from 'react';

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
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden scroll-mt-20 transition-all duration-700 transform"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-earth-200 blur-[100px]" />
        <div className="absolute left-1/3 top-1/3 h-[500px] w-[500px] rounded-full bg-spice-200 blur-[100px]" />
      </div>

      <div className="container-width">
        <div className="mx-auto max-w-8xl text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary animate-fade-in">
            Revolutionizing Traditional Spitbraai
          </span>
          
          <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6 animate-slide-down">
            Premium South African Spitbraai for Every Occasion
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-down delay-100">
            Combining timeless tradition with modern innovation to deliver exceptional 
            catering experiences for private, corporate, and large-scale events.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-down delay-200">
            <a href="#contact" className="button-primary transform transition-transform hover:scale-105">
              Book Your Experience
            </a>
            <a href="#services" className="button-outline flex items-center justify-center gap-2 group transform transition-transform hover:scale-105">
              Explore Services
              <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* For a full viewport width image that breaks out of container */}
        <div className="mt-16 lg:mt-24">
          <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden rounded-xl border border-border shadow-prominent animate-scale-in">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740791600/IMG-20240826-WA0043_zlnaci.jpg" 
                alt="Traditional South African Spitbraai" 
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-white text-foreground mb-3">
                  Premium Quality
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-white max-w-lg">
                  Authentic South African spitbraai catering, crafted with passion and precision
                </h3>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="p-6 flex-1 hover:bg-primary/5 transition-colors duration-300">
                <span className="block text-sm font-medium text-muted-foreground mb-1">Private Events</span>
                <span className="text-lg font-medium">Intimate gatherings with personalized service</span>
              </div>
              <div className="p-6 flex-1 hover:bg-primary/5 transition-colors duration-300">
                <span className="block text-sm font-medium text-muted-foreground mb-1">Corporate Functions</span>
                <span className="text-lg font-medium">Professional catering for business events</span>
              </div>
              <div className="p-6 flex-1 hover:bg-primary/5 transition-colors duration-300">
                <span className="block text-sm font-medium text-muted-foreground mb-1">Large Celebrations</span>
                <span className="text-lg font-medium">Scalable solutions for hundreds of guests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
