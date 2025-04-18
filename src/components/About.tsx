
import { Calendar, Users, CookingPot } from 'lucide-react';

const About = () => {
  const stats = [
    { 
      id: 1, 
      icon: <Calendar className="h-6 w-6 text-primary" />,
      label: 'Founded', 
      value: 'January 2024' 
    },
    { 
      id: 2, 
      icon: <Users className="h-6 w-6 text-primary" />,
      label: 'Team Members', 
      value: '6+' 
    },
    { 
      id: 3, 
      icon: <CookingPot className="h-6 w-6 text-primary" />,
      label: 'Events Catered', 
      value: '100+' 
    },
  ];

  return (
    <section id="about" className="section bg-primary/30">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image Column - Moved to align with title */}
          <div className="relative">
            <span className="inline-block px-4 py-1.5 mb-6 text-xl font-medium rounded-full bg-primary/20 text-primary">
              Our Story
            </span>
            
            <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-3">Improving Spitbraai Catering in South Africa</h2>
            
            <div className="relative z-10 rounded-xl overflow-hidden shadow-prominent mb-8">
              <img 
                src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788458/IMG-20241110-WA0049_esye9b.jpg" 
                alt="Thys Gemaak Spitbraai Catering Services Team Preparing Spitbraai" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            
            {/* New images in a grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden shadow-prominent">
                <img 
                  src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0022_k5cdid.jpg" 
                  alt="Thys Gemaak Spitbraai Preparation" 
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
              <div className="rounded-xl overflow-hidden shadow-prominent">
                <img 
                  src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0024_fasc43.jpg" 
                  alt="Thys Gemaak Spitbraai Event" 
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/5 rounded-xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/40 rounded-xl -z-10"></div>
          </div>

          {/* Content Column */}
          <div>
            <div className="space-y-6 text-foreground">
              <p>
                At Thys Gemaak Spitbraai Catering, we're not just changing the game, we're defining the future of catering. 
                Spitbraai is more than a meal; it's an experience, a symbol of togetherness, and a celebration. 
                But until now, it's been reserved for special occasions due to high costs and limited accessibility. That ends today!
              </p>
              <p>
                With over 10 years of hands-on experience, we officially launched in January 2024, ready to disrupt the market 
                by making premium spitbraai catering affordable, accessible, and scalable. As tech companies transformed their 
                respective industries, we are enhancing the spitbraai industry through modern approaches, lean operational models, 
                and effective digital solutions.
              </p>
              <p>
                At Thys Gemaak, we are breaking down barriers and delivering spitbraai catering that combines classic 
                open-fire cooking with efficiency and precision. Our vision is to become the premier 
                spitbraai catering company in South Africa, serving millions of customers, and setting the standard for modern 
                catering experiences globally.
              </p>
              
              <div className="p-4 bg-white/60 rounded-lg border border-primary/30 shadow-subtle">
                <h4 className="font-semibold text-foreground mb-2">Key Vision:</h4>
                <p className="text-muted-foreground">
                  We aim to create an inclusive, culturally rich catering ecosystem where premium spitbraai experiences are no longer 
                  exclusive but a universally accessible option for everyone—from corporate giants to families in local communities.
                </p>
              </div>
              
              <div className="p-4 bg-white/60 rounded-lg border border-primary/30 shadow-subtle">
                <h4 className="font-semibold text-foreground mb-2">Mission Statement:</h4>
                <p className="text-muted-foreground">
                  To redefine spitbraai catering by using a scalable operational model to deliver 
                  affordable, premium-quality experiences while uplifting local communities through job creation and socioeconomic empowerment.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-white/70 rounded-lg p-6 shadow-subtle border border-primary/20">
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
