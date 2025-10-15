'use client';

import { useState } from 'react';
import { 
  Code, 
  Smartphone, 
  Cloud, 
  Brain, 
  Palette, 
  Settings, 
  Database, 
  Shield, 
  Zap, 
  Globe, 
  BarChart, 
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';

const functionalities = [
  {
    id: 'web-development',
    title: 'Web Development',
    icon: Code,
    description: 'Custom web applications built with cutting-edge technologies',
    features: [
      'React, Next.js, Vue.js development',
      'Progressive Web Apps (PWA)',
      'E-commerce solutions',
      'Content Management Systems',
      'API development and integration',
      'Real-time applications'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Applications',
    icon: Smartphone,
    description: 'Native and cross-platform mobile app development',
    features: [
      'iOS (Swift/Objective-C) development',
      'Android (Kotlin/Java) development',
      'React Native cross-platform',
      'Flutter applications',
      'App store optimization',
      'Push notifications'
    ],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'AWS'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    icon: Cloud,
    description: 'Scalable cloud infrastructure and migration services',
    features: [
      'Cloud architecture design',
      'AWS, Azure, GCP deployment',
      'Serverless applications',
      'Container orchestration',
      'Cloud migration',
      'DevOps automation'
    ],
    technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    icon: Brain,
    description: 'Intelligent solutions powered by artificial intelligence',
    features: [
      'Natural Language Processing',
      'Computer vision applications',
      'Predictive analytics',
      'Chatbot development',
      'Recommendation engines',
      'Data science consulting'
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI', 'Hugging Face'],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: Palette,
    description: 'Beautiful, intuitive designs that delight users',
    features: [
      'User research and analysis',
      'Wireframing and prototyping',
      'Visual design systems',
      'Interaction design',
      'Usability testing',
      'Design systems creation'
    ],
    technologies: ['Figma', 'Sketch', 'Adobe XD', 'Framer', 'Principle', 'Zeplin'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'devops-automation',
    title: 'DevOps & Automation',
    icon: Settings,
    description: 'Streamline development with modern DevOps practices',
    features: [
      'CI/CD pipeline setup',
      'Infrastructure as Code',
      'Monitoring and logging',
      'Security automation',
      'Performance optimization',
      'Microservices architecture'
    ],
    technologies: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Ansible', 'Prometheus', 'Grafana'],
    color: 'from-indigo-500 to-blue-500'
  }
];

const processSteps = [
  {
    step: 1,
    title: 'Discovery & Planning',
    description: 'We start by understanding your business goals, target audience, and technical requirements.',
    icon: Users
  },
  {
    step: 2,
    title: 'Design & Prototyping',
    description: 'Our design team creates wireframes and prototypes to visualize the solution.',
    icon: Palette
  },
  {
    step: 3,
    title: 'Development',
    description: 'Agile development process with regular sprints and client feedback.',
    icon: Code
  },
  {
    step: 4,
    title: 'Testing & QA',
    description: 'Comprehensive testing to ensure quality, security, and performance.',
    icon: Shield
  },
  {
    step: 5,
    title: 'Deployment',
    description: 'Smooth deployment to production with minimal downtime.',
    icon: Cloud
  },
  {
    step: 6,
    title: 'Support & Maintenance',
    description: 'Ongoing support and maintenance to keep your solution running smoothly.',
    icon: Settings
  }
];

export default function FunctionalitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NeoFest
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-purple-600 transition-colors">Home</a>
              <a href="/functionalities" className="text-purple-600 font-medium">Functionalities</a>
              <a href="/ideas" className="text-foreground hover:text-purple-600 transition-colors">Ideas</a>
              <a href="/#about" className="text-foreground hover:text-purple-600 transition-colors">About</a>
              <a href="/#contact" className="text-foreground hover:text-purple-600 transition-colors">Contact</a>
              <ThemeToggle />
              <Button>Get Started</Button>
            </div>

            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              Our Capabilities
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Comprehensive
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Technical Solutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From concept to deployment, we offer end-to-end technology solutions that drive business growth and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Functionalities Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {functionalities.map((func) => (
                  <Card key={func.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${func.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <func.icon className="text-white" size={32} />
                      </div>
                      <CardTitle className="text-xl">{func.title}</CardTitle>
                      <CardDescription className="text-base">
                        {func.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Key Features:</h4>
                          <ul className="space-y-2">
                            {func.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {func.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="development" className="mt-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {functionalities.filter(f => ['web-development', 'mobile-apps'].includes(f.id)).map((func) => (
                  <Card key={func.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${func.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <func.icon className="text-white" size={32} />
                      </div>
                      <CardTitle className="text-xl">{func.title}</CardTitle>
                      <CardDescription className="text-base">
                        {func.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Key Features:</h4>
                          <ul className="space-y-2">
                            {func.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {func.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="design" className="mt-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {functionalities.filter(f => f.id === 'ui-ux-design').map((func) => (
                  <Card key={func.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${func.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <func.icon className="text-white" size={32} />
                      </div>
                      <CardTitle className="text-xl">{func.title}</CardTitle>
                      <CardDescription className="text-base">
                        {func.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Key Features:</h4>
                          <ul className="space-y-2">
                            {func.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {func.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="infrastructure" className="mt-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {functionalities.filter(f => ['cloud-solutions', 'ai-machine-learning', 'devops-automation'].includes(f.id)).map((func) => (
                  <Card key={func.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${func.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <func.icon className="text-white" size={32} />
                      </div>
                      <CardTitle className="text-xl">{func.title}</CardTitle>
                      <CardDescription className="text-base">
                        {func.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Key Features:</h4>
                          <ul className="space-y-2">
                            {func.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {func.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Development Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We follow a proven methodology to ensure successful project delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <Card key={step.step} className="text-center border-0 shadow-md">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="text-white" size={24} />
                  </div>
                  <div className="text-sm font-semibold text-purple-600 mb-2">
                    Step {step.step}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Let's discuss how our technical solutions can help you achieve your business goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg">
              Start Your Project
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-purple-600">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}