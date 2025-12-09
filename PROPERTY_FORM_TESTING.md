# Property Form Testing Guide

## 🧪 Testing the Property Listing Form

This guide will walk you through testing the new property listing form to ensure all features work correctly.

---

## 📍 Access the Form

### **Method 1: Via Admin Dashboard**
1. Navigate to: `https://lmnesop1a2.preview.c24.airoapp.ai/login`
2. Login with admin credentials
3. Go to **Properties** page
4. Click **"Add Property"** button (top-right)

### **Method 2: Direct URL**
Navigate to: `https://lmnesop1a2.preview.c24.airoapp.ai/admin/add-property`

---

## ✅ Test Checklist

### **1. Basic Information Section**

#### Test: Required Fields
- [ ] Leave "Property Title" empty → Submit → Should show error
- [ ] Leave "City" empty → Submit → Should show error
- [ ] Leave "Price" empty → Submit → Should show error
- [ ] Leave "Area" empty → Submit → Should show error

#### Test: Auto-Calculation
- [ ] Enter Price: `5000000`
- [ ] Enter Area: `1500`
- [ ] **Expected:** Price per sq.ft shows `₹3,333.33`
- [ ] Change Price to `6000000`
- [ ] **Expected:** Price per sq.ft updates to `₹4,000.00`

#### Test: Property Type Dropdown
- [ ] Click "Property Type" dropdown
- [ ] **Expected:** See 9 options (Penthouse, Apartment, Villa, etc.)
- [ ] Select "Apartment"
- [ ] **Expected:** "Apartment" appears in field

#### Test: Facing Dropdown
- [ ] Click "Facing" dropdown
- [ ] **Expected:** See 8 options (North, South, East, West, etc.)
- [ ] Select "North"
- [ ] **Expected:** "North" appears in field

---

### **2. Description Section**

#### Test: Textarea Input
- [ ] Click in Description textarea
- [ ] Type a multi-line description
- [ ] **Expected:** Text wraps properly
- [ ] **Expected:** Scrollbar appears if text exceeds 4 rows

---

### **3. Key Highlights Section**

#### Test: Accordion Expand/Collapse
- [ ] Click "Key Highlights" header
- [ ] **Expected:** Section expands
- [ ] Click header again
- [ ] **Expected:** Section collapses

#### Test: Bullet Point Input
- [ ] Enter highlights (one per line):
  ```
  Prime location
  Near metro station
  Gated community
  ```
- [ ] **Expected:** Each line preserved
- [ ] **Expected:** Scrollbar if many lines

---

### **4. Specifications Section**

#### Test: All Fields
- [ ] Enter Plot Area: `1500`
- [ ] Select Boundary Wall: `Yes`
- [ ] Enter Road Width: `30 feet`
- [ ] Enter Zoning: `Residential`
- [ ] Enter FSI: `2.5`
- [ ] Enter Ownership: `Freehold`
- [ ] Enter Possession: `Immediate`
- [ ] **Expected:** All values saved

---

### **5. Amenities Section**

#### Test: Bullet Point Input
- [ ] Enter amenities (one per line):
  ```
  Swimming Pool
  Gym
  Parking
  Security
  ```
- [ ] **Expected:** Each line preserved

---

### **6. Location & Nearby Facilities**

#### Test: Bullet Point Input
- [ ] Enter facilities (one per line):
  ```
  School - 500m
  Hospital - 1km
  Mall - 2km
  ```
- [ ] **Expected:** Each line preserved

---

### **7. Available Documents**

#### Test: Checkboxes
- [ ] Click "Title Deed" checkbox
- [ ] **Expected:** Checkbox checked
- [ ] Click "Property Tax Receipt" checkbox
- [ ] **Expected:** Both checked
- [ ] Click "Title Deed" again
- [ ] **Expected:** Unchecked

#### Test: Multiple Selection
- [ ] Check 5 different documents
- [ ] **Expected:** All 5 remain checked
- [ ] Uncheck 2 documents
- [ ] **Expected:** 3 remain checked

---

### **8. Property Images**

#### Test: File Upload
- [ ] Click "Choose files" button
- [ ] Select 3 images from your computer
- [ ] **Expected:** 3 image previews appear
- [ ] **Expected:** Images arranged in grid

#### Test: Image Preview
- [ ] Upload images
- [ ] **Expected:** See thumbnail previews
- [ ] **Expected:** Each image has "Remove" button
- [ ] **Expected:** Grid layout (2-4 columns based on screen size)

#### Test: Remove Image
- [ ] Upload 3 images
- [ ] Click "Remove" on second image
- [ ] **Expected:** Second image disappears
- [ ] **Expected:** 2 images remain
- [ ] **Expected:** Grid adjusts

#### Test: Multiple Uploads
- [ ] Upload 2 images
- [ ] Click "Choose files" again
- [ ] Select 2 more images
- [ ] **Expected:** Total 4 images shown
- [ ] **Expected:** All 4 have remove buttons

---

### **9. Contact Information**

#### Test: All Fields
- [ ] Enter Name: `John Doe`
- [ ] Enter Email: `john@example.com`
- [ ] Enter Phone: `9876543210`
- [ ] **Expected:** All values saved

---

### **10. Form Submission**

#### Test: Validation Error
- [ ] Leave "Property Title" empty
- [ ] Fill other required fields
- [ ] Click "Add Property"
- [ ] **Expected:** Error toast appears
- [ ] **Expected:** Message: "Please fill in all required fields"
- [ ] **Expected:** Form data NOT cleared

#### Test: Successful Submission
- [ ] Fill all required fields:
  - Title: `Test Property`
  - City: `Chennai`
  - Price: `5000000`
  - Area: `1500`
- [ ] Click "Add Property"
- [ ] **Expected:** Loading state (button disabled)
- [ ] **Expected:** Success toast appears
- [ ] **Expected:** Redirect to properties page
- [ ] **Expected:** New property visible in list

---

### **11. Responsive Design**

#### Test: Mobile View (< 768px)
- [ ] Resize browser to mobile width
- [ ] **Expected:** Single column layout
- [ ] **Expected:** Full-width inputs
- [ ] **Expected:** 2-column image grid
- [ ] **Expected:** Stacked buttons

#### Test: Tablet View (768px - 1024px)
- [ ] Resize browser to tablet width
- [ ] **Expected:** 2-column input layout
- [ ] **Expected:** 3-column image grid
- [ ] **Expected:** Proper spacing

#### Test: Desktop View (> 1024px)
- [ ] Resize browser to desktop width
- [ ] **Expected:** 3-column input layout
- [ ] **Expected:** 4-column image grid
- [ ] **Expected:** Maximum width 1280px
- [ ] **Expected:** Centered content

---

### **12. Accordion Behavior**

#### Test: Multiple Sections Open
- [ ] Expand "Key Highlights"
- [ ] Expand "Specifications"
- [ ] Expand "Amenities"
- [ ] **Expected:** All 3 sections open simultaneously
- [ ] **Expected:** No automatic closing

#### Test: Collapse All
- [ ] Expand all accordion sections
- [ ] Click each header to collapse
- [ ] **Expected:** Each section collapses independently

---

### **13. Data Persistence**

#### Test: Form Validation Error
- [ ] Fill entire form
- [ ] Leave "City" empty
- [ ] Click "Add Property"
- [ ] **Expected:** Error toast
- [ ] **Expected:** All other data still in form
- [ ] Fill "City"
- [ ] Click "Add Property" again
- [ ] **Expected:** Successful submission

---

### **14. Edge Cases**

#### Test: Very Long Text
- [ ] Enter 500+ character description
- [ ] **Expected:** Textarea scrolls
- [ ] **Expected:** No layout breaking

#### Test: Special Characters
- [ ] Enter title with special chars: `Property @ #123`
- [ ] **Expected:** Characters accepted
- [ ] **Expected:** Proper display

#### Test: Large Numbers
- [ ] Enter price: `999999999`
- [ ] Enter area: `100000`
- [ ] **Expected:** Price per sq.ft calculated correctly
- [ ] **Expected:** No overflow

#### Test: Decimal Values
- [ ] Enter price: `5500000.50`
- [ ] Enter area: `1500.75`
- [ ] **Expected:** Decimals accepted
- [ ] **Expected:** Calculation accurate

---

### **15. Navigation**

#### Test: Back Button
- [ ] Fill form partially
- [ ] Click browser back button
- [ ] **Expected:** Navigate to properties page
- [ ] **Expected:** Data lost (expected behavior)

#### Test: Cancel/Return
- [ ] Fill form
- [ ] Navigate to properties page manually
- [ ] **Expected:** Form data lost
- [ ] **Expected:** No errors

---

## 🐛 Common Issues & Solutions

### **Issue 1: Form Not Submitting**
**Symptoms:** Click "Add Property" but nothing happens

**Check:**
- [ ] All required fields filled?
- [ ] Check browser console for errors
- [ ] Check network tab for API call

**Solution:**
- Fill all required fields (Title, City, Price, Area)
- Check server logs for errors

---

### **Issue 2: Images Not Uploading**
**Symptoms:** Images selected but not showing preview

**Check:**
- [ ] File format (JPG, PNG, GIF, WebP)
- [ ] File size (< 5MB recommended)
- [ ] Browser console for errors

**Solution:**
- Use supported image formats
- Reduce image size if too large
- Try different images

---

### **Issue 3: Auto-Calculation Not Working**
**Symptoms:** Price per sq.ft not updating

**Check:**
- [ ] Both Price and Area filled?
- [ ] Valid numbers entered?
- [ ] No letters or special characters?

**Solution:**
- Enter numeric values only
- Ensure both fields have values
- Check for leading/trailing spaces

---

### **Issue 4: Accordion Not Expanding**
**Symptoms:** Click header but section doesn't open

**Check:**
- [ ] JavaScript enabled?
- [ ] Browser console for errors
- [ ] Try different section

**Solution:**
- Refresh page
- Clear browser cache
- Try different browser

---

### **Issue 5: Validation Error Persists**
**Symptoms:** Error toast shows even after filling fields

**Check:**
- [ ] All required fields actually filled?
- [ ] No extra spaces in fields?
- [ ] Correct field format?

**Solution:**
- Double-check each required field
- Remove extra spaces
- Ensure proper format (email, phone)

---

## 📊 Test Results Template

Use this template to record your test results:

```
Date: _______________
Tester: _______________

✅ PASSED TESTS:
- [ ] Basic Information
- [ ] Auto-Calculation
- [ ] Property Type Dropdown
- [ ] Description Input
- [ ] Key Highlights
- [ ] Specifications
- [ ] Amenities
- [ ] Nearby Facilities
- [ ] Documents Checkboxes
- [ ] Image Upload
- [ ] Image Preview
- [ ] Image Removal
- [ ] Contact Information
- [ ] Form Validation
- [ ] Successful Submission
- [ ] Mobile Responsive
- [ ] Tablet Responsive
- [ ] Desktop Responsive
- [ ] Accordion Behavior
- [ ] Data Persistence

❌ FAILED TESTS:
(List any failed tests with details)

🐛 BUGS FOUND:
(List any bugs discovered)

💡 SUGGESTIONS:
(List any improvement suggestions)
```

---

## 🎯 Success Criteria

The form passes testing if:

✅ All required field validations work  
✅ Auto-calculation is accurate  
✅ Image upload and preview work  
✅ Form submits successfully  
✅ Data is saved to database  
✅ Property appears in listings  
✅ Responsive on all screen sizes  
✅ No console errors  
✅ No layout breaking  
✅ Proper error messages  

---

## 📝 Next Steps After Testing

### **If All Tests Pass:**
1. ✅ Mark form as production-ready
2. ✅ Train users on form usage
3. ✅ Monitor for issues
4. ✅ Collect user feedback

### **If Tests Fail:**
1. 🐛 Document failed tests
2. 🐛 Report bugs with details
3. 🐛 Fix issues
4. 🐛 Re-test after fixes

---

## 📞 Support

If you encounter issues during testing:

1. **Check Documentation:** `PROPERTY_FORM_GUIDE.md`
2. **Check Server Logs:** Look for error messages
3. **Check Browser Console:** Look for JavaScript errors
4. **Check Network Tab:** Verify API calls

---

## 🎉 Testing Complete!

Once all tests pass, the property form is ready for production use!

**Happy Testing!** 🚀
