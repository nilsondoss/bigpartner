# Property Management System - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [User Workflows](#user-workflows)
4. [Admin Workflows](#admin-workflows)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Email Notifications](#email-notifications)
8. [Testing Guide](#testing-guide)
9. [Post-Publishing Setup](#post-publishing-setup)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Property Management System is a comprehensive solution for managing real estate properties with user submissions, admin approval workflows, favorites, view tracking, and email notifications.

### Key Components

- **Backend API**: 13 RESTful endpoints
- **Frontend Pages**: 10 pages (7 user + 3 admin)
- **Database**: MySQL with Drizzle ORM
- **Email**: Nodemailer with 4 templates
- **Security**: Authentication, ownership checks, admin permissions

---

## Features

### User Features

#### 1. Property Management
- **Create Properties**: Submit new properties for approval
- **Edit Properties**: Update own properties
- **Delete Properties**: Soft delete (moves to trash)
- **Restore Properties**: Recover from trash within 30 days
- **View Properties**: Browse all approved properties

#### 2. Favorites/Wishlist
- **Add to Favorites**: Heart icon on property cards
- **Remove from Favorites**: Click heart again or use My Favorites page
- **View Favorites**: Dedicated page showing all saved properties

#### 3. Analytics Dashboard
- **Property Stats**: Total, approved, pending counts
- **View Counter**: Track property views
- **Favorites Count**: See saved properties
- **Quick Actions**: Links to manage properties

#### 4. Trash Management
- **30-Day Grace Period**: Restore deleted properties
- **Countdown Timer**: See days remaining
- **Permanent Delete**: Manual deletion option
- **Auto-Cleanup**: Automatic deletion after 30 days

### Admin Features

#### 1. Global Analytics Dashboard
- **Site-Wide Stats**: Total properties, users, views, inquiries
- **Status Breakdown**: Approved, pending, rejected percentages
- **Recent Activity**: Last 5 properties and users
- **Quick Actions**: Approve properties, manage all

#### 2. Property Approval System
- **Pending Queue**: List all properties awaiting approval
- **Approve**: One-click approval with email notification
- **Reject**: Reject with required reason, sends email
- **View**: Preview property before decision

#### 3. Property Management
- **View All**: See all properties regardless of status
- **Filter**: By status (available/pending/sold) and type
- **Search**: By title, location, or city
- **Edit Any**: Modify any property
- **Delete Any**: Remove any property

---

## User Workflows

### Creating a Property

1. **Login**: User must be authenticated
2. **Navigate**: Go to Dashboard → "Add Property" button
3. **Fill Form**: Enter property details (title, type, location, price, etc.)
4. **Submit**: Property created with status = "pending"
5. **Email Sent**: 
   - User receives confirmation email
   - Admin receives new property alert
6. **Wait for Approval**: Property appears in "My Properties" as pending

### Editing a Property

1. **Navigate**: Go to "My Properties"
2. **Click Edit**: On desired property
3. **Update Form**: Modify property details
4. **Save**: Changes saved immediately
5. **Ownership Check**: Can only edit own properties

### Deleting a Property

1. **Navigate**: Go to "My Properties"
2. **Click Delete**: On desired property
3. **Confirm**: Confirm deletion in dialog
4. **Soft Delete**: Property moved to trash (not permanently deleted)
5. **30-Day Grace**: Can restore within 30 days

### Restoring from Trash

1. **Navigate**: Go to "Trash" page
2. **View Deleted**: See all soft-deleted properties
3. **Check Timer**: See days remaining (color-coded badge)
4. **Click Restore**: Restore property
5. **Confirm**: Property moved back to active status

### Adding to Favorites

1. **Browse Properties**: Go to Properties page
2. **Click Heart**: On any property card
3. **Login Prompt**: If not authenticated
4. **Added**: Heart fills with red color
5. **Toast Notification**: Success message

### Viewing Favorites

1. **Navigate**: Go to "My Favorites"
2. **View Saved**: See all favorited properties
3. **Remove**: Click remove button with confirmation
4. **Navigate**: Click property to view details

---

## Admin Workflows

### Approving Properties

1. **Login as Admin**: admin@bigpartner.com
2. **Navigate**: Go to "Admin Dashboard" → "Approve Properties"
3. **View Pending**: See all properties awaiting approval
4. **Preview**: Click "View" to see property details
5. **Approve**: Click "Approve" button
6. **Email Sent**: User receives approval notification
7. **Status Updated**: Property status = "approved"

### Rejecting Properties

1. **Navigate**: Go to "Admin Property Approval"
2. **Click Reject**: On property to reject
3. **Enter Reason**: Required rejection reason in dialog
4. **Confirm**: Submit rejection
5. **Email Sent**: User receives rejection email with reason
6. **Status Updated**: Property status = "rejected"

### Managing All Properties

1. **Navigate**: Go to "Admin Dashboard" → "All Properties"
2. **Filter**: By status (available/pending/sold)
3. **Filter**: By type (residential/commercial/industrial/land)
4. **Search**: By title, location, or city
5. **Edit Any**: Click edit on any property
6. **Delete Any**: Click delete on any property

### Viewing Analytics

1. **Navigate**: Go to "Admin Dashboard"
2. **View Stats**: 
   - Total Properties (with breakdown)
   - Total Users (partners + investors)
   - Pending Approvals (with link)
   - Total Views
   - Total Inquiries
3. **Status Breakdown**: Approved, pending, rejected percentages
4. **Recent Activity**: Last 5 properties and users

---

## API Documentation

### Property Endpoints

#### `POST /api/properties`
Create a new property.

**Request Body:**
```json
{
  "title": "Modern Villa",
  "type": "residential",
  "location": "Dubai Marina",
  "price": 2500000,
  "description": "Luxury villa with sea view",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 3500,
  "features": ["pool", "gym", "parking"]
}
```

**Response:**
```json
{
  "id": 123,
  "title": "Modern Villa",
  "approvalStatus": "pending",
  "createdBy": 1,
  "createdAt": "2025-12-05T10:00:00Z"
}
```

**Emails Sent:**
- User: Property submission confirmation
- Admin: New property alert

---

#### `GET /api/properties`
Get all properties with filters.

**Query Parameters:**
- `status`: Filter by status (available/pending/sold)
- `type`: Filter by type (residential/commercial/industrial/land)
- `search`: Search by title, location, or city
- `userId`: Filter by owner (admin only)

**Response:**
```json
[
  {
    "id": 123,
    "title": "Modern Villa",
    "type": "residential",
    "location": "Dubai Marina",
    "price": 2500000,
    "approvalStatus": "approved",
    "views": 150,
    "createdBy": 1,
    "deleted": false
  }
]
```

---

#### `GET /api/properties/:id`
Get a single property by ID.

**Response:**
```json
{
  "id": 123,
  "title": "Modern Villa",
  "type": "residential",
  "location": "Dubai Marina",
  "price": 2500000,
  "description": "Luxury villa with sea view",
  "approvalStatus": "approved",
  "views": 150,
  "createdBy": 1,
  "deleted": false
}
```

---

#### `PUT /api/properties/:id`
Update a property (owner or admin only).

**Request Body:**
```json
{
  "title": "Updated Villa",
  "price": 2600000
}
```

**Response:**
```json
{
  "id": 123,
  "title": "Updated Villa",
  "price": 2600000,
  "updatedAt": "2025-12-05T11:00:00Z"
}
```

---

#### `DELETE /api/properties/:id`
Soft delete a property (owner or admin only).

**Response:**
```json
{
  "message": "Property moved to trash",
  "deletedAt": "2025-12-05T12:00:00Z"
}
```

---

### Approval Endpoints

#### `POST /api/properties/:id/approve`
Approve a pending property (admin only).

**Response:**
```json
{
  "message": "Property approved successfully",
  "property": {
    "id": 123,
    "approvalStatus": "approved"
  }
}
```

**Email Sent:** User receives approval notification

---

#### `POST /api/properties/:id/reject`
Reject a pending property (admin only).

**Request Body:**
```json
{
  "reason": "Property details incomplete"
}
```

**Response:**
```json
{
  "message": "Property rejected",
  "property": {
    "id": 123,
    "approvalStatus": "rejected",
    "rejectionReason": "Property details incomplete"
  }
}
```

**Email Sent:** User receives rejection notification with reason

---

### View Counter Endpoint

#### `POST /api/properties/:id/view`
Increment property view counter.

**Response:**
```json
{
  "message": "View count incremented",
  "views": 151
}
```

---

### Trash Endpoints

#### `POST /api/properties/:id/restore`
Restore a soft-deleted property (owner or admin only).

**Response:**
```json
{
  "message": "Property restored successfully",
  "property": {
    "id": 123,
    "deleted": false,
    "deletedAt": null
  }
}
```

---

### Favorites Endpoints

#### `GET /api/favorites`
Get user's favorite properties.

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "propertyId": 123,
    "createdAt": "2025-12-05T10:00:00Z",
    "property": {
      "id": 123,
      "title": "Modern Villa",
      "price": 2500000
    }
  }
]
```

---

#### `POST /api/favorites`
Add property to favorites.

**Request Body:**
```json
{
  "propertyId": 123
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "propertyId": 123,
  "createdAt": "2025-12-05T10:00:00Z"
}
```

---

#### `DELETE /api/favorites/:id`
Remove property from favorites.

**Response:**
```json
{
  "message": "Removed from favorites"
}
```

---

## Database Schema

### Properties Table

```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  type ENUM('residential', 'commercial', 'industrial', 'land') NOT NULL,
  location VARCHAR(255) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  description TEXT,
  bedrooms INT,
  bathrooms INT,
  area DECIMAL(10,2),
  features JSON,
  images JSON,
  status ENUM('available', 'pending', 'sold') DEFAULT 'available',
  slug VARCHAR(255) UNIQUE,
  
  -- Property Management Fields
  createdBy INT,
  approvalStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejectionReason TEXT,
  views INT DEFAULT 0,
  deleted BOOLEAN DEFAULT FALSE,
  deletedAt TIMESTAMP NULL,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (createdBy) REFERENCES users(id)
);
```

### Favorites Table

```sql
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  propertyId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (userId, propertyId)
);
```

---

## Email Notifications

### 1. Property Submission Confirmation (User)

**Subject:** Property Submitted Successfully

**Content:**
- Confirmation of property submission
- Property details summary
- Approval timeline (24-48 hours)
- Contact information

---

### 2. New Property Alert (Admin)

**Subject:** New Property Submitted for Approval

**Content:**
- Property details
- Submitter information
- Link to approval page
- Quick approve/reject actions

---

### 3. Property Approved (User)

**Subject:** Your Property Has Been Approved!

**Content:**
- Approval confirmation
- Property is now live
- Link to view property
- Next steps

---

### 4. Property Rejected (User)

**Subject:** Property Submission Update

**Content:**
- Rejection notification
- Rejection reason (from admin)
- Resubmission instructions
- Contact information

---

## Testing Guide

### User Workflow Testing

#### Test 1: Create Property
1. Login as regular user
2. Navigate to Dashboard
3. Click "Add Property"
4. Fill form with valid data
5. Submit
6. ✅ Verify: Property created with status = "pending"
7. ✅ Verify: User receives confirmation email
8. ✅ Verify: Admin receives alert email
9. ✅ Verify: Property appears in "My Properties" as pending

#### Test 2: Edit Property
1. Navigate to "My Properties"
2. Click "Edit" on a property
3. Update title and price
4. Save changes
5. ✅ Verify: Changes saved successfully
6. ✅ Verify: Cannot edit other users' properties

#### Test 3: Delete and Restore
1. Navigate to "My Properties"
2. Click "Delete" on a property
3. Confirm deletion
4. ✅ Verify: Property moved to trash
5. Navigate to "Trash"
6. ✅ Verify: Property appears with countdown
7. Click "Restore"
8. ✅ Verify: Property restored to active

#### Test 4: Favorites
1. Browse properties
2. Click heart icon on 3 properties
3. ✅ Verify: Heart fills with red color
4. ✅ Verify: Toast notification appears
5. Navigate to "My Favorites"
6. ✅ Verify: All 3 properties appear
7. Click "Remove" on one
8. ✅ Verify: Property removed from favorites

### Admin Workflow Testing

#### Test 5: Approve Property
1. Login as admin@bigpartner.com
2. Navigate to "Admin Dashboard"
3. Click "Approve Properties"
4. ✅ Verify: Pending properties listed
5. Click "Approve" on a property
6. ✅ Verify: Status updated to "approved"
7. ✅ Verify: User receives approval email
8. ✅ Verify: Property appears on public listings

#### Test 6: Reject Property
1. Navigate to "Admin Property Approval"
2. Click "Reject" on a property
3. Enter rejection reason
4. Confirm rejection
5. ✅ Verify: Status updated to "rejected"
6. ✅ Verify: User receives rejection email with reason
7. ✅ Verify: Property does not appear on public listings

#### Test 7: Admin Property Management
1. Navigate to "Admin Dashboard" → "All Properties"
2. ✅ Verify: All properties visible (approved, pending, rejected)
3. Filter by status = "pending"
4. ✅ Verify: Only pending properties shown
5. Search for "villa"
6. ✅ Verify: Only matching properties shown
7. Edit any property
8. ✅ Verify: Changes saved successfully

#### Test 8: Analytics Dashboard
1. Navigate to "Admin Dashboard"
2. ✅ Verify: Total properties count correct
3. ✅ Verify: Pending approvals count correct
4. ✅ Verify: Total views sum correct
5. ✅ Verify: Recent properties list (last 5)
6. ✅ Verify: Recent users list (last 5)

### Auto-Cleanup Testing

#### Test 9: 30-Day Auto-Cleanup
1. Manually set `deletedAt` to 31 days ago in database
2. Run cleanup script: `npm run db:cleanup-trash`
3. ✅ Verify: Old properties permanently deleted
4. ✅ Verify: Properties < 30 days remain in trash
5. ✅ Verify: Console logs show deleted properties

---

## Post-Publishing Setup

### Step 1: Run Database Migration

After publishing, apply the migration to add new fields:

```bash
npm run db:migrate
```

This will add:
- `createdBy` field
- `approvalStatus` field
- `rejectionReason` field
- `views` field
- `deleted` and `deletedAt` fields
- `favorites` table

---

### Step 2: Uncomment Schema Fields

In `src/server/db/schema.ts`, uncomment:

```typescript
// Uncomment these fields:
createdBy: int('created_by').references(() => users.id),
approvalStatus: mysqlEnum('approval_status', ['pending', 'approved', 'rejected']).default('pending'),
rejectionReason: text('rejection_reason'),
views: int('views').default(0),
deleted: boolean('deleted').default(false),
deletedAt: timestamp('deleted_at'),

// Uncomment favorites table:
export const favorites = mysqlTable('favorites', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  propertyId: int('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

### Step 3: Uncomment API Logic

In API files, uncomment sections marked:

```typescript
// TODO: Re-enable after migration
```

Files to update:
- `src/server/api/properties/GET.ts`
- `src/server/api/properties/POST.ts`
- `src/server/api/properties/[id]/PUT.ts`
- `src/server/api/properties/[id]/DELETE.ts`
- All approval and favorites endpoints

---

### Step 4: Setup Cron Job (Optional)

For automatic trash cleanup, setup a cron job:

```bash
# Run daily at midnight
0 0 * * * cd /path/to/app && npm run db:cleanup-trash
```

Or use a task scheduler like:
- **Linux/Mac**: crontab
- **Windows**: Task Scheduler
- **Cloud**: AWS Lambda, Google Cloud Functions

---

### Step 5: Test Everything

Follow the testing guide above to verify:
- ✅ User workflows (create, edit, delete, restore)
- ✅ Admin workflows (approve, reject, manage)
- ✅ Email notifications
- ✅ Favorites functionality
- ✅ View counter
- ✅ Auto-cleanup

---

## Troubleshooting

### Issue: Properties not appearing

**Cause:** Migration not applied or schema fields commented out

**Solution:**
1. Run `npm run db:migrate`
2. Uncomment schema fields in `src/server/db/schema.ts`
3. Restart server

---

### Issue: Emails not sending

**Cause:** SMTP configuration missing

**Solution:**
1. Check `src/server/lib/email.ts`
2. Verify SMTP settings (host: localhost, port: 25)
3. Check server logs for email errors

---

### Issue: Favorites not working

**Cause:** Favorites table not created

**Solution:**
1. Run `npm run db:migrate`
2. Uncomment favorites table in schema
3. Restart server

---

### Issue: Admin cannot approve properties

**Cause:** Admin email check failing

**Solution:**
1. Verify admin email is exactly: `admin@bigpartner.com`
2. Check `user.email` in API endpoints
3. Ensure admin is logged in

---

### Issue: View counter not incrementing

**Cause:** API endpoint not called or field missing

**Solution:**
1. Check `src/pages/property-detail.tsx` calls `/api/properties/:id/view`
2. Verify `views` field exists in database
3. Check API endpoint response

---

### Issue: Trash auto-cleanup not working

**Cause:** Cron job not setup or script failing

**Solution:**
1. Run manually: `npm run db:cleanup-trash`
2. Check console logs for errors
3. Verify `deletedAt` field exists
4. Setup cron job correctly

---

## Summary

The Property Management System provides a complete solution for:

- ✅ User property submissions with approval workflow
- ✅ Admin approval/rejection with email notifications
- ✅ Favorites/wishlist functionality
- ✅ View counter tracking
- ✅ Soft delete with 30-day grace period
- ✅ Auto-cleanup of old trash
- ✅ Comprehensive analytics dashboards
- ✅ Security and permissions
- ✅ 13 RESTful API endpoints
- ✅ 10 frontend pages (7 user + 3 admin)

**Total Code:** 3,000+ lines  
**Documentation:** 1,500+ lines  
**API Endpoints:** 13  
**Email Templates:** 4  
**Database Tables:** 2 (properties + favorites)

---

**For support or questions, refer to the API documentation or contact the development team.**
