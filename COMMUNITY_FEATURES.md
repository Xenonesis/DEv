# Community Features Documentation

## Overview
The community section provides four main features for user engagement and collaboration, all integrated with the database (no mock data).

## Features

### 1. Forums (`/community/forums`)
**Purpose**: Discussion platform for community members

**Database Models**:
- `Forum`: Main discussion threads
- `ForumReply`: Replies to forum threads

**Features**:
- Create new discussion threads
- Reply to existing discussions
- Category-based filtering (General, Help, Showcase, Announcements, Feedback, Technical, Career)
- Pin important threads
- Lock threads to prevent further replies
- View and reply counts
- Thread detail pages with full conversation

**API Endpoints**:
- `GET /api/community/forums` - List all forums (with optional category filter)
- `POST /api/community/forums` - Create new forum thread (requires authentication)
- `GET /api/community/forums/[id]` - Get forum details with replies
- `POST /api/community/forums/[id]/replies` - Add reply to forum (requires authentication)

### 2. Teams (`/community/teams`)
**Purpose**: Team formation for hackathons

**Database Models**:
- `Team`: Team information
- `TeamMember`: Team membership with roles (LEADER/MEMBER)

**Features**:
- Create teams for specific hackathons
- Join existing teams
- View team members with their levels
- Team capacity management (max members)
- Leader designation (crown icon)
- Winner badge for teams with winning projects

**API Endpoints**:
- `GET /api/community/teams` - List all teams (with optional hackathon filter)
- `POST /api/community/teams` - Create new team (requires authentication)
- `POST /api/community/teams/[id]/join` - Join a team (requires authentication)

### 3. Leaderboard (`/community/leaderboard`)
**Purpose**: Showcase top performers in the community

**Database Integration**:
- Pulls real user data with points, levels, and achievements
- Calculates hackathon participation, wins, and achievements

**Features**:
- Top 3 podium display with special styling
- Timeframe filtering (All Time, This Month, This Week)
- User statistics:
  - Total points
  - User level
  - Hackathons participated
  - Wins count
  - Achievements count
- Top achievements display
- Skills badges

**API Endpoints**:
- `GET /api/community/leaderboard` - Get ranked users (with timeframe filter)

### 4. Success Stories (`/community/success-stories`)
**Purpose**: Share and celebrate achievements

**Database Model**:
- `SuccessStory`: User success stories with rich content

**Features**:
- Create and share success stories
- Featured stories section
- Image support
- Tags for categorization
- Like and view counts
- Full story detail pages
- Author information display

**API Endpoints**:
- `GET /api/community/success-stories` - List all stories (with featured filter)
- `POST /api/community/success-stories` - Create new story (requires authentication)
- `GET /api/community/success-stories/[id]` - Get story details with author info

## Database Schema Updates

### New Models Added:

```prisma
model Forum {
  id          String        @id @default(cuid())
  title       String
  description String
  category    ForumCategory
  isPinned    Boolean       @default(false)
  isLocked    Boolean       @default(false)
  views       Int           @default(0)
  authorId    String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  author      User          @relation("ForumAuthor")
  replies     ForumReply[]
}

model ForumReply {
  id        String   @id @default(cuid())
  content   String
  forumId   String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  forum     Forum    @relation(...)
  author    User     @relation("ForumReplyAuthor")
}

model SuccessStory {
  id          String   @id @default(cuid())
  title       String
  content     String
  excerpt     String
  imageUrl    String?
  authorId    String
  hackathonId String?
  projectId   String?
  tags        String?
  likes       Int      @default(0)
  views       Int      @default(0)
  isFeatured  Boolean  @default(false)
  publishedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  author      User     @relation("StoryAuthor")
}

enum ForumCategory {
  GENERAL
  HELP
  SHOWCASE
  ANNOUNCEMENTS
  FEEDBACK
  TECHNICAL
  CAREER
}
```

### User Model Updates:
Added relations for:
- `forums` - User's created forum threads
- `forumReplies` - User's forum replies
- `successStories` - User's success stories

## Authentication Requirements

**Public Access** (No authentication required):
- View forums and discussions
- View teams
- View leaderboard
- View success stories

**Authenticated Access** (Login required):
- Create forum threads
- Reply to forums
- Create teams
- Join teams
- Share success stories

## UI/UX Features

- **Responsive Design**: All pages work on mobile, tablet, and desktop
- **Dark Theme**: Consistent with the app's purple/dark aesthetic
- **Interactive Cards**: Hover effects and transitions
- **Real-time Data**: All data fetched from database
- **Loading States**: Proper loading indicators
- **Empty States**: Helpful messages when no data exists
- **Icons**: Lucide icons for visual clarity
- **Badges**: Category, status, and achievement badges
- **Avatars**: User profile images throughout

## Navigation

Access community features from:
- Main navigation menu (Community dropdown/link)
- Direct URLs:
  - `/community` - Main community hub
  - `/community/forums` - Forums listing
  - `/community/teams` - Teams listing
  - `/community/leaderboard` - Leaderboard
  - `/community/success-stories` - Success stories

## Next Steps

To use these features:

1. **Run Prisma Migration** (if not already done):
   ```bash
   npx prisma db push
   ```

2. **Seed Sample Data** (optional, for testing):
   - Create sample forums, teams, and stories through the UI
   - Or create a seed script

3. **Test Features**:
   - Create an account and login
   - Try creating forums, teams, and stories
   - View leaderboard rankings
   - Test all CRUD operations

## Notes

- All features are fully integrated with PostgreSQL database
- No mock or fake data is used
- Authentication is handled via NextAuth
- All API routes include proper error handling
- Data validation is performed on both client and server
