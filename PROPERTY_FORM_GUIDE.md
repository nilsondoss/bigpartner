# Property Listing Form - Complete Guide

## Overview

A comprehensive property listing form has been created in the admin dashboard at `/admin/add-property`. This form allows administrators to add new properties with all necessary details, specifications, amenities, and media.

## Features

### ✅ Complete Form Sections

1. **Basic Information**
   - Property Title (required)
   - City & State (required)
   - Price (₹) (required)
   - Area (sq.ft) (required)
   - Price per sq.ft (auto-calculated)
   - Property Type (dropdown)
   - Facing

2. **Description**
   - Full property description (textarea)

3. **Key Highlights** (Accordion)
   - Bullet point list
   - One highlight per line

4. **Specifications** (Accordion)
   - Plot Area
   - Boundary Wall
   - Road Width
   - Zoning
   - Floor Space Index (FSI)
   - Ownership (Freehold/Leasehold/Cooperative)
   - Possession

5. **Amenities** (Accordion)
   - Bullet point list
   - One amenity per line

6. **Location & Nearby Facilities** (Accordion)
   - Nearby landmarks
   - Distance information
   - One facility per line

7. **Available Documents** (Accordion)
   - Checkbox list:
     - Title Deed
     - Property Tax Receipt
     - Survey Plan
     - Approved Building Plan
     - Encumbrance Certificate
     - Patta / Chitta
     - Other Documents

8. **Property Images** (Accordion)
   - Multiple file upload
   - Drag & drop support
   - Live image preview
   - Remove image option

9. **Contact Information**
   - Contact Name
   - Contact Email
   - Contact Phone

## Auto-Calculation Features

### Price per sq.ft

The form automatically calculates the price per square foot when you enter:
- Price (₹)
- Area (sq.ft)

**Formula:** `Price per sq.ft = Price / Area`

**Example:**
- Price: ₹5,000,000
- Area: 1,500 sq.ft
- **Auto-calculated:** ₹3,333.33 per sq.ft

## Form Validation

### Required Fields

The following fields are mandatory:
- ✅ Property Title
- ✅ City
- ✅ Price
- ✅ Area

The form will not submit without these fields.

### Optional Fields

All other fields are optional but recommended for better property listings.

## Property Types Available

- Penthouse
- Apartment
- Villa
- Plot
- Farmland
- Commercial
- Industrial
- Rental
- Residential

## Ownership Types

- Freehold
- Leasehold
- Cooperative

## Image Upload

### Supported Formats
- JPG
- PNG
- WebP

### Features
- Multiple image upload
- Live preview before submission
- Remove unwanted images
- Drag & drop support

### Image Preview
- Grid layout (2 columns on mobile, 4 on desktop)
- Hover to reveal delete button
- Thumbnail preview (128px height)

## Accordion Sections

The form uses accordion sections to keep it organized and tidy:

### Benefits
- ✅ Reduces visual clutter
- ✅ Focuses attention on one section at a time
- ✅ Allows multiple sections to be open simultaneously
- ✅ Improves form completion rates

### Sections in Accordion
1. Key Highlights
2. Specifications
3. Amenities
4. Location & Nearby Facilities
5. Available Documents
6. Property Images

## Form Submission

### Process

1. **Validation**
   - Checks required fields
   - Shows error toast if validation fails

2. **Data Preparation**
   - Converts text to appropriate data types
   - Splits multi-line inputs into arrays
   - Structures data for API

3. **API Call**
   - POST request to `/api/properties`
   - Sends JSON payload
   - Handles success/error responses

4. **Success**
   - Shows success toast
   - Redirects to property detail page
   - Property is immediately visible in listings

5. **Error Handling**
   - Shows error toast
   - Keeps form data intact
   - Allows user to retry

## Data Structure

### Property Data Format

```json
{
  "title": "Luxury 3BHK Apartment in Anna Nagar",
  "location": "Chennai, Tamil Nadu",
  "price": 5000000,
  "area": 1500,
  "pricePerSqft": 3333.33,
  "type": "apartment",
  "facing": "North",
  "description": "Beautiful apartment with modern amenities...",
  "highlights": [
    "Prime location with excellent connectivity",
    "Modern amenities and facilities",
    "Spacious rooms with natural lighting"
  ],
  "specifications": {
    "plotArea": "2000 sq.ft",
    "facing": "North",
    "boundaryWall": "Yes",
    "roadWidth": "30 feet",
    "zoning": "Residential",
    "fsi": "1.5",
    "ownership": "freehold",
    "possession": "Immediate"
  },
  "amenities": [
    "Swimming Pool",
    "Gym",
    "Clubhouse",
    "24/7 Security"
  ],
  "nearbyFacilities": [
    "School – 500m",
    "Shopping Mall – 1km",
    "Hospital – 700m"
  ],
  "documents": [
    "Title Deed",
    "Property Tax Receipt",
    "Approved Building Plan"
  ],
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210"
  },
  "images": ["base64_image_data..."]
}
```

## Access Control

### Protected Route

The form is protected by authentication:
- ✅ Only logged-in users can access
- ✅ Redirects to login if not authenticated
- ✅ Wrapped in `<ProtectedRoute>` component

### Admin Dashboard

The form is part of the admin dashboard:
- ✅ Consistent navigation
- ✅ Sidebar with admin links
- ✅ Professional layout

## Navigation

### Access Points

1. **From Admin Properties Page**
   - Click "Add Property" button
   - Located at top-right of page

2. **Direct URL**
   - `/admin/add-property`

3. **From Dashboard Sidebar**
   - Navigate to Properties section
   - Click "Add Property"

## UI Components Used

### shadcn UI Components

- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Textarea
- ✅ Select
- ✅ Checkbox
- ✅ Accordion
- ✅ Card
- ✅ Toast (Sonner)

### Icons (Lucide React)

- Building2 - Basic Information
- FileText - Description & Documents
- CheckCircle - Highlights & Amenities
- MapPin - Location
- Image - Media Upload
- DollarSign - Contact

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Full-width inputs
- Stacked form sections
- 2-column image grid

### Tablet (768px - 1024px)
- 2-column grid for inputs
- Wider form sections
- 3-column image grid

### Desktop (> 1024px)
- 3-column grid for price/area
- Maximum width: 5xl (1280px)
- 4-column image grid
- Optimal spacing

## Best Practices

### Form Completion

1. **Start with required fields**
   - Title, City, Price, Area

2. **Add description**
   - Detailed property information

3. **Fill specifications**
   - Important for buyers

4. **Add amenities**
   - Increases property value

5. **Upload images**
   - Essential for listings

6. **Add contact information**
   - For inquiries

### Data Entry Tips

1. **Use bullet points**
   - One item per line
   - Start with bullet (•) or dash (-)

2. **Be specific**
   - Exact measurements
   - Clear descriptions

3. **Include distances**
   - "School – 500m" format
   - Use consistent units

4. **Check documents**
   - Select all available documents
   - Increases buyer confidence

## Integration

### API Endpoint

**Endpoint:** `POST /api/properties`

**Request Body:** JSON (see Data Structure above)

**Response:**
```json
{
  "id": 46,
  "title": "Property Title",
  "slug": "property-title",
  "message": "Property added successfully"
}
```

### Database Schema

The form data maps to the `properties` table:

```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'available',
  price DECIMAL(15,2),
  location VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  area DECIMAL(10,2),
  -- ... other fields
);
```

## Future Enhancements

### Planned Features

1. **Image Upload to Storage**
   - Currently stores base64
   - Plan: Upload to cloud storage
   - Return image URLs

2. **Rich Text Editor**
   - For property description
   - Formatting options
   - Better content creation

3. **Map Integration**
   - Google Maps embed
   - Location picker
   - Nearby facilities visualization

4. **Draft Saving**
   - Save incomplete forms
   - Resume later
   - Auto-save feature

5. **Bulk Upload**
   - CSV import
   - Multiple properties at once
   - Template download

6. **Property Templates**
   - Pre-filled forms for common types
   - Quick property creation
   - Consistent data entry

## Troubleshooting

### Common Issues

#### Form Not Submitting

**Symptoms:**
- Click submit, nothing happens
- No error message

**Solutions:**
1. Check required fields (red asterisk)
2. Open browser console for errors
3. Verify API endpoint is running
4. Check network tab for failed requests

#### Images Not Uploading

**Symptoms:**
- Images don't appear in preview
- Upload fails silently

**Solutions:**
1. Check file format (JPG, PNG, WebP only)
2. Verify file size (< 5MB recommended)
3. Check browser console for errors
4. Try different images

#### Auto-calculation Not Working

**Symptoms:**
- Price per sq.ft not calculated
- Shows as empty or 0

**Solutions:**
1. Enter valid numbers for Price and Area
2. Ensure Area is not 0
3. Check for decimal points
4. Refresh page and try again

#### Accordion Not Opening

**Symptoms:**
- Click accordion, doesn't expand
- Sections remain closed

**Solutions:**
1. Refresh the page
2. Check browser console for errors
3. Try different browser
4. Clear browser cache

## Files Created

### 1. Form Component
**File:** `src/pages/admin/add-property.tsx` (670 lines)

**Features:**
- Complete form implementation
- State management
- Validation logic
- API integration
- Image preview
- Auto-calculation

### 2. Route Configuration
**File:** `src/routes.tsx` (updated)

**Changes:**
- Added lazy-loaded route
- Protected with authentication
- Integrated with admin dashboard

### 3. Navigation Update
**File:** `src/pages/admin/properties.tsx` (updated)

**Changes:**
- "Add Property" button now navigates to form
- Removed dialog-based form
- Cleaner UI

## Summary

### What Was Created

✅ **Complete property listing form** with 9 sections  
✅ **Auto-calculation** for price per sq.ft  
✅ **Image upload** with live preview  
✅ **Accordion sections** for better UX  
✅ **Form validation** with required fields  
✅ **API integration** for data submission  
✅ **Protected route** with authentication  
✅ **Responsive design** for all devices  
✅ **Professional UI** with shadcn components  

### Total Lines of Code

- Form Component: 670 lines
- Route Updates: 9 lines
- Navigation Updates: 5 lines
- **Total: 684 lines**

### Components Used

- 10 shadcn UI components
- 6 Lucide React icons
- React hooks (useState)
- React Router (useNavigate)

---

## Quick Start

1. **Login to admin dashboard**
2. **Navigate to Properties**
3. **Click "Add Property" button**
4. **Fill in required fields** (Title, City, Price, Area)
5. **Add optional details** (Description, Amenities, etc.)
6. **Upload images**
7. **Click "Add Property"**
8. **Property is live!**

---

**The property listing form is now complete and ready to use!** 🎉

Access it at: `/admin/add-property`
