'use client';

import { Users, MessageSquare, Trophy, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const communityFeatures = [
  {
    title: 'Forums',
    description: 'Join discussions',
    icon: MessageSquare,
    href: '/community/forums',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Teams',
    description: 'Form teams',
    icon: Users,
    href: '/community/teams',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Leaderboard',
    description: 'Top performers',
    icon: Trophy,
    href: '/community/leaderboard',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'Success Stories',
    description: 'Get inspired',
    icon: BookOpen,
    href: '/community/success-stories',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">Community</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Connect, collaborate, and grow with fellow developers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {communityFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3">
            <p>• Be respectful and inclusive to all community members</p>
            <p>• Share knowledge and help others grow</p>
            <p>• Collaborate and build amazing projects together</p>
            <p>• Celebrate successes and learn from failures</p>
            <p>• Follow our code of conduct and community standards</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
