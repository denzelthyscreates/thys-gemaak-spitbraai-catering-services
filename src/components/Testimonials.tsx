
import { useEffect } from 'react';

const Testimonials = () => {
  useEffect(() => {
    // Load Elfsight script dynamically if it's not already loaded
    if (!document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]')) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section id="testimonials" className="section bg-gradient-to-b from-white to-clay-50 scroll-mt-20 transition-all duration-700 transform">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-xl font-medium rounded-full bg-primary/10 text-primary">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6 animate-slide-down">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            We take pride in delivering exceptional spitbraai experiences. See what our clients have to say
            about our catering services.
          </p>
        </div>

        {/* Elfsight Facebook Reviews Widget */}
        <div className="elfsight-app-904a425e-bfa8-425a-90df-7fc2e7b84d98" data-elfsight-app-lazy></div>
      </div>
    </section>
  );
};

export default Testimonials;
