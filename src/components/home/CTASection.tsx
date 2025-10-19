'use client';

import { ArrowRight, Zap, CheckCircle2, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float rounded-full bg-white/10 blur-sm"
            style={{
              width: Math.random() * 200 + 100 + 'px',
              height: Math.random() * 200 + 100 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 15 + 's'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-white/30 shadow-lg">
          <Zap className="animate-pulse w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold">Join 10,000+ Developers</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 px-4">
          Ready to Start Your 
          <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Journey?
          </span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
          Don't miss out on the opportunity to compete, learn, and grow. Join NeoFest today and take your tech career to the next level.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 px-4">
          <Button 
            asChild
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg group font-semibold rounded-xl"
          >
            <Link href="/auth/signup">
              <span className="flex items-center justify-center">
                Get Started Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </span>
            </Link>
          </Button>
          <Button 
            asChild
            size="lg" 
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-purple-600 backdrop-blur-md px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 font-semibold rounded-xl"
          >
            <Link href="/events">
              View Upcoming Events
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/90 text-xs sm:text-sm px-4">
          {[
            { icon: CheckCircle2, text: "No credit card required" },
            { icon: Zap, text: "Join in 2 minutes" },
            { icon: Rocket, text: "Start competing today" }
          ].map((item, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <item.icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}