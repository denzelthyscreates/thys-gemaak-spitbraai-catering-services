
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  // Implement smooth scrolling
  useEffect(() => {
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

    // Add event listeners to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleScrollToElement as EventListener);
    });

    // Cleanup
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleScrollToElement as EventListener);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
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
