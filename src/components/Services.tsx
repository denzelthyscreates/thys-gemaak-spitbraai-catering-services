
import { Check, Users, Building, Cake } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: <Users className="h-10 w-10 text-earth-700" />,
      title: 'Private Events',
      description: 'Intimate gatherings deserve special attention. Our private event catering brings premium spitbraai to birthdays, anniversaries, and family reunions with personalized menus and attentive service.',
      features: [
        'Customized menu options',
        'Flexible serving styles',
        'Full setup and cleanup',
        'Experienced serving staff',
      ],
    },
    {
      id: 2,
      icon: <Building className="h-10 w-10 text-earth-700" />,
      title: 'Business Functions',
      description: 'Impress clients and reward employees with our professional business catering. From office parties to client presentations, we deliver exceptional food with seamless execution.',
      features: [
        'Branded presentation options',
        'Dietary accommodation',
        'Flexible scheduling',
        'Volume discounts for 100+ guests',
      ],
    },
    {
      id: 3,
      icon: <Cake className="h-10 w-10 text-earth-700" />,
      title: 'Large Celebrations',
      description: 'Our scalable approach allows us to cater events of any size without compromising quality. Wedding receptions, year-end functions, graduation parties, festivals, and community gatherings are all within our expertise.',
      features: [
        'High-volume capacity',
        'Multiple serving stations',
        'Coordination with event planners',
        'Consistent quality regardless of scale',
      ],
    },
  ];

  return (
    <section id="services" className="section scroll-mt-20 transition-all duration-700 transform">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-xl font-medium rounded-full bg-primary/10 text-primary">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6 animate-slide-down">
            Premium Spitbraai Catering for Every Occasion
          </h2>
          <p className="text-lg text-muted-foreground">
            From intimate gatherings to large-scale events, we offer tailored spitbraai experiences that combine 
            authentic South African flavors with exceptional service.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`relative group bg-white border border-border rounded-xl overflow-hidden shadow-subtle transition-all duration-500 hover:shadow-prominent animate-fade-in delay-${index * 100}`}
            >
              {/* Service Card Content */}
              <div className="p-8">
                <div className="mb-6 transform transition-transform group-hover:scale-110 duration-300">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                
                {/* Features List */}
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Card Footer */}
              <div className="mt-auto p-8 pt-0">
                <a 
                  href="#contact" 
                  className="block w-full mt-8 py-3 px-6 text-center rounded-md border border-primary text-primary font-medium transition-all duration-300 hover:bg-primary hover:text-white transform hover:scale-105"
                >
                  Inquire Now
                </a>
              </div>
              
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-earth-400 via-earth-600 to-earth-800 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          ))}
        </div>
        
        {/* Additional Services Info */}
        <div className="mt-16 p-8 bg-clay-50 rounded-xl border border-border animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-4">Custom Catering Solutions</h3>
              <p className="text-muted-foreground mb-6">
                Don't see exactly what you need? We pride ourselves on flexibility and can create bespoke catering 
                packages tailored to your specific requirements and budget.
              </p>
              <a href="#contact" className="button-primary transform transition-all duration-300 hover:scale-105">
                Discuss Your Needs
              </a>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0033_vcwpvp.jpg" 
                alt="Custom Catering Solutions" 
                className="rounded-lg shadow-subtle max-w-full h-auto transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
