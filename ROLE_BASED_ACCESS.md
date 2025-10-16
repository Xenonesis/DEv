# Role-Based Access Control for Hackathons

## Overview

The platform implements **flexible role-based access control** where users can switch between roles from their profile settings. Each user has a single account but can toggle between:
- **USER** (Participant) - Default role, can participate in hackathons
- **HOST** - Can create and manage hackathons
- **ADMIN** - Full system access (cannot switch roles)

## User Roles

### 1. Participant (USER)
**Capabilities:**
- Browse all hackathons
- Register for hackathons
- View hackathon details
- Submit projects to hackathons they're registered for

**Access:**
- Public hackathon listing at `/hackathons`
- Individual hackathon pages
- Registration via API: `POST /api/hackathons/[id]`

### 2. Host (HOST)
**Capabilities:**
- All participant capabilities
- Create new hackathons
- Edit their own hackathons
- Delete their own hackathons
- View participant lists for their hackathons
- Manage hackathon status (UPCOMING, ONGOING, COMPLETED, CANCELLED)

**Access:**
- Host dashboard at `/host`
- API endpoints:
  - `GET /api/host/hackathons` - List host's hackathons
  - `POST /api/host/hackathons` - Create hackathon
  - `PUT /api/host/hackathons/[id]` - Update hackathon
  - `DELETE /api/host/hackathons/[id]` - Delete hackathon
  - `GET /api/host/stats` - View host statistics

**Requirements:**
- Must have `role: HOST`
- Must have `isHostApproved: true`
- Must have `isActive: true`

### 3. Admin (ADMIN)
**Capabilities:**
- All host capabilities
- Approve/revoke host applications
- Manage all hackathons (not just their own)
- Access admin panel

**Access:**
- Admin dashboard at `/admin`
- All host endpoints
- Admin-specific endpoints for user management

## Database Schema Changes

### Hackathon Model
Added `hostId` field to track who created each hackathon:
```prisma
model Hackathon {
  // ... other fields
  hostId      String   // Host who created the hackathon
  
  // Relations
  host         User     @relation("HostedHackathons", fields: [hostId], references: [id])
  // ... other relations
}
```

### User Model
Added relation to track hosted hackathons:
```prisma
model User {
  // ... other fields
  role          UserRole @default(USER)
  isHostApproved Boolean @default(false)
  
  // Relations
  hostedHackathons Hackathon[] @relation("HostedHackathons")
  // ... other relations
}
```

## Role Switching

### How to Switch Roles

Users can switch between **USER** (Participant) and **HOST** roles directly from their profile:

1. **Navigate to Profile**: Go to `/profile` or click your avatar in the navbar
2. **Find Role Settings**: Scroll to the "Role Settings" card
3. **Choose Your Mode**:
   - **Participant Mode**: Browse and join hackathons
   - **Host Mode**: Create and manage hackathons
4. **Click Switch**: Click the button to switch roles instantly

### Benefits of Role Switching

- **Single Account**: No need for multiple accounts
- **Instant Access**: Switch roles anytime based on your current needs
- **Seamless Experience**: All your data (profile, achievements, history) stays with you
- **Flexible Workflow**: Be a participant in some hackathons and host others

### API Endpoint

```typescript
POST /api/user/switch-role
Body: { role: 'USER' | 'HOST' }
```

**Response:**
```json
{
  "success": true,
  "message": "Role switched to HOST successfully",
  "data": {
    "role": "HOST",
    "isHostApproved": true
  }
}
```

## Setup Instructions (Optional)

### Creating Users via Script

If you need to programmatically create users with specific roles:

```bash
npx tsx setup-host.ts
```

This will prompt you for email and name, then create/update a user with HOST role.

**Note:** With role switching enabled, users can simply switch to HOST mode from their profile, making this script optional.

### Creating an Admin User

Run the admin setup script:
```bash
npx tsx setup-admin.ts
```

This creates an admin user with email `admin@neofest.com`.

## API Authentication

All protected endpoints require authentication via NextAuth session. The session must include:
- Valid user email
- Active session token

### Example: Creating a Hackathon (Host Only)

```typescript
const response = await fetch('/api/host/hackathons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'AI Innovation Challenge',
    description: 'Build innovative AI solutions',
    theme: 'Artificial Intelligence',
    prize: '$10,000',
    maxParticipants: 100,
    startDate: '2024-03-15T09:00:00Z',
    endDate: '2024-03-17T18:00:00Z',
    difficulty: 'INTERMEDIATE',
    tags: ['AI', 'Machine Learning', 'Innovation']
  })
});
```

### Example: Registering for a Hackathon (Any Authenticated User)

```typescript
const response = await fetch(`/api/hackathons/${hackathonId}`, {
  method: 'POST'
});
```

## Frontend Components

### Host Dashboard (`/host`)
- View all hackathons created by the host
- Create new hackathons via dialog form
- Edit existing hackathons
- Delete hackathons
- View statistics (total hackathons, active, participants, completed)

### Hackathon Listing (Public)
- Browse all hackathons
- Filter by difficulty, status, search
- Sort by date, prize, participants, rating
- Register for hackathons (authenticated users)

## Security Features

1. **Authentication Required**: All write operations require valid session
2. **Role Verification**: Endpoints check user role before allowing access
3. **Ownership Validation**: Hosts can only modify their own hackathons (except admins)
4. **Host Approval**: Hosts must be approved (`isHostApproved: true`) to create hackathons
5. **Active Status**: Users must be active (`isActive: true`) to perform actions

## Migration Notes

- All existing hackathons in the database were removed (mock data)
- Hosts now create hackathons dynamically
- Each hackathon is linked to its creator via `hostId`
- The seed file no longer creates mock hackathons

## Testing

1. **Sign up/Sign in** at `/auth/signin`

2. **Go to your profile** at `/profile`

3. **Switch to Host mode** using the Role Settings card

4. **Navigate to `/host`** to access the host dashboard (or click the link in the tip)

5. **Create a hackathon** using the "Create Hackathon" button

6. **Switch back to Participant mode** to browse and register for hackathons

7. **Test role persistence**: Your role will be remembered across sessions

## Future Enhancements

- Host application workflow (users can apply to become hosts)
- Email notifications for hackathon updates
- Host analytics dashboard
- Participant management tools
- Team formation features
- Project submission and voting system
