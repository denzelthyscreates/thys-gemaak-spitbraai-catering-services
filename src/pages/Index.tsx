
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

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
        <div id="contact"><Contact /></div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
