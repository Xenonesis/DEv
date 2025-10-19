'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialsSectionProps {
  isVisible: boolean;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export default function TestimonialsSection({ isVisible }: TestimonialsSectionProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials: Testimonial[] = [
    {
      name: "Alex Thompson",
      role: "Full-Stack Developer",
      content: "NeoFest completely transformed my career. The competitions pushed me to learn new technologies and the community support was incredible.",
      rating: 5,
      avatar: "AT"
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      content: "I've won 3 competitions through NeoFest! The platform is intuitive, the challenges are relevant, and the networking opportunities are priceless.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Data Scientist",
      content: "The AI challenges on NeoFest helped me build a portfolio that landed me my dream job. Can't recommend it enough!",
      rating: 5,
      avatar: "MR"
    }
  ];

  // Testimonial auto-rotation
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible, testimonials.length]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 text-purple-600 dark:text-purple-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-md border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
            <MessageSquare size={18} />
            <span className="font-semibold">Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4">
            What Our 
            <span className="block sm:inline bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Winners Say</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Join thousands of developers who have transformed their careers through NeoFest competitions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-50/50 via-card to-blue-50/50 dark:from-purple-950/10 dark:via-card dark:to-blue-950/10 border shadow-2xl overflow-hidden relative backdrop-blur-xl">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-blue-100/30 dark:from-purple-950/5 dark:to-blue-950/5"></div>
            
            <CardContent className="p-6 sm:p-8 md:p-12 relative z-10">
              <div className="flex mb-4 sm:mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="text-yellow-500 fill-current animate-pulse w-5 h-5 sm:w-6 sm:h-6" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <blockquote className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 italic leading-relaxed">
                "{testimonials[activeTestimonial].content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-base sm:text-lg">
                    {testimonials[activeTestimonial].avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-base sm:text-lg">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced testimonial dots */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeTestimonial === index
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 w-8 sm:w-12'
                    : 'bg-muted hover:bg-purple-300 dark:hover:bg-purple-700 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}