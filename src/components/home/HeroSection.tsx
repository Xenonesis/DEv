'use client';

import { useState, useEffect, Suspense } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import { ChevronRight, ArrowRight, Play, Star, Users, Trophy, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useMemo } from 'react';

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
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <DotScreenShader />
      </Suspense>
    </Canvas>
  );
}

interface HeroSectionProps {
  isVisible: boolean;
}

export default function HeroSection({ isVisible }: HeroSectionProps) {
  const scrollToStats = () => {
    document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <DotShaderBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-transparent to-blue-100/40 dark:from-purple-950/30 dark:via-transparent dark:to-blue-950/30" />

      {/* Content */}
      <div className="w-full max-w-7xl relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-0">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Announcement Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 text-purple-700 dark:text-purple-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-md border border-purple-200/50 dark:border-purple-800/50 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
            <Sparkles className="animate-pulse w-4 h-4 sm:w-5 sm:h-5" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
              🔥 New AI Challenges Now Live!
            </span>
            <ChevronRight className="animate-bounce w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4 sm:mb-6 leading-tight">
            <span className="block mb-2 animate-fade-in-up text-gray-900 dark:text-white" style={{ animationDelay: '0.1s' }}>
              Compete,
            </span>
            <span className="block mb-2 animate-fade-in-up text-gray-900 dark:text-white" style={{ animationDelay: '0.2s' }}>
              Learn,
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift drop-shadow-lg">
              Innovate
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.3s' }}>
            Join the ultimate tech competition platform. Test your skills, win amazing prizes, and accelerate your career with 
            <span className="font-bold text-purple-600 dark:text-purple-400"> 10,000+ developers</span> worldwide.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
            <Button 
              asChild
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden rounded-xl font-semibold text-white"
            >
              <Link href="/hackathons" className="w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center">
                  Join Competitions
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 border-purple-600/50 dark:border-purple-400/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-600 dark:hover:border-purple-400/50 hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-md group rounded-xl font-semibold"
            >
              <Link href="/events" className="flex items-center justify-center w-full sm:w-auto">
                Explore Events
                <Play className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700 dark:text-gray-300 animate-fade-in-up px-4" style={{ animationDelay: '0.5s' }}>
            {[
              { icon: Star, text: "4.9/5 Rating", color: "text-yellow-500" },
              { icon: Users, text: "10,000+ Members", color: "text-purple-600 dark:text-purple-400" },
              { icon: Trophy, text: "100+ Competitions", color: "text-blue-600 dark:text-blue-400" }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:scale-105 transition-transform duration-300 shadow-lg"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <item.icon className={`${item.color} fill-current`} size={16} />
                <span className="font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToStats}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer bg-white/80 dark:bg-white/5 backdrop-blur-md p-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors duration-300 shadow-lg"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="text-gray-600 dark:text-white/70" size={24} />
      </button>
    </section>
  );
}