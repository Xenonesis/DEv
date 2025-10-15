'use client';

import { useState, useEffect, useRef } from 'react';
import { Trophy, Users, Target, Lightbulb, Award, Calendar, ChevronRight, Mail, Phone, MapPin, Sparkles, Rocket, Heart, Brain, Eye, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  const [counters, setCounters] = useState({
    participants: 0,
    competitions: 0,
    prizes: 0,
    success: 0
  });
  const [isVisible, setIsVisible] = useState({});
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);

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

    const elements = [missionRef.current, valuesRef.current, teamRef.current];
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = {
      participants: 10000 / steps,
      competitions: 100 / steps,
      prizes: 500000 / steps,
      success: 95 / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounters({
        participants: Math.min(10000, Math.floor(increment.participants * currentStep)),
        competitions: Math.min(100, Math.floor(increment.competitions * currentStep)),
        prizes: Math.min(500000, Math.floor(increment.prizes * currentStep)),
        success: Math.min(95, Math.floor(increment.success * currentStep))
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Pushing boundaries and encouraging creative solutions to real-world problems through cutting-edge challenges.",
      gradient: "from-purple-600 to-pink-600",
      bgPattern: "lightbulb"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive ecosystem where collaboration and knowledge sharing drive collective success.",
      gradient: "from-blue-600 to-cyan-600",
      bgPattern: "network"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Maintaining high standards in competition design, judging criteria, and participant experience.",
      gradient: "from-green-600 to-emerald-600",
      bgPattern: "target"
    },
    {
      icon: Award,
      title: "Growth",
      description: "Fostering continuous learning and skill development through hands-on experience and mentorship.",
      gradient: "from-orange-600 to-red-600",
      bgPattern: "growth"
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      description: "Former Google engineer with 10+ years in tech innovation and community building.",
      initials: "SC",
      color: "purple"
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Competitions",
      description: "Hackathon champion and competition designer with a passion for creative problem-solving.",
      initials: "MR",
      color: "blue"
    },
    {
      name: "Emily Watson",
      role: "Community Manager",
      description: "Dedicated to fostering inclusive and supportive tech communities worldwide.",
      initials: "EW",
      color: "green"
    },
    {
      name: "David Kim",
      role: "Technical Lead",
      description: "Full-stack developer ensuring seamless platform experiences for all participants.",
      initials: "DK",
      color: "orange"
    },
    {
      name: "Lisa Thompson",
      role: "Partnership Director",
      description: "Building strategic relationships with leading tech companies and educational institutions.",
      initials: "LT",
      color: "indigo"
    },
    {
      name: "Alex Johnson",
      role: "Content Creator",
      description: "Crafting engaging learning materials and competition challenges that inspire growth.",
      initials: "AJ",
      color: "pink"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-purple-400/10 to-blue-400/10 blur-sm"
              style={{
                width: Math.random() * 150 + 50 + 'px',
                height: Math.random() * 150 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Animated icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl mb-8 animate-scale-pulse shadow-2xl">
              <Trophy className="text-white" size={40} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                NeoFest
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Empowering the next generation of tech innovators through competitive learning, collaborative growth, and transformative experiences.
            </p>

            {/* Animated stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
              {[
                { icon: Users, text: "10K+ Community", color: "text-purple-600" },
                { icon: Trophy, text: "100+ Events", color: "text-blue-600" },
                { icon: Globe, text: "50+ Countries", color: "text-green-600" },
                { icon: Heart, text: "95% Satisfaction", color: "text-red-600" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <item.icon className={`${item.color} fill-current`} size={16} />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision Section */}
      <section 
        ref={missionRef}
        id="mission" 
        className="py-20 bg-background relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-1000 ${isVisible.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
                <Target size={18} />
                <span className="font-semibold">Our Mission</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Building the 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Future</span>
                <br />
                of Tech Competition
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  NeoFest is the premier platform for tech competitions, hackathons, and learning experiences. We bring together talented developers, designers, and innovators to compete, learn, and grow together.
                </p>
                <p>
                  Our mission is to foster innovation and skill development through exciting challenges and comprehensive learning programs, helping you advance your tech career while building meaningful connections.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <span className="flex items-center">
                    Join Our Community
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                >
                  View Competitions
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl">
                    <CardHeader className="text-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Users className="text-white" size={28} />
                      </div>
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {counters.participants.toLocaleString()}+
                      </CardTitle>
                      <CardDescription className="text-base font-medium">Active Participants</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl">
                    <CardHeader className="text-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Trophy className="text-white" size={28} />
                      </div>
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {counters.competitions}+
                      </CardTitle>
                      <CardDescription className="text-base font-medium">Competitions Hosted</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                
                <div className="space-y-6 mt-8">
                  <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl">
                    <CardHeader className="text-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Award className="text-white" size={28} />
                      </div>
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ${counters.prizes.toLocaleString()}+
                      </CardTitle>
                      <CardDescription className="text-base font-medium">Prize Pool Distributed</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl">
                    <CardHeader className="text-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Target className="text-white" size={28} />
                      </div>
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {counters.success}%
                      </CardTitle>
                      <CardDescription className="text-base font-medium">Success Rate</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Values Section */}
      <section 
        ref={valuesRef}
        id="values" 
        className="py-20 bg-muted/30 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-purple-200/50">
              <Lightbulb size={18} />
              <span className="font-semibold">Our Values</span>
            </div>
            <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold text-foreground mb-6">
              What Drives Us 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Forward</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Our core values shape everything we do, from the competitions we host to the community we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl overflow-hidden relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                     style={{ backgroundImage: `linear-gradient(135deg, ${value.gradient.split(' ')[1]}, ${value.gradient.split(' ')[3]})` }}>
                </div>
                
                <CardHeader className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <value.icon className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors duration-300">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {value.description}
                  </CardDescription>
                </CardContent>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section 
        ref={teamRef}
        id="team" 
        className="py-20 bg-background relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.team ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-purple-200/50">
              <Users size={18} />
              <span className="font-semibold">Our Team</span>
            </div>
            <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet the People Behind 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> NeoFest</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              A passionate team of tech enthusiasts, educators, and innovators dedicated to creating exceptional competition experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer transform hover:scale-105 transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl overflow-hidden relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center relative z-10">
                  <div className="relative inline-block">
                    <div className={`w-24 h-24 bg-gradient-to-r from-${member.color}-400 to-${member.color}-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <span className="text-3xl font-bold text-white">
                        {member.initials}
                      </span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                      {index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors duration-300">
                    {member.name}
                  </CardTitle>
                  <CardDescription className={`text-${member.color}-600 font-medium text-base`}>
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-white/10 blur-sm"
              style={{
                width: Math.random() * 100 + 50 + 'px',
                height: Math.random() * 100 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 15 + 's'
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium border border-white/30">
              <Rocket className="animate-pulse" size={18} />
              <span className="font-semibold">Join the Revolution</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Ready to Join Our 
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Community?
              </span>
            </h2>
            
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Whether you're a participant, organizer, or partner, we'd love to hear from you and explore how we can work together to create amazing experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <span className="flex items-center">
                  Get Started Today
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-600 backdrop-blur-sm transition-all duration-300"
              >
                Contact Us
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-white/80 text-sm">
              {[
                { icon: Mail, text: "hello@neofest.com" },
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: MapPin, text: "San Francisco, CA" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300"
                >
                  <item.icon size={16} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-20px) rotate(120deg); 
          }
          66% { 
            transform: translateY(10px) rotate(240deg); 
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
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