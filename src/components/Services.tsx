
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
      title: 'Corporate Functions',
      description: 'Impress clients and reward employees with our professional corporate catering. From office parties to client presentations, we deliver exceptional food with seamless execution.',
      features: [
        'Branded presentation options',
        'Dietary accommodation',
        'Flexible scheduling',
        'Corporate package discounts',
      ],
    },
    {
      id: 3,
      icon: <Cake className="h-10 w-10 text-earth-700" />,
      title: 'Large Celebrations',
      description: 'Our scalable approach allows us to cater events of any size without compromising quality. Wedding receptions, festivals, and community gatherings are all within our expertise.',
      features: [
        'High-volume capacity',
        'Multiple serving stations',
        'Coordination with event planners',
        'Consistent quality regardless of scale',
      ],
    },
  ];

  return (
    <section id="services" className="section">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            Our Services
          </span>
          <h2 className="h2 mb-6">Premium Spitbraai Catering for Every Occasion</h2>
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
              className="relative group bg-white border border-border rounded-xl overflow-hidden shadow-subtle transition-all duration-300 hover:shadow-prominent"
            >
              {/* Service Card Content */}
              <div className="p-8">
                <div className="mb-6">{service.icon}</div>
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
                  className="block w-full mt-8 py-3 px-6 text-center rounded-md border border-primary text-primary font-medium transition-colors hover:bg-primary hover:text-white"
                >
                  Inquire Now
                </a>
              </div>
              
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-earth-400 via-earth-600 to-earth-800 transform origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          ))}
        </div>
        
        {/* Additional Services Info */}
        <div className="mt-16 p-8 bg-clay-50 rounded-xl border border-border">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-4">Custom Catering Solutions</h3>
              <p className="text-muted-foreground mb-6">
                Don't see exactly what you need? We pride ourselves on flexibility and can create bespoke catering 
                packages tailored to your specific requirements and budget.
              </p>
              <a href="#contact" className="button-primary">
                Discuss Your Needs
              </a>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Custom Catering Solutions" 
                className="rounded-lg shadow-subtle max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
