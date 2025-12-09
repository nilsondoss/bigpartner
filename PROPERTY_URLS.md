# Property Pages URL Fix

## Issue
The property pages were returning "Page doesn't exist" errors because the routes used slashes (`/properties/rental`) but the pages were being accessed with dashes (`/properties-rental`).

## Root Cause
Mismatch between:
- **File names**: `properties-rental.tsx` (with dashes)
- **Route paths**: `/properties/rental` (with slashes)
- **Accessed URLs**: `/properties-rental` (with dashes)

## Solution
Updated `src/routes.tsx` to use dashes in all property page routes to match the file naming convention.

## Changes Made

### Before (with slashes):
```typescript
{ path: '/properties/industrial', element: <IndustrialPropertiesPage /> }
{ path: '/properties/residential', element: <ResidentialPropertiesPage /> }
{ path: '/properties/commercial', element: <CommercialPropertiesPage /> }
{ path: '/properties/farmland', element: <FarmLandPropertiesPage /> }
{ path: '/properties/rental', element: <RentalPropertiesPage /> }
```

### After (with dashes):
```typescript
{ path: '/properties-industrial', element: <IndustrialPropertiesPage /> }
{ path: '/properties-residential', element: <ResidentialPropertiesPage /> }
{ path: '/properties-commercial', element: <CommercialPropertiesPage /> }
{ path: '/properties-farmland', element: <FarmLandPropertiesPage /> }
{ path: '/properties-rental', element: <RentalPropertiesPage /> }
```

## Working URLs
All property pages are now accessible at:

1. **Residential**: https://lmnesop1a2.preview.c24.airoapp.ai/properties-residential
2. **Commercial**: https://lmnesop1a2.preview.c24.airoapp.ai/properties-commercial
3. **Industrial**: https://lmnesop1a2.preview.c24.airoapp.ai/properties-industrial
4. **Farmland**: https://lmnesop1a2.preview.c24.airoapp.ai/properties-farmland
5. **Rental**: https://lmnesop1a2.preview.c24.airoapp.ai/properties-rental

## Status
✅ All property pages now accessible
✅ Routes match file naming convention
✅ URLs are consistent across the site
