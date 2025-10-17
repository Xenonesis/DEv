# Host Events - Verification Steps

## Quick Verification Guide

### 1. Start the Application
```bash
npm run dev
```
The server should start on `http://localhost:3000`

### 2. Login as a Host User
- Navigate to `/auth/signin`
- Login with a user account that has `role: HOST` and `isHostApproved: true`
- If you don't have a host account, you'll need to:
  1. Create a regular account
  2. Apply for host access at `/apply-host` (if available)
  3. Have an admin approve it at `/admin`

### 3. Access Host Panel
- Navigate to `/host`
- You should see the host dashboard with:
  - Stats cards (Total Hackathons, Active, Participants, Completed)
  - Quick access cards for different management sections
  - **NEW**: "Events Management" card with green gradient

### 4. Access Events Management
- Click "Manage Events" button on the Events Management card
- OR navigate directly to `/host/events`
- You should see:
  - Stats dashboard (Total Events, Upcoming, Past Events, Total Participants)
  - Events table (empty if no events created yet)
  - "Create Event" button in the header

### 5. Create a New Event
Click "Create Event" and fill in the form:

**Required Fields:**
- Title: e.g., "Web Development Workshop"
- Type: Select from dropdown (WORKSHOP, SEMINAR, NETWORKING, COMPETITION, SOCIAL)
- Description: e.g., "Learn modern web development techniques"
- Date: Select a future date
- Start Time: e.g., "14:00"
- Duration (min): e.g., "120"

**Optional Fields:**
- Location: e.g., "Tech Hub, Building A"
- Max Attendees: e.g., "50"
- Online Event: Check if it's online
- Tags: e.g., "web, development, react"

Click "Create" - you should see:
- Success toast notification
- Event appears in the table
- Stats update automatically

### 6. Edit an Event
- Click the Edit icon (pencil) on any event
- Modify any fields
- Click "Update"
- Verify changes are saved

### 7. View Participants
- Click the Users icon on any event
- Dialog should open showing participant list
- If no participants, you'll see "No participants yet"

### 8. Delete an Event
- Click the Delete icon (trash) on any event
- Confirm the deletion
- Event should be removed from the list
- Stats should update

### 9. API Testing (Optional)

#### Get All Host Events
```bash
# Requires authentication cookie
GET http://localhost:3000/api/host/events
```

#### Create Event
```bash
POST http://localhost:3000/api/host/events
Content-Type: application/json

{
  "title": "Test Event",
  "description": "Testing event creation",
  "type": "WORKSHOP",
  "date": "2025-02-01",
  "startTime": "10:00",
  "duration": 60,
  "isOnline": true,
  "maxAttendees": 30
}
```

#### Get Event Stats
```bash
GET http://localhost:3000/api/host/events-stats
```

### 10. Database Verification

Check the database to verify data is being saved:

```sql
-- Check events table
SELECT id, title, type, "hostId", "isOnline", "maxAttendees", date 
FROM events 
WHERE "hostId" IS NOT NULL;

-- Check event participants
SELECT e.title, COUNT(ep.id) as participant_count
FROM events e
LEFT JOIN event_participants ep ON e.id = ep."eventId"
WHERE e."hostId" IS NOT NULL
GROUP BY e.id, e.title;
```

## Expected Behavior

### ✅ Success Indicators:
1. No console errors
2. Events are created and stored in database
3. Stats update in real-time
4. Edit/Delete operations work correctly
5. Participant dialog displays properly
6. Toast notifications appear for all actions
7. Form validation prevents invalid submissions
8. Only authenticated hosts can access the pages
9. Hosts can only edit/delete their own events

### ❌ Common Issues:

**Issue: "Host access required" error**
- Solution: Ensure user has `role: 'HOST'` and `isHostApproved: true` in database

**Issue: TypeScript errors about hostId**
- Solution: Run `npx prisma generate` to regenerate Prisma client

**Issue: Events not appearing**
- Solution: Check that events have the correct hostId matching your user ID

**Issue: 404 on /host/events**
- Solution: Verify the page file exists at `src/app/host/events/page.tsx`

## Test Scenarios

### Scenario 1: Create Workshop Event
1. Create a WORKSHOP type event
2. Set it as online
3. Add max attendees of 100
4. Verify it appears in the list

### Scenario 2: Create Multiple Event Types
1. Create one event of each type (WORKSHOP, SEMINAR, NETWORKING, COMPETITION, SOCIAL)
2. Verify all appear in the table
3. Check that stats show correct total (5 events)

### Scenario 3: Edit Event Details
1. Create an event
2. Edit the title and description
3. Change from online to offline
4. Verify all changes persist

### Scenario 4: Delete Event
1. Create a test event
2. Delete it
3. Verify it's removed from list
4. Check stats decrease by 1

### Scenario 5: Participant Management
1. Create an event
2. Have another user register for it (through /events page)
3. View participants from host panel
4. Verify participant appears in the list

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] Event creation completes in < 1 second
- [ ] Stats update immediately after operations
- [ ] No memory leaks (check browser dev tools)
- [ ] Responsive design works on mobile

## Security Checks

- [ ] Non-host users cannot access /host/events
- [ ] Hosts cannot edit/delete other hosts' events
- [ ] API endpoints require authentication
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)

---

**All checks passed? Implementation is successful! ✅**
