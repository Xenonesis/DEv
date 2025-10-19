'use client';

import { useState, useEffect } from 'react';
import { Trophy, Users, Award, TrendingUp } from 'lucide-react';

interface StatsSectionProps {
  isVisible: boolean;
}

interface CounterState {
  competitions: number;
  participants: number;
  prizes: number;
  success: number;
}

export default function StatsSection({ isVisible }: StatsSectionProps) {
  const [counters, setCounters] = useState<CounterState>({
    competitions: 0,
    participants: 0,
    prizes: 0,
    success: 0
  });

  // Animated counters
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = {
      competitions: 100 / steps,
      participants: 10000 / steps,
      prizes: 500000 / steps,
      success: 95 / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounters({
        competitions: Math.min(100, Math.floor(increment.competitions * currentStep)),
        participants: Math.min(10000, Math.floor(increment.participants * currentStep)),
        prizes: Math.min(500000, Math.floor(increment.prizes * currentStep)),
        success: Math.min(95, Math.floor(increment.success * currentStep))
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible]);

  const stats = [
    { 
      value: counters.competitions, 
      suffix: "+", 
      label: "Active Competitions", 
      icon: Trophy, 
      color: "purple", 
      gradient: "from-purple-600 to-purple-400" 
    },
    { 
      value: counters.participants, 
      suffix: "+", 
      label: "Global Participants", 
      icon: Users, 
      color: "blue", 
      gradient: "from-blue-600 to-blue-400" 
    },
    { 
      value: `${counters.prizes.toLocaleString()}`, 
      suffix: "+", 
      label: "Total Prize Pool", 
      icon: Award, 
      color: "green", 
      gradient: "from-green-600 to-green-400" 
    },
    { 
      value: counters.success, 
      suffix: "%", 
      label: "Success Rate", 
      icon: TrendingUp, 
      color: "orange", 
      gradient: "from-orange-600 to-orange-400" 
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-transparent to-blue-100/50 dark:from-purple-950/10 dark:to-blue-950/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card/80 dark:bg-card/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-border/50 hover:border-border transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br ${stat.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}