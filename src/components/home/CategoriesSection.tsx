'use client';

import { Code, Brain, Globe, Smartphone, Database, Palette, Trophy, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CategoriesSectionProps {
  isVisible: boolean;
}

export default function CategoriesSection({ isVisible }: CategoriesSectionProps) {
  const competitionCategories = [
    {
      title: "Hackathons",
      description: "48-hour coding marathons where innovation meets execution",
      icon: Code,
      count: "25+",
      difficulty: "Intermediate",
      color: "purple",
      bgIcon: "💻",
      participants: "2.5k+",
      link: "/hackathons"
    },
    {
      title: "AI Challenges",
      description: "Test your machine learning skills with real-world datasets",
      icon: Brain,
      count: "15+",
      difficulty: "Advanced",
      color: "blue",
      bgIcon: "🤖",
      participants: "1.8k+",
      link: "/ai-challenges"
    },
    {
      title: "Web Development",
      description: "Build stunning websites and web applications",
      icon: Globe,
      count: "20+",
      difficulty: "Beginner",
      color: "green",
      bgIcon: "🌐",
      participants: "3.2k+",
      link: "/web-contests"
    },
    {
      title: "Mobile Innovation",
      description: "Create innovative mobile apps for iOS and Android",
      icon: Smartphone,
      count: "18+",
      difficulty: "Intermediate",
      color: "orange",
      bgIcon: "📱",
      participants: "2.1k+",
      link: "/mobile-innovation"
    },
    {
      title: "Data Science",
      description: "Analyze complex datasets and derive meaningful insights",
      icon: Database,
      count: "12+",
      difficulty: "Advanced",
      color: "indigo",
      bgIcon: "📊",
      participants: "1.5k+",
      link: "/ai-challenges"
    },
    {
      title: "UI/UX Design",
      description: "Design beautiful and intuitive user interfaces",
      icon: Palette,
      count: "10+",
      difficulty: "Beginner",
      color: "pink",
      bgIcon: "🎨",
      participants: "1.9k+",
      link: "/web-contests"
    }
  ];

  const colorMap: Record<string, string> = {
    purple: 'from-purple-600 to-purple-400',
    blue: 'from-blue-600 to-blue-400',
    green: 'from-green-600 to-green-400',
    orange: 'from-orange-600 to-orange-400',
    indigo: 'from-indigo-600 to-indigo-400',
    pink: 'from-pink-600 to-pink-400',
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 text-purple-600 dark:text-purple-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-md border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
            <Trophy size={18} />
            <span className="font-semibold">Competition Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4">
            Find Your Perfect 
            <span className="block sm:inline bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Challenge</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Explore various competition formats and find the perfect challenge for your skills and interests.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {competitionCategories.map((category, index) => {
            const gradient = colorMap[category.color] || 'from-purple-600 to-purple-400';
            
            return (
              <Link key={index} href={category.link}>
                <Card 
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-500 bg-card/50 dark:bg-card/30 backdrop-blur-xl hover:scale-[1.02] overflow-hidden relative border h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace('to-', 'to-transparent dark:from-')}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                          <category.icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {category.count}
                        </div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mb-3">
                      {category.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs font-medium">
                        <span className={`w-2 h-2 rounded-full mr-1.5 bg-gradient-to-r ${gradient} animate-pulse`}></span>
                        {category.difficulty}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Users size={12} className="mr-1" />
                        <span>{category.participants}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 pt-0">
                    <CardDescription className="text-sm sm:text-base mb-4 leading-relaxed">
                      {category.description}
                    </CardDescription>
                    <div className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium group/link">
                      <span className="flex items-center">
                        Explore challenges 
                        <ChevronRight 
                          size={16} 
                          className="ml-1 group-hover:translate-x-1 transition-transform duration-300" 
                        />
                      </span>
                    </div>
                  </CardContent>
                  
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}