'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="pt-20 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20"></div>
        
        {/* Animated background placeholders */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-muted/20 animate-pulse"
              style={{
                width: '300px',
                height: '300px',
                left: `${20 + i * 30}%`,
                top: `${10 + i * 25}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center space-y-6">
            {/* Badge skeleton */}
            <Skeleton className="h-8 w-48 mx-auto rounded-full" />
            
            {/* Title skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-16 xs:h-20 sm:h-24 md:h-32 lg:h-40 w-3/4 mx-auto rounded-lg" />
              <Skeleton className="h-16 xs:h-20 sm:h-24 md:h-32 lg:h-40 w-1/2 mx-auto rounded-lg" />
            </div>
            
            {/* Description skeleton */}
            <Skeleton className="h-6 w-full max-w-3xl mx-auto rounded-lg" />
            
            {/* CTA buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-14 w-40 rounded-lg" />
              <Skeleton className="h-14 w-40 rounded-lg" />
            </div>

            {/* Social proof skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-border/50">
                  <Skeleton className="h-8 w-8 mx-auto mb-3 rounded" />
                  <Skeleton className="h-10 w-20 mx-auto mb-2 rounded" />
                  <Skeleton className="h-4 w-16 mx-auto rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-8 w-48 mx-auto rounded-full" />
            <Skeleton className="h-12 w-96 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-full max-w-4xl mx-auto rounded-lg" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-lg">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2 rounded" />
                      <Skeleton className="h-4 w-24 rounded-full" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2 rounded" />
                  <Skeleton className="h-4 w-3/4 mb-4 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-8 w-48 mx-auto rounded-full" />
            <Skeleton className="h-12 w-80 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-full max-w-4xl mx-auto rounded-lg" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <Skeleton className="w-14 h-14 rounded-xl" />
                      <Skeleton className="w-6 h-6 rounded-full absolute -top-2 -right-2" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-8 w-12 mb-1 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-32 mb-2 rounded" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2 rounded" />
                  <Skeleton className="h-4 w-3/4 mb-4 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-8 w-48 mx-auto rounded-full" />
            <Skeleton className="h-12 w-72 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-full max-w-4xl mx-auto rounded-lg" />
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/20 dark:via-gray-900 dark:to-blue-950/20 border-0 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-6 mr-2 rounded" />
                  ))}
                </div>
                <Skeleton className="h-6 w-full mb-4 rounded" />
                <Skeleton className="h-6 w-4/5 mb-8 rounded" />
                <div className="flex items-center">
                  <Skeleton className="w-14 h-14 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial dots skeleton */}
            <div className="flex justify-center mt-8 space-x-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-2 w-2 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <Skeleton className="h-8 w-48 mx-auto rounded-full bg-white/20" />
            <Skeleton className="h-12 w-96 mx-auto rounded-lg bg-white/20" />
            <Skeleton className="h-6 w-full max-w-4xl mx-auto rounded-lg bg-white/20" />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-14 w-40 rounded-lg bg-white/20" />
              <Skeleton className="h-14 w-48 rounded-lg bg-white/20" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded bg-white/20" />
                  <Skeleton className="h-4 w-32 rounded bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card className="border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-lg">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Skeleton className="w-16 h-16 rounded-2xl animate-pulse" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2 rounded animate-pulse" />
            <Skeleton className="h-4 w-24 rounded-full animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2 rounded animate-pulse" />
        <Skeleton className="h-4 w-3/4 mb-4 rounded animate-pulse" />
        <Skeleton className="h-4 w-32 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border border-border">
          <Skeleton className="w-12 h-12 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48 rounded animate-pulse" />
            <Skeleton className="h-4 w-64 rounded animate-pulse" />
          </div>
          <Skeleton className="h-8 w-20 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-muted/50 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} className="h-4 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}