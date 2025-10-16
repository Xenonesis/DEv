# Role Switching Guide

## Quick Start

Users can now **switch between Participant and Host roles** from their profile settings with a single click!

## How It Works

### For Users

1. **Sign in** to your account
2. Go to **Profile** (`/profile`)
3. Find the **"Role Settings"** card
4. Click **"Switch to Host"** or **"Switch to Participant"**
5. Done! Your role changes instantly

### Visual Guide

```
┌─────────────────────────────────────────┐
│         Profile Page                    │
├─────────────────────────────────────────┤
│  👤 Profile Information                 │
│     Name, Email, Bio, Skills            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ⚙️  Role Settings                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ Participant  │  │    Host      │   │
│  │    Mode      │  │    Mode      │   │
│  │              │  │              │   │
│  │ • Browse     │  │ • Create     │   │
│  │ • Register   │  │ • Manage     │   │
│  │ • Submit     │  │ • Analytics  │   │
│  │              │  │              │   │
│  │ [Active ✓]   │  │ [Switch →]   │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
```

## Features

### Participant Mode (USER)
- ✅ Browse all hackathons
- ✅ Register for events
- ✅ Submit projects
- ✅ Join teams
- ✅ View leaderboards

### Host Mode (HOST)
- ✅ **All Participant features** +
- ✅ Create new hackathons
- ✅ Edit hackathon details
- ✅ Delete hackathons
- ✅ View participant lists
- ✅ Manage hackathon status
- ✅ Access host dashboard (`/host`)

## Benefits

### 🎯 Single Account
No need to create separate accounts for different roles. One account, multiple capabilities.

### ⚡ Instant Switching
Switch roles in real-time without logging out or losing your session.

### 📊 Unified Profile
All your achievements, stats, and history stay with you regardless of role.

### 🔄 Flexible Workflow
- Host a hackathon in the morning
- Participate in another hackathon in the afternoon
- Switch back and forth as needed

## Technical Details

### API Endpoint
```typescript
POST /api/user/switch-role
Content-Type: application/json

{
  "role": "USER" | "HOST"
}
```

### Response
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

### Database Changes
When switching to HOST:
- `role` field updated to `HOST`
- `isHostApproved` automatically set to `true`
- User gains access to `/host` dashboard
- Can create hackathons immediately

When switching to USER:
- `role` field updated to `USER`
- Retains `isHostApproved` status (can switch back anytime)
- Loses access to host-only features

## Security

### Role Restrictions
- ✅ Regular users can switch between USER and HOST
- ❌ ADMIN users cannot switch roles (permanent admin status)
- ✅ All role changes are authenticated
- ✅ Role is validated on every API request

### Access Control
- Host-only endpoints check for `role === 'HOST'`
- Hackathon ownership verified before edit/delete
- Admins can manage all hackathons regardless of ownership

## Examples

### Example 1: Becoming a Host
```typescript
// User clicks "Switch to Host" button
const response = await fetch('/api/user/switch-role', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'HOST' })
});

// User is now a host and can access /host dashboard
```

### Example 2: Switching Back to Participant
```typescript
// User clicks "Switch to Participant" button
const response = await fetch('/api/user/switch-role', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'USER' })
});

// User is now a participant
```

## UI Components

### Profile Page
- **Location**: `/profile`
- **Component**: Role Settings Card
- **Features**:
  - Visual comparison of both roles
  - Active role indicator
  - One-click switching
  - Loading state during switch
  - Success/error notifications

### Navigation
- Role badge displayed in profile card
- Host users see link to host dashboard
- Navbar adapts based on current role

## FAQs

**Q: Will I lose my data when switching roles?**
A: No! All your profile data, achievements, and history are preserved.

**Q: Can I host and participate at the same time?**
A: You can only be in one role at a time, but you can switch instantly between them.

**Q: Do I need approval to become a host?**
A: No! Role switching is instant and automatic. You're approved as soon as you switch.

**Q: Can I switch roles multiple times?**
A: Yes! Switch as many times as you need.

**Q: What happens to my hosted hackathons if I switch to participant?**
A: Your hackathons remain in the database. You can switch back to host mode to manage them again.

**Q: Can admins switch roles?**
A: No, admin is a permanent role with full system access.

## Troubleshooting

### Issue: "Failed to switch role"
**Solution**: Ensure you're logged in and try again. Check your internet connection.

### Issue: "Admins cannot switch roles"
**Solution**: This is expected. Admin accounts have permanent admin privileges.

### Issue: Can't access host dashboard after switching
**Solution**: Refresh the page or navigate to `/host` manually.

## Best Practices

1. **Switch roles based on your current task**
   - Creating/managing hackathons? → Host mode
   - Browsing/participating? → Participant mode

2. **Use the profile page for role management**
   - Clear visual interface
   - Easy to understand current role
   - Quick switching

3. **Check the role badge**
   - Always visible in your profile
   - Confirms current active role

4. **Leverage both roles**
   - Host your own hackathons
   - Participate in others' events
   - Build a complete profile

## Summary

Role switching provides a **seamless, flexible experience** where users can:
- ✅ Use a single account for all activities
- ✅ Switch between roles instantly
- ✅ Access role-specific features on demand
- ✅ Maintain unified profile and history

No more multiple accounts. No more complicated workflows. Just simple, instant role switching! 🚀
