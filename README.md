# 🎉 NeoFest - Tech Competitions & Innovation Platform

<div align="center">

![NeoFest Logo](logo.png)

**🚀 The Premier Platform for Tech Competitions, Hackathons, and Learning**

[![Version](https://img.shields.io/badge/Version-0.20-4F46E5?style=for-the-badge&logo=semver&logoColor=white)](https://github.com/neofest/neofest)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-4-purple?style=for-the-badge&logo=auth0)](https://next-auth.js.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/neofest/neofest?style=for-the-badge&logo=github)](https://github.com/neofest/neofest)
[![Issues](https://img.shields.io/github/issues/neofest/neofest?style=for-the-badge&logo=github)](https://github.com/neofest/neofest/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

*Join the future of competitive programming and tech innovation* ✨

[🎯 Live Demo](#) • [📖 Documentation](#documentation) • [🚀 Get Started](#quick-start) • [🤝 Contributing](#contributing) • [📱 Mobile App](#mobile-app) • [🔧 API](#api-documentation)

</div>

---

## 🌟 What is NeoFest?

NeoFest is a **cutting-edge platform** that brings together developers, designers, and innovators from around the world to compete, learn, and grow together. Whether you're a beginner looking to learn new skills or an expert ready to tackle challenging problems, NeoFest has something for everyone.

### ✨ Key Features

<table>
<tr>
<td width="33%" align="center">

### 🏆 **Competitions**
**Hackathons & Challenges**
- AI Innovation Challenges
- Web Development Contests  
- Mobile App Marathons
- Real-time Leaderboards
- Prize Pools & Recognition

</td>
<td width="33%" align="center">

### 📚 **Learning**
**Sessions & Workshops**
- Interactive Tutorials
- Expert-led Workshops
- Skill Progress Tracking
- Certification Programs
- Community Learning

</td>
<td width="33%" align="center">

### 🌐 **Community**
**Networking & Events**
- Tech Conferences
- Meetups & Networking
- Team Formation
- Idea Sharing Platform
- Achievement System

</td>
</tr>
</table>

---

## 🎯 Live Platform Features

### 🔐 **Complete Authentication System**
- **Sign Up/Sign In**: Secure user registration and login
- **Protected Routes**: Dashboard and profile protection
- **Session Management**: Persistent login sessions
- **Profile Management**: User account customization

### 🏆 **Competition Management** 
- **Real Hackathons**: Browse and join live competitions
- **Team Formation**: Find teammates and collaborate
- **Project Submission**: Submit and showcase your work
- **Voting System**: Community-driven project evaluation

### 📊 **Learning Platform**
- **Interactive Sessions**: Video tutorials and workshops
- **Progress Tracking**: Monitor your learning journey
- **Skill Assessment**: Test and improve your abilities
- **Certification**: Earn certificates for completed courses

### 💡 **Innovation Hub**
- **Idea Sharing**: Submit and discuss innovative concepts
- **Community Voting**: Crowdsourced idea evaluation
- **Collaboration**: Connect with like-minded innovators
- **Implementation Tracking**: From idea to reality

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

```bash
# 📥 Clone the repository
git clone https://github.com/your-username/neofest.git
cd neofest

# 📦 Install dependencies
npm install

# 🗄️ Set up the database
npm run db:push

# 🌱 Seed the database with sample data
npm run db:seed

# 🚀 Start the development server
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000)** to see NeoFest in action!

### 🔑 Demo Credentials
- **Email**: `demo@neofest.com` (or any email)
- **Password**: `demo123` (or any password)

---

## 🛠️ Technology Stack

<div align="center">

### 🎯 **Core Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **⚡ Next.js** | 15.3.5 | React framework with App Router |
| **📘 TypeScript** | 5.x | Type-safe development |
| **🎨 Tailwind CSS** | 4.x | Utility-first styling |
| **🗄️ Prisma** | 6.11.1 | Database ORM and management |
| **🔐 NextAuth.js** | 4.24.11 | Authentication and sessions |

### 🧩 **UI & Components**

| Component | Purpose |
|-----------|---------|
| **🧩 shadcn/ui** | Beautiful, accessible UI components |
| **🎯 Lucide React** | Consistent icon library |
| **🌈 Framer Motion** | Smooth animations and transitions |
| **📊 Recharts** | Data visualization and charts |
| **🖱️ DND Kit** | Drag and drop functionality |

### 🔧 **Development Tools**

| Tool | Purpose |
|------|---------|
| **🔄 TanStack Query** | Data fetching and caching |
| **🎣 React Hook Form** | Form management |
| **✅ Zod** | Schema validation |
| **🌙 Next Themes** | Dark/light mode support |

</div>

---

## 📂 Project Structure

```
neofest/
├── 🎨 src/
│   ├── 📱 app/                    # Next.js App Router
│   │   ├── 🔐 auth/              # Authentication pages
│   │   │   ├── signin/           # Sign in page
│   │   │   └── signup/           # Sign up page
│   │   ├── 🏆 hackathons/        # Competition pages
│   │   ├── 📅 events/            # Event management
│   │   ├── 📚 sessions/          # Learning platform
│   │   ├── 💡 ideas/             # Innovation hub
│   │   ├── 📊 dashboard/         # User dashboard
│   │   └── 🔗 api/               # API routes
│   ├── 🧩 components/            # Reusable components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── Navbar.tsx            # Navigation component
│   │   └── providers/            # Context providers
│   ├── 🪝 hooks/                 # Custom React hooks
│   ├── 📚 lib/                   # Utility functions
│   │   ├── db.ts                 # Database connection
│   │   ├── db-utils.ts           # Database utilities
│   │   └── utils.ts              # Helper functions
│   └── 🎭 types/                 # TypeScript definitions
├── 🗄️ prisma/                    # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data seeder
├── 🎨 public/                    # Static assets
└── 📋 Configuration files
```

---

## 🎨 UI Components & Features

### 🧩 **Available Components**

<details>
<summary><strong>📋 Form Components</strong></summary>

- **Input Fields**: Text, email, password, number inputs
- **Selects**: Dropdown menus with search functionality  
- **Checkboxes**: Single and group selections
- **Radio Groups**: Exclusive option selection
- **Switches**: Toggle controls
- **Textareas**: Multi-line text input
- **Date Pickers**: Calendar selection
- **File Uploads**: Drag-and-drop file handling

</details>

<details>
<summary><strong>📊 Data Display</strong></summary>

- **Tables**: Sortable, filterable data tables
- **Charts**: Line, bar, pie, and area charts
- **Cards**: Content containers with headers
- **Badges**: Status and category indicators
- **Avatars**: User profile images
- **Progress Bars**: Loading and completion states
- **Statistics**: Metric displays with trends

</details>

<details>
<summary><strong>🎯 Navigation</strong></summary>

- **Dynamic Navbar**: Authentication-aware navigation
- **Breadcrumbs**: Page hierarchy navigation
- **Tabs**: Content organization
- **Pagination**: Data browsing controls
- **Sidebars**: Collapsible navigation panels
- **Dropdown Menus**: Contextual actions

</details>

<details>
<summary><strong>🎨 Interactive Elements</strong></summary>

- **Buttons**: Primary, secondary, outline styles
- **Modals**: Dialog boxes and overlays
- **Tooltips**: Helpful information on hover
- **Accordions**: Collapsible content sections
- **Carousels**: Image and content sliders
- **Drag & Drop**: Sortable lists and file uploads

</details>

### 🌈 **Visual Features**

- **🎨 Gradient Backgrounds**: Beautiful color transitions
- **✨ Hover Effects**: Interactive element responses  
- **🌊 Smooth Animations**: Framer Motion integration
- **🌙 Dark Mode**: Automatic theme switching
- **📱 Responsive Design**: Mobile-first approach
- **🎯 Micro-interactions**: Delightful user feedback

---

## 🔐 Authentication & Security

### 🛡️ **Security Features**

- **🔒 JWT Sessions**: Secure token-based authentication
- **🛡️ CSRF Protection**: Built-in NextAuth.js security
- **🚫 Route Protection**: Middleware-based access control
- **✅ Input Validation**: Zod schema validation
- **🔐 Password Security**: Hashed password storage
- **🔄 Session Management**: Automatic token refresh

### 🎯 **Authentication Flow**

```mermaid
graph LR
A[🏠 Home Page] --> B[🔑 Sign In/Up]
B --> C[✅ Authentication]
C --> D[📊 Dashboard]
D --> E[🏆 Competitions]
D --> F[📚 Learning]
D --> G[💡 Ideas]
```

### 🔧 **Implementation Example**

```tsx
// 🔐 Protected component example
import { useSession } from 'next-auth/react'

function ProtectedComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <LoadingSpinner />
  if (!session) return <SignInPrompt />
  
  return <DashboardContent user={session.user} />
}
```

---

## 🗄️ Database Schema

### 📊 **Data Models**

<details>
<summary><strong>👤 User Management</strong></summary>

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  bio           String?
  skills        String?   // JSON array
  level         Int       @default(1)
  points        Int       @default(0)
  
  // Relations
  hackathons    HackathonParticipant[]
  events        EventParticipant[]
  ideas         Idea[]
  sessions      SessionParticipant[]
  achievements  UserAchievement[]
}
```

</details>

<details>
<summary><strong>🏆 Competition System</strong></summary>

```prisma
model Hackathon {
  id              String   @id @default(cuid())
  title           String
  description     String
  theme           String
  prize           String?
  maxParticipants Int?
  startDate       DateTime
  endDate         DateTime
  status          HackathonStatus @default(UPCOMING)
  difficulty      Difficulty @default(BEGINNER)
  
  // Relations
  participants    HackathonParticipant[]
  projects        Project[]
}
```

</details>

<details>
<summary><strong>📚 Learning Platform</strong></summary>

```prisma
model LearningSession {
  id          String   @id @default(cuid())
  title       String
  description String
  content     String
  type        SessionType
  difficulty  Difficulty @default(BEGINNER)
  duration    Int
  instructor  String
  videoUrl    String?
  
  // Relations
  participants SessionParticipant[]
}
```

</details>

### 🎯 **Database Features**

- **🔗 Relational Integrity**: Proper foreign key constraints
- **📊 Performance**: Optimized indexes on frequently queried fields
- **🔍 Full-text Search**: Efficient content searching
- **📈 Analytics**: Built-in counting and aggregation
- **🔄 Migrations**: Version-controlled schema changes

---

## 🎯 API Documentation

### 🔗 **Available Endpoints**

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/api/auth/[...nextauth]` | GET/POST | Authentication handling | ❌ |
| `/api/hackathons` | GET/POST | Competition management | ✅ |
| `/api/events` | GET/POST | Event operations | ✅ |
| `/api/sessions` | GET/POST | Learning content | ✅ |
| `/api/ideas` | GET/POST | Innovation platform | ✅ |
| `/api/health` | GET | System health check | ❌ |

### 📊 **API Response Format**

```json
{
  "success": true,
  "data": [...],
  "total": 25,
  "message": "Operation completed successfully"
}
```

### 🔧 **Usage Examples**

```javascript
// 🏆 Fetch hackathons with filters
const response = await fetch('/api/hackathons?difficulty=advanced&sort=prize')
const { data: hackathons } = await response.json()

// 💡 Create a new idea
const newIdea = await fetch('/api/ideas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'AI-Powered Learning Assistant',
    description: 'An intelligent tutoring system...',
    category: 'Education'
  })
})
```

---

## 🎨 Customization & Theming

### 🌈 **Theme Configuration**

```css
/* 🎨 Custom color palette */
:root {
  --purple-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --blue-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

### 🌙 **Dark Mode Support**

- **Automatic Detection**: System preference detection
- **Manual Toggle**: User-controlled theme switching
- **Persistent Choice**: Theme preference storage
- **Smooth Transitions**: No flash between themes

### 📱 **Responsive Breakpoints**

```css
/* 📱 Mobile-first responsive design */
sm: '640px'   /* Small devices */
md: '768px'   /* Medium devices */
lg: '1024px'  /* Large devices */
xl: '1280px'  /* Extra large devices */
2xl: '1536px' /* 2X large devices */
```

---

## 🚀 Deployment & Production

### 🌐 **Deployment Options**

<table>
<tr>
<td width="50%">

#### ⚡ **Vercel (Recommended)**
```bash
# 🚀 Deploy to Vercel
npm run build
vercel --prod
```

✅ **Zero-config deployment**  
✅ **Automatic HTTPS**  
✅ **Global CDN**  
✅ **Serverless functions**

</td>
<td width="50%">

#### 🐳 **Docker**
```bash
# 🐳 Build Docker image
docker build -t neofest .
docker run -p 3000:3000 neofest
```

✅ **Containerized deployment**  
✅ **Environment consistency**  
✅ **Scalable infrastructure**  
✅ **Platform independence**

</td>
</tr>
</table>

### 🔧 **Environment Variables**

```bash
# 🗄️ Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# 🔐 Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# 📧 Email Configuration (Optional)
EMAIL_SERVER="smtp://username:password@smtp.gmail.com:587"
EMAIL_FROM="noreply@neofest.com"

# 🌐 Social Authentication (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# 📊 Analytics (Optional)
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
POSTHOG_KEY="your-posthog-key"

# 💾 Storage (Optional)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# 🔔 Notifications (Optional)
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-cluster"

# 🤖 AI Integration (Optional)
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# 📈 Monitoring
SENTRY_DSN="your-sentry-dsn"
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

### 🔍 **Environment Setup Guide**

<details>
<summary><strong>🗄️ Database Setup</strong></summary>

#### PostgreSQL Setup
```bash
# Using Docker
docker run --name neofest-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=neofest \
  -p 5432:5432 \
  -d postgres:15

# Using local PostgreSQL
createdb neofest
psql neofest -c "CREATE USER neofest_user WITH PASSWORD 'yourpassword';"
psql neofest -c "GRANT ALL PRIVILEGES ON DATABASE neofest TO neofest_user;"
```

#### Prisma Accelerate Setup
1. Visit [Prisma Accelerate](https://console.prisma.io/)
2. Create a new project
3. Connect your database
4. Copy the connection string to `DATABASE_URL`

</details>

<details>
<summary><strong>🔐 Authentication Setup</strong></summary>

#### NextAuth Secret
```bash
# Generate a secure secret
openssl rand -base64 32
```

#### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth (Optional)
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

</details>

<details>
<summary><strong>📧 Email Configuration</strong></summary>

#### Gmail SMTP
```bash
EMAIL_SERVER="smtp://youremail@gmail.com:yourapppassword@smtp.gmail.com:587"
EMAIL_FROM="youremail@gmail.com"
```

#### SendGrid
```bash
EMAIL_SERVER="smtp://apikey:your-sendgrid-api-key@smtp.sendgrid.net:587"
EMAIL_FROM="noreply@yourdomain.com"
```

</details>

<details>
<summary><strong>☁️ Cloud Services Setup</strong></summary>

#### Cloudinary (Image Storage)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Configure upload presets for different image types

#### Pusher (Real-time Features)
1. Sign up at [Pusher](https://pusher.com/)
2. Create a new app
3. Get your app credentials

</details>

### 📊 **Performance Optimizations**

- **🖼️ Image Optimization**: Next.js automatic image optimization
- **📦 Bundle Splitting**: Automatic code splitting
- **🔄 Caching**: API response caching strategies
- **⚡ SSR/SSG**: Server-side rendering where appropriate
- **🗜️ Compression**: Gzip and Brotli compression

---

## 📱 Mobile App & PWA

### 📲 **Progressive Web App (PWA)**

NeoFest includes built-in PWA capabilities for a native-like mobile experience:

```json
// public/manifest.json
{
  "name": "NeoFest - Tech Competitions",
  "short_name": "NeoFest",
  "description": "Join tech competitions and hackathons",
  "theme_color": "#4F46E5",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 📱 **Mobile Features**

<table>
<tr>
<td width="50%">

#### ✨ **PWA Capabilities**
- **📱 Install to Home Screen**: Add to device home screen
- **🔄 Offline Support**: Basic offline functionality
- **🔔 Push Notifications**: Competition updates (coming soon)
- **📲 Native Feel**: App-like navigation and interactions
- **⚡ Fast Loading**: Optimized for mobile networks

</td>
<td width="50%">

#### 📱 **Mobile Optimizations**
- **👆 Touch-Friendly**: Large tap targets and gestures
- **📐 Responsive Design**: Adaptive layouts for all screen sizes
- **⚡ Performance**: Optimized for mobile devices
- **🔋 Battery Efficient**: Minimal background processing
- **📶 Network Aware**: Graceful handling of poor connectivity

</td>
</tr>
</table>

### 🚀 **Future Native Apps**

#### 📋 **Planned Mobile Features**
- [ ] **📱 React Native App**: Cross-platform mobile application
- [ ] **🔔 Push Notifications**: Real-time competition updates
- [ ] **📷 Camera Integration**: Photo submissions for projects
- [ ] **🗺️ Offline Maps**: Event location and venue information
- [ ] **👥 Social Features**: In-app messaging and team communication
- [ ] **🎮 Gamification**: Mobile-specific achievements and rewards

---

## 🤖 AI Integration & Features

### 🧠 **AI-Powered Features**

<table>
<tr>
<td width="50%">

#### 🎯 **Smart Matching**
- **👥 Team Formation**: AI-powered teammate recommendations
- **🏆 Competition Suggestions**: Personalized hackathon recommendations
- **📚 Learning Paths**: Custom skill development tracks
- **🎨 Project Ideas**: AI-generated innovation concepts

</td>
<td width="50%">

#### 📊 **Intelligent Analytics**
- **📈 Performance Insights**: AI-driven skill gap analysis
- **🎯 Goal Setting**: Smart objective recommendations
- **📋 Progress Tracking**: Intelligent milestone suggestions
- **🏅 Achievement Predictions**: Success probability calculations

</td>
</tr>
</table>

### 🔧 **AI Implementation**

```typescript
// AI Service Integration Example
import { OpenAI } from 'openai'
import { Anthropic } from '@anthropic-ai/sdk'

class AIService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  private anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  async generateProjectIdea(userSkills: string[], interests: string[]) {
    const prompt = `Generate an innovative project idea for a developer with skills: ${userSkills.join(', ')} and interests in: ${interests.join(', ')}`
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    })

    return response.choices[0].message.content
  }

  async recommendTeammates(userId: string, projectType: string) {
    // AI logic for teammate recommendations
    // Based on complementary skills, availability, and past performance
  }
}
```

### 🎨 **AI-Enhanced User Experience**

- **🔍 Smart Search**: Natural language query processing
- **💬 Chatbot Assistant**: 24/7 AI support for users
- **📝 Auto-Documentation**: AI-generated project documentation
- **🎯 Smart Notifications**: Contextual and personalized alerts
- **🏆 Competition Insights**: AI analysis of winning strategies

---

## 🔧 Advanced Configuration

### ⚙️ **Feature Flags**

```typescript
// lib/feature-flags.ts
export const FEATURE_FLAGS = {
  AI_RECOMMENDATIONS: process.env.NEXT_PUBLIC_ENABLE_AI === 'true',
  REAL_TIME_CHAT: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
  ADVANCED_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  TEAM_FORMATION: process.env.NEXT_PUBLIC_ENABLE_TEAMS === 'true',
  MOBILE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  BETA_FEATURES: process.env.NEXT_PUBLIC_BETA_FEATURES === 'true'
} as const

// Usage in components
import { FEATURE_FLAGS } from '@/lib/feature-flags'

function AIRecommendations() {
  if (!FEATURE_FLAGS.AI_RECOMMENDATIONS) return null
  
  return <AIRecommendationPanel />
}
```

### 🎨 **Theme Customization**

```css
/* Custom theme variables */
:root {
  /* Primary Colors */
  --primary-purple: #4F46E5;
  --primary-blue: #3B82F6;
  --primary-gradient: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-blue) 100%);
  
  /* Secondary Colors */
  --secondary-green: #10B981;
  --secondary-orange: #F59E0B;
  --secondary-red: #EF4444;
  
  /* Neutral Colors */
  --gray-50: #F9FAFB;
  --gray-900: #111827;
  
  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 3rem;
  
  /* Typography Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
}

/* Dark mode overrides */
[data-theme="dark"] {
  --background: var(--gray-900);
  --foreground: var(--gray-50);
}

/* Custom animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slideInUp 0.3s ease-out;
}
```

### 📊 **Analytics Configuration**

```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import posthog from 'posthog-js'

export function initializeAnalytics() {
  // PostHog initialization
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }
}

// Track custom events
export function trackEvent(eventName: string, properties?: any) {
  posthog.capture(eventName, properties)
}

// Track user actions
export function trackUserAction(action: string, data?: any) {
  trackEvent('user_action', { action, ...data })
}
```

---

## 🛠️ Development Tools & Workflow

### 🔧 **Development Scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "format": "prettier --write .",
    "prepare": "husky install",
    "analyze": "cross-env ANALYZE=true npm run build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### 🎯 **Git Hooks & Automation**

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

### 📦 **Docker Configuration**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/neofest
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=neofest
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 🚀 **CI/CD Pipeline**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: neofest_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Generate Prisma client
      run: npx prisma generate
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/neofest_test
    
    - name: Run database migrations
      run: npx prisma db push
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/neofest_test
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/neofest_test
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
    
    - name: Run E2E tests
      run: npm run e2e
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/neofest_test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 🚨 Troubleshooting & FAQ

### 🔧 **Common Issues & Solutions**

<details>
<summary><strong>❌ Database Connection Issues</strong></summary>

#### Problem: Can't connect to database
```bash
Error: P1001: Can't reach database server
```

#### Solutions:
1. **Check database URL format**:
   ```bash
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

2. **Verify database is running**:
   ```bash
   # For Docker
   docker ps | grep postgres
   
   # For local PostgreSQL
   pg_isready -h localhost -p 5432
   ```

3. **Test connection manually**:
   ```bash
   psql "postgresql://username:password@host:port/database"
   ```

4. **Check firewall and network settings**
5. **Ensure SSL mode is correctly configured**

</details>

<details>
<summary><strong>🔐 Authentication Issues</strong></summary>

#### Problem: NextAuth session not working
```bash
Error: [next-auth][error][SESSION_ERROR]
```

#### Solutions:
1. **Check NEXTAUTH_SECRET**:
   ```bash
   # Generate new secret
   openssl rand -base64 32
   ```

2. **Verify NEXTAUTH_URL**:
   ```bash
   NEXTAUTH_URL="http://localhost:3000"  # Development
   NEXTAUTH_URL="https://yourdomain.com"  # Production
   ```

3. **Clear browser cookies and localStorage**
4. **Check database schema for auth tables**
5. **Verify provider configurations**

</details>

<details>
<summary><strong>📦 Build & Deployment Issues</strong></summary>

#### Problem: Build failures
```bash
Error: Type error: Property 'xyz' does not exist
```

#### Solutions:
1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Update dependencies**:
   ```bash
   npm update
   npm audit fix
   ```

3. **Check TypeScript configuration**:
   ```bash
   npm run type-check
   ```

4. **Verify environment variables in production**
5. **Check for missing dependencies**

</details>

<details>
<summary><strong>🎨 Styling Issues</strong></summary>

#### Problem: Tailwind classes not working
```bash
Class 'custom-class' not found
```

#### Solutions:
1. **Rebuild Tailwind**:
   ```bash
   npm run dev  # Restart development server
   ```

2. **Check tailwind.config.ts**:
   ```typescript
   content: [
     './src/**/*.{js,ts,jsx,tsx,mdx}',
   ]
   ```

3. **Verify CSS imports**:
   ```css
   @import 'tailwindcss/base';
   @import 'tailwindcss/components';
   @import 'tailwindcss/utilities';
   ```

4. **Clear browser cache**
5. **Check for conflicting CSS**

</details>

### 📋 **Frequently Asked Questions**

<details>
<summary><strong>❓ General Questions</strong></summary>

#### Q: Is NeoFest free to use?
A: Yes! NeoFest is completely free and open-source. You can participate in competitions, join learning sessions, and use all features without any cost.

#### Q: Can I host my own competitions?
A: Absolutely! NeoFest allows users to create and host their own hackathons and competitions with full customization options.

#### Q: What programming languages are supported?
A: NeoFest supports all programming languages. Competitions can specify language requirements, but the platform itself is language-agnostic.

#### Q: Is there a mobile app?
A: Currently, NeoFest is a Progressive Web App (PWA) that works great on mobile devices. Native iOS and Android apps are planned for future releases.

</details>

<details>
<summary><strong>🏆 Competition Questions</strong></summary>

#### Q: How are competitions judged?
A: Competitions use various judging methods including peer voting, expert panels, and automated scoring based on specific criteria.

#### Q: Can I join multiple competitions?
A: Yes! You can participate in multiple competitions simultaneously, but make sure to manage your time effectively.

#### Q: What if I don't have a team?
A: NeoFest has built-in team formation features that help you find teammates with complementary skills for competitions.

#### Q: Are there prizes for competitions?
A: Many competitions offer prizes ranging from cash rewards to internship opportunities and tech gadgets. Prize details are specified for each competition.

</details>

<details>
<summary><strong>💻 Technical Questions</strong></summary>

#### Q: Can I contribute to the NeoFest codebase?
A: Yes! NeoFest is open-source and welcomes contributions. Check our [contributing guidelines](#contributing) for more information.

#### Q: What technologies should I learn for competitions?
A: Popular technologies include React, Node.js, Python, AI/ML frameworks, mobile development, and cloud platforms. Check individual competition requirements.

#### Q: How do I submit my project?
A: Projects can be submitted through GitHub repositories, live demo links, or file uploads depending on the competition format.

#### Q: Is my code and data secure?
A: Yes! NeoFest implements industry-standard security practices including encryption, secure authentication, and data protection measures.

</details>

---

## 🧪 Testing & Quality

### 🔍 **Code Quality**

- **📏 ESLint**: Code linting and style enforcement
- **🎨 Prettier**: Consistent code formatting  
- **📘 TypeScript**: Type safety and error prevention
- **🔒 Security**: Dependency vulnerability scanning

### 🧪 **Testing Strategy**

```bash
# 🧪 Run all tests
npm run test

# 📊 Coverage report with detailed metrics
npm run test:coverage

# 🎭 End-to-end tests with Playwright
npm run e2e

# 🎭 Interactive E2E test runner
npm run e2e:ui

# 🔍 Type checking across the codebase
npm run type-check

# 📏 Code linting and style checking
npm run lint

# 🔧 Auto-fix linting issues
npm run lint:fix

# 🎨 Code formatting with Prettier
npm run format

# 📊 Bundle analysis
npm run analyze
```

### 🧪 **Test Configuration**

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 📊 **Quality Metrics & Monitoring**

<table>
<tr>
<td width="50%">

#### 🎯 **Code Quality Targets**
- **📊 Test Coverage**: > 80%
- **🚀 Performance Score**: > 90
- **♿ Accessibility Score**: > 95
- **🔍 SEO Score**: > 90
- **📱 Mobile Score**: > 90

</td>
<td width="50%">

#### 🔧 **Quality Tools**
- **Jest**: Unit and integration testing
- **Playwright**: End-to-end testing
- **ESLint**: Code linting and standards
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Git hooks for quality gates

</td>
</tr>
</table>

### 🧪 **Testing Examples**

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })
})
```

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('user can sign up and sign in', async ({ page }) => {
    // Navigate to sign up page
    await page.goto('/auth/signup')
    
    // Fill out sign up form
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="confirm-password-input"]', 'password123')
    
    // Submit form
    await page.click('[data-testid="signup-button"]')
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User')
  })

  test('user can access protected routes after login', async ({ page }) => {
    // Sign in first
    await page.goto('/auth/signin')
    await page.fill('[data-testid="email-input"]', 'demo@neofest.com')
    await page.fill('[data-testid="password-input"]', 'demo123')
    await page.click('[data-testid="signin-button"]')
    
    // Try to access protected route
    await page.goto('/profile')
    await expect(page).toHaveURL('/profile')
    await expect(page.locator('h1')).toContainText('Profile')
  })
})
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🎯 **How to Contribute**

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💻 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** a Pull Request

### 📋 **Contribution Guidelines**

- **📝 Code Style**: Follow existing patterns and ESLint rules
- **📱 Responsive**: Ensure mobile compatibility
- **♿ Accessibility**: Follow WCAG guidelines
- **🧪 Testing**: Add tests for new features
- **📖 Documentation**: Update docs for new features

### 🐛 **Bug Reports**

Found a bug? Please create an issue with:
- **📝 Description**: Clear bug description
- **🔄 Steps**: Reproduction steps
- **🎯 Expected**: Expected behavior
- **📱 Environment**: Browser/OS information

---

## 📚 Documentation

### 🎓 **Learning Resources**

- **📖 [Component Documentation](#)** - Detailed component API
- **🎨 [Design System](#)** - UI guidelines and patterns
- **🔧 [API Reference](#)** - Complete API documentation
- **🎯 [Tutorials](#)** - Step-by-step guides
- **❓ [FAQ](#)** - Frequently asked questions

### 🔗 **External Resources**

- **[Next.js Documentation](https://nextjs.org/docs)**
- **[Prisma Documentation](https://www.prisma.io/docs)**
- **[NextAuth.js Documentation](https://next-auth.js.org/)**
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)**
- **[shadcn/ui Documentation](https://ui.shadcn.com/)**

---

## 📈 Roadmap

### 🎯 **Upcoming Features**

#### 🔄 **Short Term (v1.1)**
- [ ] **📧 Email Notifications**: Competition updates and reminders
- [ ] **👥 Team Management**: Enhanced team formation tools
- [ ] **📊 Advanced Analytics**: Detailed performance metrics
- [ ] **🏅 Achievement System**: Badges and rewards expansion

#### 🚀 **Medium Term (v1.2)**
- [ ] **🎮 Real-time Competitions**: Live coding challenges
- [ ] **💬 Chat System**: Team communication tools
- [ ] **📱 Mobile App**: Native iOS/Android application
- [ ] **🌍 Internationalization**: Multi-language support

#### 🔮 **Long Term (v2.0)**
- [ ] **🤖 AI Mentor**: Personalized learning assistant
- [ ] **🏢 Enterprise Features**: Corporate competition management
- [ ] **🔗 API Platform**: Third-party integrations
- [ ] **📺 Live Streaming**: Competition broadcasting

---

## 💖 Acknowledgments

### 🙏 **Special Thanks**

- **🎨 [shadcn/ui](https://ui.shadcn.com/)** - For the beautiful component library
- **⚡ [Vercel](https://vercel.com/)** - For the amazing deployment platform
- **🗄️ [Prisma](https://www.prisma.io/)** - For the excellent database toolkit
- **🔐 [NextAuth.js](https://next-auth.js.org/)** - For secure authentication
- **🎯 [Lucide](https://lucide.dev/)** - For the comprehensive icon library

### 🌟 **Contributors**

<div align="center">

*A heartfelt thank you to all our contributors who make NeoFest possible!* 

[🤝 View All Contributors](#)

</div>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## 🎉 Ready to Start Your Journey?

**Join thousands of developers, designers, and innovators on NeoFest!**

[![Get Started](https://img.shields.io/badge/Get_Started-4F46E5?style=for-the-badge&logo=rocket&logoColor=white)](#quick-start)
[![Join Discord](https://img.shields.io/badge/Join_Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](#)
[![Follow Twitter](https://img.shields.io/badge/Follow_Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](#)

---

**Built with ❤️ by the NeoFest Team**

*Empowering the next generation of tech innovators* ✨

</div>
