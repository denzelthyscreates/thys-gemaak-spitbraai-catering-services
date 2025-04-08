
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import UploadGallery from '../components/gallery/UploadGallery';

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll animations and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress for the progress bar
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Handle section animations
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.8;
        
        if (sectionTop < triggerPoint) {
          section.classList.add('animate-enter');
        }
      });
    };
    
    // Smooth scroll to element
    const handleScrollToElement = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = target.getAttribute('href');

      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const elementId = href.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80, // Offset for navbar
            behavior: 'smooth'
          });
        }
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleScrollToElement as EventListener);
    });

    // Initial call to set up animations for elements already in view
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleScrollToElement as EventListener);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Scroll Progress Indicator */}
      <div 
        className="scroll-indicator" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div id="about"><About /></div>
        <div id="services"><Services /></div>
        <div id="testimonials"><Testimonials /></div>
        
        {/* Gallery Section */}
        <section id="gallery" className="section py-16 bg-muted/30 scroll-mt-20">
          <div className="container-width">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 mb-6 text-xl font-medium rounded-full bg-primary/10 text-primary">
                Our Gallery
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6">
                See Our Recent Events
              </h2>
              <p className="text-lg text-muted-foreground">
                Browse through photos from our recent catering events and spitbraai experiences.
              </p>
            </div>
            <UploadGallery />
          </div>
        </section>
        
        <div id="contact"><Contact /></div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
