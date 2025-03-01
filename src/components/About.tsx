
import { Calendar, Users, CookingPot } from 'lucide-react';

const About = () => {
  const stats = [
    { 
      id: 1, 
      icon: <Calendar className="h-6 w-6 text-earth-700" />,
      label: 'Founded', 
      value: 'January 2024' 
    },
    { 
      id: 2, 
      icon: <Users className="h-6 w-6 text-earth-700" />,
      label: 'Team Members', 
      value: '15+' 
    },
    { 
      id: 3, 
      icon: <CookingPot className="h-6 w-6 text-earth-700" />,
      label: 'Events Catered', 
      value: '100+' 
    },
  ];

  return (
    <section id="about" className="section bg-secondary/30">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-prominent">
              <img 
                src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788458/IMG-20241110-WA0049_esye9b.jpg" 
                alt="Thys Gemaak Spitbraai Catering Services Team Preparing Spitbraai" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-spice-100 rounded-xl -z-10"></div>
          </div>

          {/* Content Column */}
          <div>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Our Story
            </span>
            
            <h2 className="h2 mb-6">Revolutionizing Spitbraai Catering in South Africa</h2>
            
            <div className="space-y-6 text-muted-foreground">
              <p>
                Thys Gemaak Spitbraai Catering Services was founded with a vision to democratize premium spitbraai experiences. 
                We combine South African culinary traditions with innovative booking and operational systems to make 
                exceptional catering accessible to all.
              </p>
              <p>
                Our approach merges time-honored cooking techniques with modern technology, allowing us to scale 
                efficiently while maintaining the authentic flavors and quality that define a true South African spitbraai.
              </p>
              <p>
                Beyond delicious food, we're committed to creating employment opportunities within our communities and 
                setting a new standard for inclusive, tech-enabled event services throughout South Africa.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-white rounded-lg p-6 shadow-subtle border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    {stat.icon}
                    <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
