
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Thys Gemaak transformed our corporate event with their exceptional spitbraai catering. The food was outstanding, and their tech-driven service made the booking and planning process incredibly smooth.",
      author: "Michael Johnson",
      title: "Event Manager at Cape Technologies",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      id: 2,
      quote: "For our daughter's wedding, we wanted something unique and memorable. Thys Gemaak delivered beyond our expectations with their premium spitbraai. Our guests are still talking about the food months later!",
      author: "Sarah Nkosi",
      title: "Mother of the Bride",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      id: 3,
      quote: "As someone who organizes community events, I appreciate how Thys Gemaak scales their service without sacrificing quality. Their pricing is fair, and the spitbraai was absolutely delicious.",
      author: "David Pretorius",
      title: "Community Organizer",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      rating: 5
    },
    {
      id: 4,
      quote: "The seamless booking process and exceptional communication made planning our company's year-end function stress-free. The spitbraai itself was the highlight of the event!",
      author: "Thandi Mbeki",
      title: "HR Director",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section bg-gradient-to-b from-white to-clay-50">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            Testimonials
          </span>
          <h2 className="h2 mb-6">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground">
            We take pride in delivering exceptional spitbraai experiences. Here's what some of our clients have to say 
            about our catering services.
          </p>
        </div>

        {/* Desktop Testimonials Grid */}
        <div className="hidden md:grid grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-xl p-8 border border-border shadow-subtle flex flex-col h-full"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="flex-1">
                <p className="text-lg mb-6">"{testimonial.quote}"</p>
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-4 mt-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Testimonial Carousel */}
        <div className="md:hidden">
          <div className="bg-white rounded-xl p-8 border border-border shadow-subtle">
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < testimonials[activeIndex].rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            
            {/* Quote */}
            <blockquote>
              <p className="text-lg mb-6">"{testimonials[activeIndex].quote}"</p>
            </blockquote>
            
            {/* Author */}
            <div className="flex items-center gap-4 mt-4">
              <img 
                src={testimonials[activeIndex].avatar} 
                alt={testimonials[activeIndex].author} 
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{testimonials[activeIndex].author}</h4>
                <p className="text-sm text-muted-foreground">{testimonials[activeIndex].title}</p>
              </div>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex justify-between mt-8">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-1">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      activeIndex === index ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
