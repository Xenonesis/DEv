# Design System Reference

## Color System

### Primary Colors
```css
Purple: #9333EA (purple-600)
Blue: #3B82F6 (blue-600)
Gradient: from-purple-600 to-blue-600
```

### Semantic Colors
```css
Success: #22C55E (green-600)
Warning: #F59E0B (orange-600)
Error: #EF4444 (red-600)
Info: #3B82F6 (blue-600)
```

### Neutral Colors
```css
Background: hsl(var(--background))
Foreground: hsl(var(--foreground))
Muted: hsl(var(--muted))
Border: hsl(var(--border))
```

## Typography

### Font Sizes
```css
Hero: text-4xl sm:text-5xl md:text-6xl lg:text-7xl
Heading 1: text-3xl sm:text-4xl md:text-5xl
Heading 2: text-2xl sm:text-3xl md:text-4xl
Heading 3: text-xl sm:text-2xl
Body Large: text-lg sm:text-xl
Body: text-base
Small: text-sm
Extra Small: text-xs
```

### Font Weights
```css
Bold: font-bold (700)
Semibold: font-semibold (600)
Medium: font-medium (500)
Normal: font-normal (400)
```

## Spacing

### Common Spacing Values
```css
xs: 0.25rem (1)
sm: 0.5rem (2)
md: 1rem (4)
lg: 1.5rem (6)
xl: 2rem (8)
2xl: 3rem (12)
3xl: 4rem (16)
4xl: 5rem (20)
```

### Section Padding
```css
Hero: pt-20 pb-16
Section: py-12 or py-20
Card Padding: p-6 or p-8
```

## Components

### Button Variants

#### Primary Button
```tsx
<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
  Click Me
</Button>
```

#### Outline Button
```tsx
<Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300">
  Click Me
</Button>
```

#### Large Button
```tsx
<Button size="lg" className="h-11 px-8">
  Large Button
</Button>
```

### Card Variants

#### Standard Card
```tsx
<Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

#### Hover Card
```tsx
<Card className="group hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative">
  {/* Content */}
  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
</Card>
```

### Badge Variants

#### Category Badges
```tsx
<Badge className="bg-purple-500 text-white">Category</Badge>
<Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">Status</Badge>
```

### Input Variants

#### Standard Input
```tsx
<Input 
  placeholder="Enter text" 
  className="h-11 border-border/50 focus:border-purple-500 transition-colors"
/>
```

#### Textarea
```tsx
<Textarea 
  placeholder="Enter description" 
  className="min-h-[100px] resize-none"
/>
```

## Animations

### Floating Animation
```css
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

### Gradient Shift
```css
@keyframes gradient-shift {
  0%, 100% { 
    background-position: 0% 50%; 
  }
  50% { 
    background-position: 100% 50%; 
  }
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease-in-out infinite;
}
```

### Hover Transitions
```css
transition-all duration-300
hover:scale-105
hover:shadow-xl
```

## Layout Patterns

### Hero Section
```tsx
<section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/50 relative overflow-hidden">
  {/* Animated background */}
  <div className="absolute inset-0 overflow-hidden">
    {/* Floating particles */}
  </div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    {/* Content */}
  </div>
</section>
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

## Icons

### Icon Sizes
```tsx
Small: size={16} or w-4 h-4
Medium: size={20} or w-5 h-5
Large: size={24} or w-6 h-6
Extra Large: size={32} or w-8 h-8
Hero: size={40} or w-10 h-10
```

### Icon Colors
```tsx
Primary: text-purple-600
Success: text-green-600
Warning: text-yellow-600
Error: text-red-600
Muted: text-muted-foreground
```

## Responsive Breakpoints

```css
sm: 640px   /* Tablet */
md: 768px   /* Small Desktop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
2xl: 1536px /* Extra Large Desktop */
```

### Usage Examples
```tsx
{/* Mobile first approach */}
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive Text
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  Responsive Grid
</div>
```

## Glassmorphism Effect

```tsx
className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0"
```

## Gradient Backgrounds

### Hero Gradient
```tsx
className="bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/50"
```

### Button Gradient
```tsx
className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
```

### Text Gradient
```tsx
className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
```

## Loading States

### Spinner
```tsx
<div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
```

### Skeleton
```tsx
<div className="h-4 w-full bg-muted rounded animate-pulse"></div>
```

## Empty States

```tsx
<Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
  <CardContent className="py-20 text-center">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full mb-6">
      <Icon className="w-10 h-10 text-purple-600" />
    </div>
    <h3 className="text-2xl font-bold text-foreground mb-2">No Items Yet</h3>
    <p className="text-muted-foreground mb-6">Description text</p>
    <Button>Call to Action</Button>
  </CardContent>
</Card>
```

## Best Practices

### Do's ✅
- Use consistent spacing (multiples of 4)
- Apply hover states to interactive elements
- Use semantic HTML
- Implement proper loading states
- Add empty states for all lists
- Use gradient buttons for primary actions
- Apply backdrop blur for glassmorphism
- Use proper color contrast
- Implement responsive design
- Add smooth transitions

### Don'ts ❌
- Don't use random spacing values
- Don't forget hover states
- Don't use too many colors
- Don't ignore dark mode
- Don't skip loading states
- Don't use inline styles (use Tailwind)
- Don't forget accessibility
- Don't use heavy animations
- Don't ignore mobile users
- Don't mix design patterns

## Accessibility

### Color Contrast
- Ensure 4.5:1 ratio for normal text
- Ensure 3:1 ratio for large text
- Use proper focus indicators

### Keyboard Navigation
- All interactive elements should be keyboard accessible
- Proper tab order
- Visible focus states

### Screen Readers
- Use semantic HTML
- Add proper ARIA labels
- Include alt text for images

## Performance Tips

1. Use CSS transforms for animations (GPU accelerated)
2. Optimize images (use Next.js Image component)
3. Lazy load components when possible
4. Minimize re-renders with React.memo
5. Use proper loading states
6. Implement code splitting
7. Optimize bundle size

---

This design system ensures consistency across the entire application and makes it easy to maintain and extend the UI/UX.
