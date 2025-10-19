'use client';

import { Trophy, Users, Target, Award, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeaturesSectionProps {
  isVisible: boolean;
}

export default function FeaturesSection({ isVisible }: FeaturesSectionProps) {
  const features = [
    {
      icon: Trophy,
      title: "Win Amazing Prizes",
      description: "Compete for cash prizes, tech gadgets, and career opportunities worth over $500K.",
      gradient: "from-purple-600 to-pink-600",
      bgPattern: "trophy"
    },
    {
      icon: Users,
      title: "Build Your Network",
      description: "Connect with 10,000+ developers, designers, and tech enthusiasts worldwide.",
      gradient: "from-blue-600 to-cyan-600",
      bgPattern: "network"
    },
    {
      icon: Target,
      title: "Real-World Challenges",
      description: "Solve actual industry problems and build projects that impress recruiters.",
      gradient: "from-green-600 to-emerald-600",
      bgPattern: "target"
    },
    {
      icon: Award,
      title: "Get Recognized",
      description: "Earn certificates, badges, and recognition that boost your professional profile.",
      gradient: "from-orange-600 to-red-600",
      bgPattern: "award"
    },
    {
      icon: Zap,
      title: "Learn Fast",
      description: "Accelerate your learning with hands-on experience and expert mentorship.",
      gradient: "from-yellow-600 to-orange-600",
      bgPattern: "lightning"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "85% of our participants report career advancement within 6 months.",
      gradient: "from-indigo-600 to-purple-600",
      bgPattern: "growth"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 text-purple-600 dark:text-purple-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-md border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
            <Target size={18} />
            <span className="font-semibold">Why Choose NeoFest</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4">
            Everything You Need to 
            <span className="block sm:inline bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            We provide the perfect platform to showcase your skills, learn from experts, and connect with opportunities that matter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-500 border bg-card/50 dark:bg-card/30 backdrop-blur-xl hover:scale-[1.02] overflow-hidden relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500" 
                   style={{ backgroundImage: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})` }}>
              </div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <feature.icon className="text-white w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <CardTitle className="text-lg sm:text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}