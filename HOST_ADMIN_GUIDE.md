# Host Panel and Admin Panel Guide

This guide explains how to use the Host Panel and Admin Panel features in the NeoFest platform.

## Overview

The platform now includes a role-based access system with three user roles:
- **USER**: Regular users who can participate in hackathons and events
- **HOST**: Approved users who can create and manage hackathons
- **ADMIN**: System administrators who can manage users and approve host applications

## Admin Panel

### Access
- URL: `/admin`
- Requires ADMIN role
- Protected by authentication middleware

### Features
1. **User Management**
   - View all users with their roles and status
   - Activate/deactivate user accounts
   - Revoke host access from users

2. **Host Request Management**
   - Review pending host applications
   - Approve or reject host requests
   - Monitor host activity

3. **System Statistics**
   - Total users count
   - Active hosts count
   - Pending host requests
   - Total hackathons

### Admin User Setup
An admin user has been created with the following credentials:
- **Email**: `admin@neofest.com`
- **Password**: Any password (demo mode)
- **Role**: ADMIN

## Host Panel

### Access
- URL: `/host`
- Requires HOST role with approval
- Protected by authentication middleware

### Features
1. **Hackathon Management**
   - Create new hackathons
   - Edit existing hackathons
   - Delete hackathons
   - View participant statistics

2. **Host Dashboard**
   - View hosting statistics
   - Monitor hackathon performance
   - Track participant engagement

### Becoming a Host
1. Sign in to your account
2. Go to your dashboard
3. Find the "Become a Host" section
4. Click "Apply for Host Access"
5. Wait for admin approval
6. Once approved, access the host panel at `/host`

## User Flow

### For Regular Users
1. **Sign up/Sign in** → Regular user account created
2. **Apply for Host** → Role changed to HOST (pending approval)
3. **Admin Approval** → `isHostApproved` set to true
4. **Access Host Panel** → Can create and manage hackathons

### For Admins
1. **Sign in with admin credentials**
2. **Access Admin Panel** → Manage users and host requests
3. **Review Applications** → Approve/reject host requests
4. **Monitor System** → View statistics and manage users

## API Endpoints

### Admin APIs
- `GET /api/admin/check-access` - Check admin permissions
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics
- `POST /api/admin/approve-host` - Approve host application
- `POST /api/admin/revoke-host` - Revoke host access
- `POST /api/admin/toggle-user-status` - Activate/deactivate users

### Host APIs
- `GET /api/host/check-access` - Check host permissions
- `GET /api/host/hackathons` - Get host's hackathons
- `POST /api/host/hackathons` - Create new hackathon
- `PUT /api/host/hackathons/[id]` - Update hackathon
- `DELETE /api/host/hackathons/[id]` - Delete hackathon
- `GET /api/host/stats` - Get host statistics

### User APIs
- `POST /api/user/apply-host` - Apply for host access

## Database Schema Changes

The following fields were added to the User model:
```prisma
model User {
  // ... existing fields
  role          UserRole @default(USER)
  isHostApproved Boolean @default(false)
}

enum UserRole {
  USER
  HOST
  ADMIN
}
```

## Security Features

1. **Role-based Access Control**: Each panel checks user roles before allowing access
2. **Authentication Required**: All admin and host routes require authentication
3. **Permission Validation**: API endpoints validate user permissions
4. **Middleware Protection**: Routes are protected by NextAuth middleware

## Getting Started

1. **Run the application**: `npm run dev`
2. **Sign in as admin**: Use `admin@neofest.com` with any password
3. **Access admin panel**: Navigate to `/admin`
4. **Create regular user**: Sign up with a different email
5. **Apply for host**: Use the dashboard to apply for host access
6. **Approve as admin**: Switch to admin panel to approve the request
7. **Access host panel**: Navigate to `/host` as approved host

## Notes

- The current authentication system is in demo mode and accepts any password
- In production, implement proper password hashing and validation
- Consider adding email notifications for host approvals
- Add audit logging for admin actions
- Implement proper error handling and validation