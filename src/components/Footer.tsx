
import { Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-10">
            <div className="flex items-center gap-2">
              <img 
                src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788541/TGS_Logo_v2_es4u0x.png" 
                alt="Thys Gemaak Spitbraai Catering Services Logo" 
                className="h-60 w-auto"
                onError={(e) => console.error("Logo failed to load in footer:", e)}
              />
              <span className="font-serif text-xl font-semibold tracking-tight">
              
              </span>
            </div>
            <p className="text-blue-100">
              Providing quality spitbraai catering services throughout the Western Cape.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/share/15vy455DHt/" 
                className="p-2 rounded-full bg-blue-800 hover:bg-secondary transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Services', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-blue-100 hover:text-secondary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-4">
              {[
                'Private Events', 
                'Corporate Functions', 
                'Weddings', 
                'Large Celebrations', 
                'Custom Catering'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#services" 
                    className="text-blue-100 hover:text-secondary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-blue-100">
              <li>75 School Street, Kylemore, Stellenbosch, 7600</li>
              <li>+27 67 456 7784</li>
              <li>info@thysgemaak.com</li>
              <li>Monday - Friday: 9:00 - 17:00</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-800 text-center md:flex md:justify-between md:items-center">
          <p className="text-blue-200">
            &copy; {currentYear} Thys Gemaak Spitbraai Catering Services. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap justify-center md:justify-end gap-6 text-sm text-blue-200">
              <li><a href="/privacy-policy" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="/cookie-policy" className="hover:text-secondary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
