'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import { ChevronRight, Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowRight, Trophy, Calendar, Users, BookOpen, Star, Zap, Target, Award, TrendingUp, MessageSquare, Sparkles, Code, Palette, Cpu, Database, Globe, Smartphone, Rocket, Heart, Brain, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import Navbar from '@/components/Navbar';

const DotMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    dotColor: new THREE.Color('#FFFFFF'),
    bgColor: new THREE.Color('#121212'),
    mouseTrail: null,
    render: 0,
    rotation: 0,
    gridSize: 100,
    dotOpacity: 0.05
  },
  /* glsl */ `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform int render;
    uniform vec2 resolution;
    uniform vec3 dotColor;
    uniform vec3 bgColor;
    uniform sampler2D mouseTrail;
    uniform float rotation;
    uniform float gridSize;
    uniform float dotOpacity;

    vec2 rotate(vec2 uv, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        mat2 rotationMatrix = mat2(c, -s, s, c);
        return rotationMatrix * (uv - 0.5) + 0.5;
    }

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 rotatedUv = rotate(uv, rotation);

      vec2 gridUv = fract(rotatedUv * gridSize);
      vec2 gridUvCenterInScreenCoords = rotate((floor(rotatedUv * gridSize) + 0.5) / gridSize, -rotation);
      float baseDot = sdfCircle(gridUv, 0.25);

      float screenMask = smoothstep(0.0, 1.0, 1.0 - uv.y);
      vec2 centerDisplace = vec2(0.7, 1.1);
      float circleMaskCenter = length(uv - centerDisplace);
      float circleMaskFromCenter = smoothstep(0.5, 1.0, circleMaskCenter);
      float combinedMask = screenMask * circleMaskFromCenter;
      float circleAnimatedMask = sin(time * 2.0 + circleMaskCenter * 10.0);

      float mouseInfluence = texture2D(mouseTrail, gridUvCenterInScreenCoords).r;
      float scaleInfluence = max(mouseInfluence * 0.5, circleAnimatedMask * 0.3);
      float dotSize = min(pow(circleMaskCenter, 2.0) * 0.3, 0.3);
      float sdfDot = sdfCircle(gridUv, dotSize * (1.0 + scaleInfluence * 0.5));
      float smoothDot = smoothstep(0.05, 0.0, sdfDot);

      float opacityInfluence = max(mouseInfluence * 50.0, circleAnimatedMask * 0.5);
      vec3 composition = mix(bgColor, dotColor, smoothDot * combinedMask * dotOpacity * (1.0 + opacityInfluence));
      gl_FragColor = vec4(composition, 1.0);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

function DotScreenShader() {
  const { viewport } = useThree();
  const { theme } = useTheme();

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.1,
    maxAge: 400,
    interpolate: 1,
    ease: (x: number) =>
      x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
  });

  const dotMaterial = useMemo(() => {
    const material = new DotMaterial();
    material.uniforms.gridSize.value = 100;
    material.uniforms.rotation.value = 0;
    material.uniforms.render.value = 0;
    return material;
  }, []);

  useEffect(() => {
    dotMaterial.uniforms.mouseTrail.value = trail;
  }, [dotMaterial, trail]);

  useEffect(() => {
    const themeColors = theme === 'light'
      ? { dotColor: '#e1e1e1', bgColor: '#F4F5F5', dotOpacity: 0.15 }
      : { dotColor: '#FFFFFF', bgColor: '#121212', dotOpacity: 0.05 };

    dotMaterial.uniforms.dotColor.value.set(themeColors.dotColor);
    dotMaterial.uniforms.bgColor.value.set(themeColors.bgColor);
    dotMaterial.uniforms.dotOpacity.value = themeColors.dotOpacity;
  }, [theme, dotMaterial]);

  useFrame(({ clock, size: frameSize, gl: frameGl }) => {
    dotMaterial.uniforms.time.value = clock.elapsedTime;
    const dpr = frameGl.getPixelRatio();
    dotMaterial.uniforms.resolution.value.set(frameSize.width * dpr, frameSize.height * dpr);
  });

  useEffect(() => {
    return () => {
      dotMaterial.dispose();
    };
  }, [dotMaterial]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    onMove(e);
  };

  const scale = Math.max(viewport.width, viewport.height) / 2;

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={handlePointerMove}>
      <planeGeometry args={[2, 2]} />
      <primitive object={dotMaterial} />
    </mesh>
  );
}

function DotShaderBackground() {
  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping
      }}
      className="absolute inset-0"
    >
      <DotScreenShader />
    </Canvas>
  );
}

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counters, setCounters] = useState({
    competitions: 0,
    participants: 0,
    prizes: 0,
    success: 0
  });
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);

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

    const elements = [heroRef.current, statsRef.current, featuresRef.current];
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Testimonial auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animated counters
  useEffect(() => {
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
  }, []);

  const testimonials = [
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

  const competitionCategories = [
    {
      title: "Hackathons",
      description: "48-hour coding marathons where innovation meets execution",
      icon: Code,
      count: "25+",
      difficulty: "Intermediate",
      color: "purple",
      bgIcon: "💻",
      participants: "2.5k+"
    },
    {
      title: "AI Challenges",
      description: "Test your machine learning skills with real-world datasets",
      icon: Brain,
      count: "15+",
      difficulty: "Advanced",
      color: "blue",
      bgIcon: "🤖",
      participants: "1.8k+"
    },
    {
      title: "Web Development",
      description: "Build stunning websites and web applications",
      icon: Globe,
      count: "20+",
      difficulty: "Beginner",
      color: "green",
      bgIcon: "🌐",
      participants: "3.2k+"
    },
    {
      title: "Mobile Innovation",
      description: "Create innovative mobile apps for iOS and Android",
      icon: Smartphone,
      count: "18+",
      difficulty: "Intermediate",
      color: "orange",
      bgIcon: "📱",
      participants: "2.1k+"
    },
    {
      title: "Data Science",
      description: "Analyze complex datasets and derive meaningful insights",
      icon: Database,
      count: "12+",
      difficulty: "Advanced",
      color: "indigo",
      bgIcon: "📊",
      participants: "1.5k+"
    },
    {
      title: "UI/UX Design",
      description: "Design beautiful and intuitive user interfaces",
      icon: Palette,
      count: "10+",
      difficulty: "Beginner",
      color: "pink",
      bgIcon: "🎨",
      participants: "1.9k+"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Enhanced Hero Section with Advanced Animations */}
      <section
        ref={heroRef}
        id="hero"
        className="relative flex min-h-screen items-center overflow-hidden pt-20"
      >
        <div className="absolute inset-0">
          <DotShaderBackground />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-transparent to-blue-950/30 mix-blend-screen" />

        <div className="max-w-7xl relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Animated announcement badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-purple-200/50 hover:scale-105 transition-transform duration-300">
              <Sparkles className="animate-pulse" size={18} />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                🔥 New AI Challenges Now Live!
              </span>
              <ChevronRight className="animate-bounce" size={16} />
            </div>
            
            {/* Enhanced main heading with gradient and animation */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-6 leading-tight mix-blend-exclusion text-white">
              <span className="block mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Compete,
              </span>
              <span className="block mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Learn,
              </span>
              <span className="block bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                Innovate
              </span>
            </h1>
            
            {/* Enhanced description with better typography */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Join the ultimate tech competition platform. Test your skills, win amazing prizes, and accelerate your career with 
              <span className="font-semibold text-purple-600"> 10,000+ developers</span> worldwide.
            </p>
            
            {/* Enhanced CTA buttons with better hover effects */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Join Competitions
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                Explore Events
              </Button>
            </div>

            {/* Enhanced social proof with animations */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {[
                { icon: Star, text: "4.9/5 Rating", color: "text-yellow-500" },
                { icon: Users, text: "10,000+ Members", color: "text-purple-600" },
                { icon: Trophy, text: "100+ Competitions", color: "text-blue-600" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <item.icon className={`${item.color} fill-current`} size={16} />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="rotate-90 text-white/70" size={24} />
        </div>
      </section>

      {/* Enhanced Statistics Section with Glassmorphism */}
      <section 
        ref={statsRef}
        id="stats" 
        className="py-20 bg-muted/30 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-transparent to-blue-100/50 dark:from-purple-950/10 dark:to-blue-950/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-1000 ${isVisible['stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { value: counters.competitions, suffix: "+", label: "Competitions", icon: Trophy, color: "purple" },
              { value: counters.participants, suffix: "+", label: "Participants", icon: Users, color: "blue" },
              { value: `$${counters.prizes.toLocaleString()}`, suffix: "+", label: "Prize Pool", icon: Award, color: "green" },
              { value: counters.success, suffix: "%", label: "Success Rate", icon: TrendingUp, color: "orange" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-border/50 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90 dark:hover:bg-gray-900/90">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`} />
                  <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-400 bg-clip-text text-transparent mb-2`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with Modern Cards */}
      <section 
        ref={featuresRef}
        id="features" 
        className="py-20 bg-background relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-purple-200/50">
              <Target size={18} />
              <span className="font-semibold">Why Choose NeoFest</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We provide the perfect platform to showcase your skills, learn from experts, and connect with opportunities that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-lg hover:scale-105 hover:bg-gradient-to-br hover:from-white hover:to-gray-50 dark:hover:from-gray-900 dark:hover:to-gray-800 overflow-hidden relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                     style={{ backgroundImage: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})` }}>
                </div>
                
                <CardHeader className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Competition Categories with Interactive Cards */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-purple-200/50">
              <Trophy size={18} />
              <span className="font-semibold">Competition Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Find Your Perfect 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Challenge</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Explore various competition formats and find the perfect challenge for your skills and interests.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {competitionCategories.map((category, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg hover:scale-105 overflow-hidden relative border-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${category.color}-50/50 to-transparent dark:from-${category.color}-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className={`w-14 h-14 bg-gradient-to-r from-${category.color}-600 to-${category.color}-400 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                        <category.icon className="text-white" size={28} />
                      </div>
                      <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                        {category.bgIcon}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {category.count}
                      </div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors duration-300">
                    {category.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`inline-flex items-center px-3 py-1 bg-${category.color}-100 dark:bg-${category.color}-950/20 rounded-full text-xs font-medium`}>
                      <span className={`w-2 h-2 rounded-full mr-2 bg-${category.color}-500 animate-pulse`}></span>
                      {category.difficulty}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Users size={12} className="mr-1" />
                      {category.participants}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base mb-4 leading-relaxed">
                    {category.description}
                  </CardDescription>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-purple-600 hover:text-purple-700 group/link"
                  >
                    <span className="flex items-center">
                      Explore challenges 
                      <ChevronRight 
                        size={16} 
                        className="ml-1 group-hover/link:translate-x-1 transition-transform duration-300" 
                      />
                    </span>
                  </Button>
                </CardContent>
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-purple-200/50">
              <MessageSquare size={18} />
              <span className="font-semibold">Success Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              What Our 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Winners Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Join thousands of developers who have transformed their careers through NeoFest competitions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/20 dark:via-gray-900 dark:to-blue-950/20 border-0 shadow-2xl overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-950/10 dark:to-blue-950/10"></div>
              
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="text-yellow-500 fill-current animate-pulse" 
                      size={24} 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl text-muted-foreground mb-8 italic leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {testimonials[activeTestimonial].avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-lg">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[activeTestimonial].role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced testimonial dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activeTestimonial === index
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 w-12'
                      : 'bg-muted hover:bg-purple-300 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Advanced Effects */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
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
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/30">
            <Zap className="animate-pulse" size={18} />
            <span className="font-semibold">Join 10,000+ Developers</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Start Your 
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Journey?
            </span>
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
            Don't miss out on the opportunity to compete, learn, and grow. Join NeoFest today and take your tech career to the next level.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg group"
            >
              <span className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600 backdrop-blur-sm px-8 py-4 text-lg transition-all duration-300"
            >
              View Upcoming Events
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-white/80 text-sm">
            {[
              { icon: Trophy, text: "No credit card required" },
              { icon: Users, text: "Join in 2 minutes" },
              { icon: Award, text: "Start competing today" }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon size={16} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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