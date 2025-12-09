# Login System Debugging Guide

## Current Status

The login system is **fully configured** but may not be responding. This guide will help you debug and fix the issue.

---

## System Architecture

### Frontend Login Flow
```
Login Page (src/pages/login.tsx)
  ↓ Form Submit
  ↓ fetch('/api/auth/login', { email, password })
  ↓
Backend API (src/server/api/auth/login/POST.ts)
  ↓ Verify credentials
  ↓ Create session
  ↓ Set cookie
  ↓ Return user data
  ↓
Redirect to /dashboard
```

### Authentication Components
1. **Login Page**: `src/pages/login.tsx` - Standalone form (NOT using AuthContext)
2. **Login API**: `src/server/api/auth/login/POST.ts` - Backend endpoint
3. **Auth Library**: `src/server/lib/auth.ts` - Password verification, session management
4. **Database**: Users table with bcrypt hashed passwords

---

## Test Credentials

**Regular User:**
- Email: `user@bigpartner.com`
- Password: `user123`
- Role: user

**Admin User:**
- Email: `admin@bigpartner.com`
- Password: `admin123`
- Role: admin

---

## Debugging Steps

### Step 1: Verify API is Responding

**Test the health endpoint:**
```
https://lmnesop1a2.preview.c24.airoapp.ai/api/test
```

Expected response:
```json
{
  "message": "API is working!",
  "timestamp": "2025-11-28T..."
}
```

If this fails, the server is not responding to API requests.

### Step 2: Test Login API Directly

**Using curl:**
```bash
curl -X POST https://lmnesop1a2.preview.c24.airoapp.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@bigpartner.com","password":"user123"}' \
  -v
```

**Using browser console:**
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@bigpartner.com',
    password: 'user123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected success response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@bigpartner.com",
    "fullName": "Test User",
    "role": "user"
  },
  "sessionId": "..."
}
```

**Expected error responses:**
```json
// Invalid credentials
{
  "error": "Invalid email or password"
}

// Missing fields
{
  "error": "Email and password are required"
}

// Invalid email format
{
  "error": "Invalid email format"
}
```

### Step 3: Check Browser Console

Open browser DevTools (F12) and check:

1. **Console tab** - Look for JavaScript errors
2. **Network tab** - Look for the POST request to `/api/auth/login`
   - Status code (should be 200 for success, 401 for invalid credentials)
   - Response body
   - Request payload

### Step 4: Check Server Logs

Look for login attempts in server logs:
- Login errors: `Login error:`
- Database errors: `DrizzleQueryError`
- Session creation errors

### Step 5: Verify Database Users

**Check if users exist:**
```bash
npm run db:seed-users
```

Expected output:
- If users exist: `Duplicate entry 'user@bigpartner.com'` (this is good!)
- If users don't exist: `✅ Users seeded successfully`

---

## Common Issues & Solutions

### Issue 1: Form Not Submitting

**Symptoms:**
- No network request in DevTools
- No error message displayed
- Button click does nothing

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify form `onSubmit` handler is attached
3. Check if `e.preventDefault()` is called
4. Verify button `type="submit"` is set

### Issue 2: API Not Responding

**Symptoms:**
- Network request times out
- 404 Not Found error
- CORS errors

**Solutions:**
1. Verify server is running: Check logs for "VITE v6.4.1 ready"
2. Check API route exists: `src/server/api/auth/login/POST.ts`
3. Restart server if needed
4. Verify URL is correct (no typos)

### Issue 3: Invalid Credentials

**Symptoms:**
- 401 Unauthorized response
- Error message: "Invalid email or password"

**Solutions:**
1. Verify you're using exact credentials:
   - Email: `user@bigpartner.com` (lowercase, no spaces)
   - Password: `user123` (no spaces)
2. Check if users are seeded: `npm run db:seed-users`
3. Verify password hashing is working (bcrypt with 10 salt rounds)

### Issue 4: Session Not Created

**Symptoms:**
- Login succeeds but redirect fails
- No cookie set in browser
- Dashboard shows "not authenticated"

**Solutions:**
1. Check if `sessionId` cookie is set (DevTools → Application → Cookies)
2. Verify session table exists in database
3. Check session creation in auth.ts
4. Verify cookie settings (httpOnly, sameSite, secure)

### Issue 5: Redirect Not Working

**Symptoms:**
- Login succeeds but stays on login page
- No navigation to dashboard

**Solutions:**
1. Check if `navigate('/dashboard')` is called
2. Verify React Router is configured correctly
3. Check if dashboard route exists in routes.tsx
4. Look for JavaScript errors preventing navigation

---

## Manual Testing Checklist

### ✅ Pre-Test Setup
- [ ] Server is running (check logs)
- [ ] Users are seeded (run `npm run db:seed-users`)
- [ ] Browser DevTools is open (F12)
- [ ] Network tab is recording

### ✅ Test Valid Login
1. [ ] Navigate to: https://lmnesop1a2.preview.c24.airoapp.ai/login
2. [ ] Enter email: `user@bigpartner.com`
3. [ ] Enter password: `user123`
4. [ ] Click "Sign In" button
5. [ ] Expected: Redirect to /dashboard
6. [ ] Verify: sessionId cookie is set
7. [ ] Verify: User data is displayed on dashboard

### ✅ Test Invalid Login
1. [ ] Navigate to login page
2. [ ] Enter email: `wrong@example.com`
3. [ ] Enter password: `wrongpass`
4. [ ] Click "Sign In"
5. [ ] Expected: Error message displayed
6. [ ] Expected: Stay on login page
7. [ ] Verify: No cookie set

### ✅ Test Empty Fields
1. [ ] Navigate to login page
2. [ ] Leave fields empty
3. [ ] Click "Sign In"
4. [ ] Expected: Browser validation error (required fields)

### ✅ Test Invalid Email Format
1. [ ] Navigate to login page
2. [ ] Enter email: `notanemail`
3. [ ] Enter password: `user123`
4. [ ] Click "Sign In"
5. [ ] Expected: Browser validation error (invalid email)

### ✅ Test Admin Login
1. [ ] Navigate to login page
2. [ ] Enter email: `admin@bigpartner.com`
3. [ ] Enter password: `admin123`
4. [ ] Click "Sign In"
5. [ ] Expected: Redirect to /dashboard
6. [ ] Expected: Admin menu items visible
7. [ ] Navigate to: https://lmnesop1a2.preview.c24.airoapp.ai/admin/properties
8. [ ] Expected: Admin panel loads

---

## Technical Details

### Password Hashing
- Algorithm: bcrypt
- Salt rounds: 10
- Passwords are NEVER stored in plain text

### Session Management
- Session ID: UUID v4
- Storage: Database (sessions table)
- Cookie name: `sessionId`
- Cookie settings:
  - httpOnly: true (prevents JavaScript access)
  - secure: true in production (HTTPS only)
  - sameSite: 'lax' (CSRF protection)
  - maxAge: 30 days

### Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Sessions Table:**
```sql
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## API Endpoints

### POST /api/auth/login
**Request:**
```json
{
  "email": "user@bigpartner.com",
  "password": "user123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@bigpartner.com",
    "fullName": "Test User",
    "role": "user"
  },
  "sessionId": "uuid-here"
}
```

**Error Responses:**
- 400: Missing fields or invalid email format
- 401: Invalid credentials
- 500: Server error

### GET /api/auth/session
**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@bigpartner.com",
    "fullName": "Test User",
    "role": "user"
  }
}
```

### POST /api/auth/logout
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Quick Fixes

### If Login Button Does Nothing

**Add console.log to debug:**
```typescript
// In src/pages/login.tsx, add to handleSubmit:
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  console.log('Form submitted!', { email, password });
  setError('');
  setLoading(true);
  
  try {
    console.log('Calling API...');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    // ... rest of code
  } catch (err) {
    console.error('Login error:', err);
    // ... rest of code
  }
};
```

### If API Returns 500 Error

**Check server logs for:**
- Database connection errors
- bcrypt errors
- Session creation errors

**Common fixes:**
- Restart server
- Verify database is running
- Check environment variables

### If Redirect Fails

**Check React Router setup:**
```typescript
// In src/App.tsx or routes.tsx
// Verify dashboard route exists:
{
  path: '/dashboard',
  element: <DashboardPage />
}
```

---

## Support Information

### Files to Check
1. `src/pages/login.tsx` - Login form
2. `src/server/api/auth/login/POST.ts` - Login API
3. `src/server/lib/auth.ts` - Auth functions
4. `src/server/db/schema.ts` - Database schema
5. `src/server/db/seed-users.ts` - User seeding

### Logs to Monitor
- Browser console (F12)
- Network tab (F12 → Network)
- Server logs (check for errors)

### Test URLs
- Login: https://lmnesop1a2.preview.c24.airoapp.ai/login
- Dashboard: https://lmnesop1a2.preview.c24.airoapp.ai/dashboard
- API Test: https://lmnesop1a2.preview.c24.airoapp.ai/api/test
- Session Check: https://lmnesop1a2.preview.c24.airoapp.ai/api/auth/session

---

## Next Steps

1. **Test API health endpoint** to verify server is responding
2. **Test login API directly** using browser console or curl
3. **Check browser console** for JavaScript errors
4. **Monitor network tab** during login attempt
5. **Check server logs** for backend errors
6. **Report findings** with specific error messages

---

## Success Criteria

Login is working when:
- ✅ Form submits without errors
- ✅ API returns 200 status code
- ✅ sessionId cookie is set
- ✅ User is redirected to /dashboard
- ✅ Dashboard shows user information
- ✅ Admin can access /admin/* pages

---

**Last Updated:** 2025-11-28
**Status:** System configured, awaiting user testing
