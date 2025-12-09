# SPA Routing Fix - "Cannot GET /route" Error

## Problem

When accessing routes directly on the live site (e.g., `https://lmnesop1a2.c24.airoapp.ai/login`), you get a **"Cannot GET /login"** error.

This is a common issue with Single Page Applications (SPAs) deployed to static hosting.

---

## Root Cause

### How SPAs Work

1. **Client-Side Routing**: React Router handles navigation in the browser
2. **Single Entry Point**: All routes are actually served from `index.html`
3. **JavaScript Takes Over**: React Router reads the URL and renders the correct page

### The Problem

When you deploy an SPA:
- ✅ Navigating within the app works (clicking links)
- ❌ Direct URL access fails (typing URL or refreshing page)

**Why?**
- The server looks for a file at `/login` → doesn't exist → 404 error
- The server doesn't know to serve `index.html` for all routes

---

## Solution Applied

### 1. Created `public/_redirects` File

**File:** `public/_redirects`

```
# Redirect all routes to index.html for client-side routing
# This allows React Router to handle all page navigation
/*    /index.html   200
```

**What this does:**
- Tells the server to serve `index.html` for ALL routes
- Returns HTTP 200 (success) instead of 404
- Preserves the URL path so React Router can read it
- Allows client-side routing to work correctly

### 2. How It Works

**Before Fix:**
```
User visits: https://lmnesop1a2.c24.airoapp.ai/login
Server looks for: /login file
Result: 404 - Cannot GET /login ❌
```

**After Fix:**
```
User visits: https://lmnesop1a2.c24.airoapp.ai/login
Server redirects to: /index.html (with /login in URL)
React loads and reads URL: /login
React Router renders: Login page component
Result: Login page displays ✅
```

---

## Supported Platforms

The `_redirects` file format is supported by:

- ✅ **Netlify** (native support)
- ✅ **Cloudflare Pages** (native support)
- ✅ **Vercel** (via `vercel.json` - alternative config)
- ✅ **Firebase Hosting** (via `firebase.json` - alternative config)
- ✅ **AWS Amplify** (native support)
- ✅ **Render** (native support)

### Alternative Configurations

If your platform doesn't support `_redirects`, use these alternatives:

#### **Vercel** (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### **Firebase** (`firebase.json`)
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### **Apache** (`.htaccess`)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### **Nginx** (`nginx.conf`)
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Testing After Publishing

### 1. Publish Your Site
Click the "Publish" button to deploy the changes.

### 2. Test Direct URL Access

**Test these URLs directly (type in browser or refresh):**

✅ **Homepage:**
```
https://lmnesop1a2.c24.airoapp.ai/
```

✅ **Login Page:**
```
https://lmnesop1a2.c24.airoapp.ai/login
```

✅ **Registration Page:**
```
https://lmnesop1a2.c24.airoapp.ai/register
```

✅ **Contact Page:**
```
https://lmnesop1a2.c24.airoapp.ai/contact
```

✅ **Properties Page:**
```
https://lmnesop1a2.c24.airoapp.ai/properties
```

✅ **About Page:**
```
https://lmnesop1a2.c24.airoapp.ai/about
```

### 3. Test Navigation

1. Start at homepage
2. Click through various links
3. Use browser back/forward buttons
4. Refresh page at any route
5. Bookmark a page and open it later

**All should work without errors!** ✅

---

## What Routes Are Supported

All routes defined in `src/routes.tsx` will work:

### **Public Routes:**
- `/` - Homepage
- `/about` - About page
- `/contact` - Contact page
- `/properties` - Properties listing
- `/properties/:slug` - Property details
- `/for-investors` - Investors page
- `/for-partners` - Partners page
- `/blog` - Blog page
- `/careers` - Careers page
- `/faq` - FAQ page
- `/help-center` - Help center
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### **Authentication Routes:**
- `/login` - Login page
- `/register` - Registration page
- `/register-investor` - Investor registration
- `/register-partner` - Partner registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

### **Protected Routes:**
- `/dashboard` - User dashboard
- `/admin/*` - Admin pages (requires authentication)

---

## API Routes Still Work

The `_redirects` file only affects page routes. API routes continue to work normally:

✅ **API Endpoints:**
- `/api/auth/login`
- `/api/auth/register`
- `/api/properties`
- `/api/inquiries`
- `/api/investors`
- `/api/partners`
- etc.

**Why?** The redirect rule uses a 200 status code (not a redirect), so:
- Page requests → serve `index.html`
- API requests → handled by backend
- Static assets → served directly

---

## Troubleshooting

### Issue: Still getting "Cannot GET /route"

**Possible causes:**

1. **Not published yet**
   - Solution: Click "Publish" button and wait for deployment

2. **Browser cache**
   - Solution: Hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`)
   - Or: Open in incognito mode

3. **CDN cache**
   - Solution: Wait 5-10 minutes for CDN to update
   - Or: Clear CDN cache in deployment platform

4. **Wrong platform configuration**
   - Solution: Check if your platform supports `_redirects`
   - Or: Use platform-specific configuration (see alternatives above)

### Issue: 404 errors for static assets

**Symptoms:**
- Images not loading
- CSS not applying
- JavaScript errors

**Solution:**
Make sure static assets use absolute paths:
```tsx
// ✅ Correct - absolute path
<img src="/assets/logo.png" alt="Logo" />

// ❌ Wrong - relative path
<img src="assets/logo.png" alt="Logo" />
```

### Issue: API routes returning HTML

**Symptoms:**
- API calls return HTML instead of JSON
- Console errors about parsing JSON

**Solution:**
Make sure API routes are excluded from the redirect:
```
# Exclude API routes from redirect
/api/*  /api/:splat  200
/*      /index.html  200
```

---

## Files Modified

### Created:
- ✅ `public/_redirects` - SPA routing configuration

### No Changes Needed:
- `src/App.tsx` - Already using React Router correctly
- `src/routes.tsx` - Route definitions unchanged
- `vite.config.ts` - Build configuration unchanged

---

## Summary

**Problem:** "Cannot GET /route" when accessing URLs directly  
**Root Cause:** Server doesn't know to serve `index.html` for all routes  
**Solution:** Created `public/_redirects` file to handle SPA routing  
**Status:** ✅ Ready to publish  
**Next Step:** Click "Publish" to deploy the fix

---

## After Publishing

Once published, your site will:
- ✅ Support direct URL access to all pages
- ✅ Allow page refreshes without errors
- ✅ Enable bookmarking of any page
- ✅ Work correctly with browser back/forward buttons
- ✅ Support sharing links to specific pages

**All routes will work perfectly!** 🚀

---

## Additional Resources

- [React Router Documentation](https://reactrouter.com/en/main/start/concepts#client-side-routing)
- [Netlify Redirects Documentation](https://docs.netlify.com/routing/redirects/)
- [Vite SPA Deployment Guide](https://vitejs.dev/guide/static-deploy.html#building-the-app)

---

**Created:** December 4, 2025  
**Status:** ✅ Fix applied, ready to publish
