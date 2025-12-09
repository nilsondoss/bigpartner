# 🔐 Login Credentials & Testing Guide

## Test User Accounts

### Regular User Account
- **Email:** `user@bigpartner.com`
- **Password:** `user123`
- **Role:** User
- **Access:** Dashboard, property viewing, inquiries

### Admin User Account
- **Email:** `admin@bigpartner.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Full admin dashboard, property management, inquiries, investors, partners

---

## Login System Verification

### ✅ Login Flow Components

1. **Frontend:** `/login` page (`src/pages/login.tsx`)
   - Email and password input fields
   - Form validation
   - Error handling
   - Loading states

2. **API Endpoint:** `/api/auth/login` (`src/server/api/auth/login/POST.ts`)
   - Email validation
   - Password verification using bcrypt
   - Session creation
   - Cookie management

3. **Auth Library:** `src/server/lib/auth.ts`
   - Password hashing with bcrypt (10 salt rounds)
   - Password verification
   - Session management
   - Email validation

4. **Database:**
   - Users table with email, password_hash, role
   - Sessions table for session management
   - Seeded with test users

---

## Testing the Login System

### Test Case 1: Regular User Login
1. Navigate to: https://lmnesop1a2.preview.c24.airoapp.ai/login
2. Enter email: `user@bigpartner.com`
3. Enter password: `user123`
4. Click "Sign In"
5. **Expected:** Redirect to `/dashboard`
6. **Verify:** User dashboard displays with user info

### Test Case 2: Admin User Login
1. Navigate to: https://lmnesop1a2.preview.c24.airoapp.ai/login
2. Enter email: `admin@bigpartner.com`
3. Enter password: `admin123`
4. Click "Sign In"
5. **Expected:** Redirect to `/dashboard`
6. **Verify:** Admin can access `/admin/properties`, `/admin/inquiries`, etc.

### Test Case 3: Invalid Credentials
1. Navigate to: https://lmnesop1a2.preview.c24.airoapp.ai/login
2. Enter email: `wrong@example.com`
3. Enter password: `wrongpassword`
4. Click "Sign In"
5. **Expected:** Error message "Email or password is incorrect"
6. **Verify:** User stays on login page

### Test Case 4: Empty Fields
1. Navigate to: https://lmnesop1a2.preview.c24.airoapp.ai/login
2. Leave email and password empty
3. Click "Sign In"
4. **Expected:** Browser validation prevents submission
5. **Verify:** Required field validation works

### Test Case 5: Invalid Email Format
1. Navigate to: https://lmnesop1a2.preview.c24.airoapp.ai/login
2. Enter email: `notanemail`
3. Enter password: `user123`
4. Click "Sign In"
5. **Expected:** Error message "Please provide a valid email address"
6. **Verify:** Email format validation works

---

## Property Images Verification

### ✅ Image Display Components

1. **Database Field:** `featured_image` (snake_case)
   - Stores full image URL
   - Example: `https://images.unsplash.com/photo-...`

2. **API Response:** `/api/properties`
   - Returns `featured_image` field with URL
   - All 31 properties have image URLs

3. **Frontend Transformation:** `src/pages/properties.tsx`
   - Line 70-71: Correctly uses `prop.featured_image`
   - Fallback to Unsplash image if missing
   - Transforms to `image` field for display

4. **Property Card Display:**
   - Image displayed in card header
   - Responsive image sizing
   - Fallback images for missing data

---

## Testing Property Images

### Test Case 1: Main Properties Page
1. Navigate to: https://lmnesop1a2.preview.c24.airoapp.ai/properties
2. **Expected:** All property cards display images
3. **Verify:** 
   - Images load correctly
   - No broken image icons
   - Images are responsive

### Test Case 2: Property Type Pages
1. **Industrial:** https://lmnesop1a2.preview.c24.airoapp.ai/properties/industrial
2. **Residential:** https://lmnesop1a2.preview.c24.airoapp.ai/properties/residential
3. **Commercial:** https://lmnesop1a2.preview.c24.airoapp.ai/properties/commercial
4. **Farmland:** https://lmnesop1a2.preview.c24.airoapp.ai/properties/farmland
5. **Rental:** https://lmnesop1a2.preview.c24.airoapp.ai/properties/rental
6. **Expected:** All properties show images
7. **Verify:** Images match property type

### Test Case 3: Property Detail Pages
1. Click any property card
2. **Expected:** Navigate to `/property/[slug]`
3. **Verify:**
   - Featured image displays in gallery
   - Image is high quality
   - Gallery navigation works (if multiple images)

---

## Current System Status

### ✅ Working Components
- Login authentication system
- Password hashing and verification
- Session management
- User and admin accounts seeded
- Property images stored in database
- Image display on all property pages
- Slug-based property URLs

### ⚠️ Pending Actions
1. **Run database migration** to update property types:
   - URL: https://lmnesop1a2.preview.c24.airoapp.ai/api/properties/update-types
   - This updates 16 properties to correct property types

2. **Verify property counts** after migration:
   - Industrial: 4 properties
   - Residential: 5 properties
   - Commercial: 11 properties
   - Farmland: 5 properties
   - Rental: 6 properties

---

## Quick Test Links

### Authentication
- Login: https://lmnesop1a2.preview.c24.airoapp.ai/login
- Register: https://lmnesop1a2.preview.c24.airoapp.ai/register
- Dashboard: https://lmnesop1a2.preview.c24.airoapp.ai/dashboard

### Properties
- All Properties: https://lmnesop1a2.preview.c24.airoapp.ai/properties
- Industrial: https://lmnesop1a2.preview.c24.airoapp.ai/properties/industrial
- Residential: https://lmnesop1a2.preview.c24.airoapp.ai/properties/residential
- Commercial: https://lmnesop1a2.preview.c24.airoapp.ai/properties/commercial
- Farmland: https://lmnesop1a2.preview.c24.airoapp.ai/properties/farmland
- Rental: https://lmnesop1a2.preview.c24.airoapp.ai/properties/rental

### Admin (requires admin login)
- Properties: https://lmnesop1a2.preview.c24.airoapp.ai/admin/properties
- Inquiries: https://lmnesop1a2.preview.c24.airoapp.ai/admin/inquiries
- Investors: https://lmnesop1a2.preview.c24.airoapp.ai/admin/investors
- Partners: https://lmnesop1a2.preview.c24.airoapp.ai/admin/partners

---

## Troubleshooting

### Login Issues
- **Error: "Invalid credentials"**
  - Check email is exactly: `user@bigpartner.com` or `admin@bigpartner.com`
  - Check password is exactly: `user123` or `admin123`
  - Ensure users were seeded (run `npm run db:seed-users`)

- **Error: "Login failed"**
  - Check database connection
  - Check server logs for errors
  - Verify sessions table exists

### Image Issues
- **Images not displaying**
  - Check browser console for 404 errors
  - Verify API returns `featured_image` field
  - Check image URLs are valid
  - Verify property transformation includes image field

- **Broken images**
  - Check Unsplash URLs are accessible
  - Verify fallback images work
  - Check network tab for failed requests

---

## Security Notes

### Password Security
- Passwords hashed using bcrypt with 10 salt rounds
- Password hashes never returned in API responses
- Sessions stored securely with httpOnly cookies
- Session expiration: 30 days

### Session Security
- Session IDs generated with crypto.randomBytes(32)
- Sessions stored in database with expiration
- Expired sessions automatically deleted
- Secure cookies in production environment

### API Security
- Email validation on all auth endpoints
- Password strength validation on registration
- Rate limiting recommended for production
- HTTPS required for production deployment
