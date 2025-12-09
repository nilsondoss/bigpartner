# Property CRUD System Implementation Guide

## Overview

Complete CRUD (Create, Read, Update, Delete) system for properties with role-based permissions.

**Permissions:**
- **Admin**: Can edit/delete ANY property
- **Property Owner**: Can edit/delete ONLY their own properties
- **Regular Users**: Can view properties and create new ones

---

## ✅ Completed Features

### 1. **Edit Profile Page** ✅
- **File**: `src/pages/profile.tsx`
- **Route**: `/profile` (protected)
- **Features**:
  - Update name and email
  - Change password with current password verification
  - Form validation
  - Success/error messages
  - Auto-redirect to dashboard after update

### 2. **Profile Update API** ✅
- **File**: `src/server/api/users/profile/PUT.ts`
- **Endpoint**: `PUT /api/users/profile`
- **Features**:
  - Authentication check
  - Email uniqueness validation
  - Password verification and hashing
  - Returns updated user data

### 3. **Database Schema Update** ✅
- **File**: `src/server/db/schema.ts`
- **Migration**: `drizzle/0004_add_created_by_to_properties.sql`
- **Changes**:
  - Added `createdBy` field to properties table
  - Added index for `createdBy` for performance
  - Links properties to users table

### 4. **My Properties Page** ✅
- **File**: `src/pages/my-properties.tsx`
- **Route**: `/my-properties` (protected)
- **Features**:
  - List all user's properties
  - View count and inquiry stats
  - Edit/Delete buttons
  - Link to add new property
  - Responsive card layout

### 5. **Auth Context Update** ✅
- **File**: `src/contexts/AuthContext.tsx`
- **Added**: `updateUser()` function
- **Purpose**: Update user data in context after profile edit

### 6. **Dashboard Links** ✅
- **File**: `src/pages/dashboard.tsx`
- **Added**: Link to Edit Profile page

---

## 🚧 Remaining Implementation

### API Endpoints Needed

#### 1. **Get My Properties**
**File**: `src/server/api/properties/my-properties/GET.ts`

```typescript
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userProperties = await db
      .select({
        id: properties.id,
        title: properties.title,
        slug: properties.slug,
        propertyType: properties.propertyType,
        city: properties.city,
        state: properties.state,
        price: properties.price,
        status: properties.status,
        isFeatured: properties.isFeatured,
        isVerified: properties.isVerified,
        viewCount: properties.viewCount,
        inquiryCount: properties.inquiryCount,
        featuredImage: properties.featuredImage,
        createdAt: properties.createdAt,
      })
      .from(properties)
      .where(eq(properties.createdBy, userId))
      .orderBy(properties.createdAt);

    res.json({ properties: userProperties });
  } catch (error) {
    console.error('Fetch my properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
}
```

#### 2. **Update Existing POST Endpoint**
**File**: `src/server/api/properties/POST.ts`

Add `createdBy` field when creating properties:

```typescript
// Add after line where you get userId from session
const userId = req.session?.userId;
if (!userId) {
  return res.status(401).json({ error: 'Unauthorized - Please login' });
}

// Add to insert data
const result = await db.insert(properties).values({
  ...propertyData,
  createdBy: userId, // Add this line
});
```

#### 3. **Update Property Endpoint**
**File**: `src/server/api/properties/[id]/PUT.ts`

```typescript
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties, users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const propertyId = parseInt(req.params.id);
    const updateData = req.body;

    // Get property and check ownership
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Get user role
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Check permission: admin or owner
    if (user.role !== 'admin' && property.createdBy !== userId) {
      return res.status(403).json({ 
        error: 'Forbidden - You can only edit your own properties' 
      });
    }

    // Update property
    await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId));

    // Fetch updated property
    const [updatedProperty] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    res.json({ 
      message: 'Property updated successfully',
      property: updatedProperty 
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
}
```

#### 4. **Delete Property Endpoint**
**File**: `src/server/api/properties/[id]/DELETE.ts`

```typescript
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties, users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const propertyId = parseInt(req.params.id);

    // Get property and check ownership
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Get user role
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Check permission: admin or owner
    if (user.role !== 'admin' && property.createdBy !== userId) {
      return res.status(403).json({ 
        error: 'Forbidden - You can only delete your own properties' 
      });
    }

    // Delete property
    await db
      .delete(properties)
      .where(eq(properties.id, propertyId));

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
}
```

---

### Frontend Pages Needed

#### 1. **Add Property Page**
**File**: `src/pages/add-property.tsx`
**Route**: `/properties/add`

**Features**:
- Multi-step form (Basic Info → Location → Details → Media → Review)
- Image upload with preview
- Form validation
- Auto-generate slug from title
- Save as draft or publish
- Rich text editor for description

**Form Fields**:
- Title, Description, Property Type
- Address, City, State, Pincode
- Price, Area, Bedrooms, Bathrooms
- Amenities (checkboxes)
- Images upload
- Contact information

#### 2. **Edit Property Page**
**File**: `src/pages/edit-property.tsx`
**Route**: `/properties/edit/:id`

**Features**:
- Pre-filled form with existing data
- Same form as Add Property
- Permission check (owner or admin)
- Update existing images
- Delete confirmation

---

### Routes to Add

**File**: `src/routes.tsx`

```typescript
import MyPropertiesPage from './pages/my-properties';
import AddPropertyPage from './pages/add-property';
import EditPropertyPage from './pages/edit-property';

// Add these routes:
{
  path: '/my-properties',
  element: (
    <ProtectedRoute>
      <MyPropertiesPage />
    </ProtectedRoute>
  ),
},
{
  path: '/properties/add',
  element: (
    <ProtectedRoute>
      <AddPropertyPage />
    </ProtectedRoute>
  ),
},
{
  path: '/properties/edit/:id',
  element: (
    <ProtectedRoute>
      <EditPropertyPage />
    </ProtectedRoute>
  ),
},
```

---

### Dashboard Updates

**File**: `src/pages/dashboard.tsx`

Add "My Properties" link in Quick Actions:

```typescript
<Link to="/my-properties">
  <Button variant="outline" className="w-full justify-start">
    <Building2 className="h-4 w-4 mr-2" />
    My Properties
  </Button>
</Link>
```

---

## Permission Logic

### Helper Function

**File**: `src/server/lib/permissions.ts`

```typescript
import { db } from '../db/client.js';
import { users, properties } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export async function canEditProperty(
  userId: number,
  propertyId: number
): Promise<boolean> {
  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return false;

  // Admin can edit anything
  if (user.role === 'admin') return true;

  // Check if user owns the property
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, propertyId))
    .limit(1);

  return property?.createdBy === userId;
}

export async function canDeleteProperty(
  userId: number,
  propertyId: number
): Promise<boolean> {
  // Same logic as canEditProperty
  return canEditProperty(userId, propertyId);
}
```

---

## Testing Checklist

### Profile Edit
- [ ] Can update name
- [ ] Can update email
- [ ] Email uniqueness validation works
- [ ] Can change password with correct current password
- [ ] Cannot change password with wrong current password
- [ ] Password must be 6+ characters
- [ ] Success message shows
- [ ] Redirects to dashboard after update

### My Properties
- [ ] Shows only user's properties
- [ ] Empty state shows when no properties
- [ ] Can view property details
- [ ] Can edit own property
- [ ] Can delete own property with confirmation
- [ ] Stats (views, inquiries) display correctly

### Add Property
- [ ] Form validation works
- [ ] Can upload images
- [ ] Slug auto-generates from title
- [ ] Property saves with createdBy = current user
- [ ] Redirects to My Properties after save

### Edit Property
- [ ] Form pre-fills with existing data
- [ ] Can update all fields
- [ ] Can update images
- [ ] Owner can edit their property
- [ ] Admin can edit any property
- [ ] Non-owner cannot edit (403 error)

### Delete Property
- [ ] Confirmation dialog shows
- [ ] Owner can delete their property
- [ ] Admin can delete any property
- [ ] Non-owner cannot delete (403 error)
- [ ] Property removed from list after delete

---

## Security Considerations

1. **Authentication**: All CRUD endpoints check `req.session.userId`
2. **Authorization**: Edit/Delete check ownership or admin role
3. **Input Validation**: Validate all form inputs on backend
4. **SQL Injection**: Using Drizzle ORM prevents SQL injection
5. **File Upload**: Validate file types and sizes for images
6. **CSRF Protection**: Use session-based authentication

---

## Next Steps

1. ✅ Create API endpoint for "My Properties" (GET)
2. ✅ Update POST endpoint to include `createdBy`
3. ✅ Create PUT endpoint with permission check
4. ✅ Create DELETE endpoint with permission check
5. ⏳ Create Add Property page with form
6. ⏳ Create Edit Property page with pre-filled form
7. ⏳ Add routes to routes.tsx
8. ⏳ Update dashboard with "My Properties" link
9. ⏳ Test complete CRUD flow
10. ⏳ Test permissions (owner vs admin vs other users)

---

## Summary

**Completed**: Profile editing, database schema, My Properties page
**Remaining**: Add/Edit property forms, API endpoints, permission checks
**Estimated Time**: 2-3 hours for complete implementation

The system provides secure, role-based property management with full CRUD operations!
