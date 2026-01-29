import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import UploadGallery from '../components/gallery/UploadGallery';
import ScrollToTop from '../components/ScrollToTop';
import { Toaster } from '../components/ui/toaster';
import SecurityAnnouncementBanner from '../components/SecurityAnnouncementBanner';

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.8;
        
        if (sectionTop < triggerPoint) {
          section.classList.add('animate-enter');
        }
      });
    };
    
    const handleScrollToElement = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = target.getAttribute('href');

      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const elementId = href.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
          // Check if we're navigating to the contact section
          const isContactSection = elementId === 'contact';
          
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // If we're navigating to contact section, ensure we're on the menu tab
          if (isContactSection) {
            localStorage.setItem('activeTab', 'menu');
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleScrollToElement as EventListener);
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleScrollToElement as EventListener);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div 
        className="scroll-indicator" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      <Navbar />
      <div className="pt-[72px] md:pt-[80px]">
        <SecurityAnnouncementBanner />
        <main className="flex-grow">
          <Hero />
          <div id="about"><About /></div>
          <div id="services"><Services /></div>
          <div id="testimonials"><Testimonials /></div>
          
          <section id="gallery" className="section py-16 bg-muted/30 scroll-mt-20">
            <div className="container-width">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="inline-block px-4 py-1.5 mb-6 text-xl font-medium rounded-full bg-primary/10 text-primary">
                  Our Gallery
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6">
                  Our Event Showcase
                </h2>
                <p className="text-lg text-muted-foreground">
                  Browse through photos from our recent catering events and spitbraai experiences.
                </p>
              </div>
              
              <div className="mt-12">
                <UploadGallery />
              </div>
            </div>
          </section>
          
          <div id="contact"><Contact /></div>
        </main>
      </div>
      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

export default Index;
