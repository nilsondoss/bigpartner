# Registration Troubleshooting Guide

## Current Status

**Issue:** User cannot sign up at https://bigpartner.in/register

**Last Updated:** December 3, 2025

---

## Debugging Steps Taken

### 1. ✅ Password Validation Fixed
- Simplified password requirements to 8+ characters
- Removed uppercase/lowercase/number requirements
- Updated error messages

### 2. ✅ Database Connection Verified
- Tables exist: users, sessions, properties, investors
- Database is accessible
- No connection errors

### 3. ✅ API Endpoint Exists
- `/api/auth/register` POST endpoint is configured
- Handler function is properly exported
- Error handling is in place

### 4. ✅ Frontend Form Working
- Form validation is correct
- Sends proper JSON payload
- Includes reCAPTCHA token

### 5. ✅ Logging Added
- Added console.log for registration attempts
- Added error logging for failures
- Server restarted with new logs

---

## Next Steps

### For User:
1. Go to https://bigpartner.in/register
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm: password123
3. Click "Create Account"
4. Report the exact error message you see

### For Developer:
1. Check server logs after registration attempt
2. Look for "📝 Registration attempt:" log
3. Look for any error messages
4. Identify the exact failure point

---

## Possible Issues to Check

### 1. reCAPTCHA Configuration
**Symptom:** Form submits but gets rejected
**Check:**
- Is VITE_RECAPTCHA_SITE_KEY set in .env?
- Is reCAPTCHA v3 configured correctly?
- Is the domain whitelisted in Google reCAPTCHA console?

**Solution:**
```env
VITE_RECAPTCHA_SITE_KEY=your-site-key-here
```

### 2. Database Connection
**Symptom:** 500 error with "database connection failed"
**Check:**
- Is DATABASE_URL set correctly?
- Can the server connect to MySQL?
- Are credentials correct?

**Test:**
```bash
npx tsx src/server/db/check-tables.ts
```

### 3. Email Validation
**Symptom:** "Invalid email" error
**Check:**
- Is email format correct?
- Does email already exist in database?

**Test:**
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

### 4. Session Creation
**Symptom:** User created but not logged in
**Check:**
- Is cookie-parser middleware configured?
- Are cookies being set correctly?
- Is session table accessible?

**Test:**
```bash
npx tsx -e "import { db } from './src/server/db/client.js'; import { sessions } from './src/server/db/schema.js'; db.select().from(sessions).then(console.log);"
```

### 5. CORS Issues
**Symptom:** Network error or blocked request
**Check:**
- Is the API route accessible?
- Are CORS headers set correctly?
- Is the request being blocked by browser?

**Test:**
```bash
curl -X POST https://bigpartner.in/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","password":"password123"}'
```

---

## Common Error Messages

### "Missing required fields"
**Cause:** Frontend not sending fullName, email, or password
**Fix:** Check form data is being sent correctly

### "Invalid email format"
**Cause:** Email doesn't match regex pattern
**Fix:** Use proper email format (user@domain.com)

### "Email already registered"
**Cause:** User with this email already exists
**Fix:** Use different email or implement "forgot password"

### "Password must be at least 8 characters"
**Cause:** Password too short
**Fix:** Use 8+ character password

### "Registration failed"
**Cause:** Generic error (database, session, etc.)
**Fix:** Check server logs for specific error

---

## Testing Checklist

- [ ] Server is running (check logs)
- [ ] Database is accessible (check tables)
- [ ] API endpoint responds (test with curl)
- [ ] Form validation works (try invalid data)
- [ ] reCAPTCHA loads (check browser console)
- [ ] Cookies are enabled (check browser settings)
- [ ] No CORS errors (check network tab)
- [ ] Error messages are clear (test various scenarios)

---

## Quick Test Commands

### Check if server is running:
```bash
curl https://bigpartner.in/api/health
```

### Check database connection:
```bash
npx tsx src/server/db/check-tables.ts
```

### Test registration API directly:
```bash
curl -X POST https://bigpartner.in/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Check if email exists:
```bash
npx tsx -e "
import { db } from './src/server/db/client.js';
import { users } from './src/server/db/schema.js';
import { eq } from 'drizzle-orm';
const user = await db.select().from(users).where(eq(users.email, 'test@example.com'));
console.log(user);
"
```

---

## Environment Variables Required

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/database

# reCAPTCHA (optional but recommended)
VITE_RECAPTCHA_SITE_KEY=your-site-key-here

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Session (optional)
SESSION_SECRET=random-secret-key
```

---

## Contact Information

If issue persists after checking all above:
1. Provide exact error message from browser
2. Check browser console for errors (F12)
3. Check network tab for failed requests
4. Provide server logs after registration attempt

---

## Status Updates

### December 3, 2025 - 10:12 AM
- ✅ Password validation simplified
- ✅ Database verified
- ✅ Logging added
- ⏳ Waiting for user to test registration
- ⏳ Will check logs after test attempt

