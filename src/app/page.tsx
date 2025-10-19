'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import LazySection from '@/components/home/LazySection';

// Lazy load components for better performance
const StatsSection = dynamic(() => import('@/components/home/StatsSection'), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />
});

const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />
});

const CategoriesSection = dynamic(() => import('@/components/home/CategoriesSection'), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />
});

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />
});

const CTASection = dynamic(() => import('@/components/home/CTASection'), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />
});

export default function Home() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = [heroRef.current, statsRef.current, featuresRef.current, categoriesRef.current, testimonialsRef.current];
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div ref={heroRef} id="hero">
        <HeroSection isVisible={isVisible['hero']} />
      </div>

      {/* Stats Section */}
      <div ref={statsRef} id="stats">
        <StatsSection isVisible={isVisible['stats']} />
      </div>

      {/* Features Section */}
      <div ref={featuresRef} id="features">
        <FeaturesSection isVisible={isVisible['features']} />
      </div>

      {/* Categories Section */}
      <div ref={categoriesRef} id="categories">
        <CategoriesSection isVisible={isVisible['categories']} />
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} id="testimonials">
        <TestimonialsSection isVisible={isVisible['testimonials']} />
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}