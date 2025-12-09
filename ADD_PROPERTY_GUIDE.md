# Add Layout Property Guide

## Property Details

**Title:** Land for Layout – 15 km from Chennai

**Property Type:** Farmland  
**Area:** 10 acres (435,600 sq.ft)  
**Location:** Within 15 km radius from Chennai, Tamil Nadu  
**Price:** To be discussed with Channel Partners (Negotiable)

---

## How to Add the Property

### Method 1: Using the Web Interface (Easiest)

1. **Open your browser** and go to:
   ```
   https://lmnesop1a2.preview.c24.airoapp.ai/add-property.html
   ```

2. **Click the "Add Property" button**

3. **Wait for confirmation** - You'll see:
   - ✅ Property Added Successfully!
   - Property ID
   - Property details

4. **View the property** - Click "View All Properties" or go to:
   ```
   https://lmnesop1a2.preview.c24.airoapp.ai/properties
   ```

---

### Method 2: Using API Endpoint

**Endpoint:** `POST /api/properties/add-layout`

**Example using curl:**
```bash
curl -X POST https://lmnesop1a2.preview.c24.airoapp.ai/api/properties/add-layout \
  -H "Content-Type: application/json"
```

**Example using JavaScript:**
```javascript
fetch('/api/properties/add-layout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## Property Information

### Key Highlights
- Requirement: 10 acres of Punjai or dry land
- Purpose: Layout development
- Location: Within 15 km radius of Chennai
- Flexible land facing
- Price: Negotiable with the seller
- Immediate requirement for serious sellers

### Specifications
- Plot Area: 10 acres (approx. 435,600 sq.ft)
- Facing: Any
- Boundary Wall: Optional
- Road Width: Negotiable
- Zoning: Suitable for layout development
- Floor Space Index (FSI): As per local regulations
- Ownership: Clear and marketable title required
- Possession: Immediate / As per agreement

### Amenities
- Easy accessibility from main roads and Chennai city
- Close to public utilities (water, electricity)
- Suitable for residential layout development
- Ample open space for planning roads and plots
- Clear legal title
- Surrounded by developing residential/commercial areas

### Location & Nearby Facilities
- Located within a 15 km radius from Chennai
- Well-connected via main roads and highways
- Proximity to schools, hospitals, and markets
- Nearby public transport facilities
- Close to upcoming residential and commercial developments
- Surrounded by essential amenities

### Available Documents
- Title Deed
- Property Tax Receipt
- Survey Plan
- Approved Building Plan
- Encumbrance Certificate
- Patta / Chitta (if applicable)
- Any other relevant documents as per seller

---

## Files Created

### 1. API Endpoint
**File:** `src/server/api/properties/add-layout/POST.ts`
- Handles property creation
- Returns property ID and details
- Error handling included

### 2. Web Interface
**File:** `public/add-property.html`
- Simple one-click interface
- Shows success/error messages
- Links to property listing

### 3. Database Script
**File:** `src/server/db/add-layout-property.ts`
- Can be run via `npm run db:add-layout`
- Alternative method for adding property

---

## After Adding the Property

Once the property is added, it will:

1. **Appear in property listings** at `/properties`
2. **Be searchable** by:
   - Property type: Farmland
   - Location: Chennai
   - Area: 10 acres
3. **Be featured** on the homepage
4. **Be verified** and marked as available
5. **Have SEO optimization** with meta tags and keywords

---

## Verification

To verify the property was added:

1. **Check the properties page:**
   ```
   https://lmnesop1a2.preview.c24.airoapp.ai/properties
   ```

2. **Filter by:**
   - Property Type: Farmland
   - City: Chennai

3. **Look for:**
   - Title: "Land for Layout – 15 km from Chennai"
   - Area: 435,600 sq.ft (10 acres)
   - Status: Available

---

## Troubleshooting

### If the property doesn't appear:

1. **Refresh the properties page** (Ctrl+F5 or Cmd+Shift+R)
2. **Clear filters** on the properties page
3. **Check the API response** for errors
4. **View server logs** for any error messages

### If you get an error:

1. **Check the error message** in the response
2. **Verify database connection** is working
3. **Check server logs** at `/logs`
4. **Try again** after a few seconds

---

## Summary

✅ **API Endpoint Created:** `/api/properties/add-layout`  
✅ **Web Interface Created:** `/add-property.html`  
✅ **Database Script Ready:** `npm run db:add-layout`  
✅ **Property Details Complete:** All fields populated  
✅ **SEO Optimized:** Meta tags and keywords included  
✅ **Featured & Verified:** Property will be prominently displayed

---

## Next Steps

1. **Add the property** using the web interface
2. **Verify it appears** in the property listings
3. **Test the search** functionality
4. **Share the property link** with potential buyers

---

**Ready to add the property? Go to:**
```
https://lmnesop1a2.preview.c24.airoapp.ai/add-property.html
```

**Click the button and your property will be live in seconds!** 🚀
