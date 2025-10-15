'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Tablet, Smartphone, Tv } from 'lucide-react';

export function ResponsiveTest() {
  const [activeBreakpoint, setActiveBreakpoint] = useState('');

  const breakpoints = [
    { name: 'Mobile', min: '320px', max: '474px', icon: Smartphone, color: 'text-red-600' },
    { name: 'Small Mobile', min: '475px', max: '639px', icon: Smartphone, color: 'text-orange-600' },
    { name: 'Tablet', min: '640px', max: '1023px', icon: Tablet, color: 'text-yellow-600' },
    { name: 'Desktop', min: '1024px', max: '1279px', icon: Monitor, color: 'text-green-600' },
    { name: 'Large Desktop', min: '1280px', max: '1535px', icon: Monitor, color: 'text-blue-600' },
    { name: '2XL Desktop', min: '1536px', max: '1599px', icon: Monitor, color: 'text-indigo-600' },
    { name: '3XL Desktop', min: '1600px', max: '1919px', icon: Tv, color: 'text-purple-600' },
    { name: '4K/Ultra-wide', min: '1920px', max: '∞', icon: Tv, color: 'text-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Responsive Design Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {breakpoints.map((bp) => (
                <div
                  key={bp.name}
                  className="p-4 border rounded-lg text-center hover:shadow-lg transition-shadow"
                >
                  <bp.icon className={`w-8 h-8 mx-auto mb-2 ${bp.color}`} />
                  <h3 className="font-semibold">{bp.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {bp.min} - {bp.max}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Responsive Text Examples</h3>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                  This text scales from extra small to extra large screens
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  This text starts small and goes to 2xl on large screens
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                  This text starts at base and goes to 3xl on extra large screens
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                  This text starts large and goes to 4xl on ultra-wide screens
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                  This text starts at xl and goes to 5xl on 4K screens
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  This text starts at 2xl and goes to 6xl on ultra-wide screens
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  This text starts at 3xl and goes to 7xl on 4K screens
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Responsive Grid Examples</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg text-center">
                    <span className="font-semibold">Item {i + 1} - 1 column</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg text-center">
                    <span className="font-semibold">Item {i + 1} - 1-2 columns</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg text-center">
                    <span className="font-semibold">Item {i + 1} - 1-2-3 columns</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg text-center">
                    <span className="font-semibold">Item {i + 1} - 1-2-3-4 columns</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2">Current Viewport Size</h3>
              <p className="text-lg">
                Resize your browser window to see the responsive design in action!
              </p>
              <p className="text-sm mt-2 opacity-80">
                The layout automatically adjusts to provide the best experience on any device.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}