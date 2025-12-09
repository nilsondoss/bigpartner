# Partner Registration Fix

## Issue
Partner registration was failing with "Internal server error" because the `partners` table did not exist in the database.

## Root Cause
The `partners` table was defined in the schema (`src/server/db/schema.ts`) but no migration had been created or run to actually create the table in the database.

## Solution Applied

### 1. Created Migration Files
- **`drizzle/0007_add_partners_table.sql`** - Creates the partners table with all required columns and indexes
- **`drizzle/0008_add_favorites_table.sql`** - Creates the favorites table (which was also missing)

### 2. Updated Migration Journal
Updated `drizzle/meta/_journal.json` to include all migrations:
- 0000: Initial investors table
- 0001: Properties table
- 0002: Auth fields
- 0003: Sessions table
- 0004: Created_by field
- 0005: Role field
- 0006: Property management fields
- **0007: Partners table (NEW)**
- **0008: Favorites table (NEW)**

### 3. Ran Migrations
Executed the SQL migrations manually to create both tables in the database.

### 4. Verified Tables
Confirmed that both `partners` and `favorites` tables now exist with correct schema.

## Partners Table Schema

```sql
CREATE TABLE `partners` (
  `id` bigint unsigned AUTO_INCREMENT PRIMARY KEY,
  `company_name` varchar(255) NOT NULL,
  `company_type` varchar(50) NOT NULL,
  `registration_number` varchar(100),
  `gst_number` varchar(15),
  `rera_number` varchar(100),
  `contact_person_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `phone` varchar(20) NOT NULL,
  `alternate_phone` varchar(20),
  `office_address` text,
  `city` varchar(100),
  `state` varchar(100),
  `pincode` varchar(10),
  `years_in_business` int,
  `number_of_projects` int,
  `specialization` text,
  `operating_cities` text,
  `website_url` varchar(255),
  `is_verified` boolean DEFAULT false,
  `subscription_plan` varchar(50) DEFAULT 'free',
  `subscription_start_date` timestamp,
  `subscription_end_date` timestamp,
  `created_at` timestamp DEFAULT now(),
  `updated_at` timestamp DEFAULT now() ON UPDATE CURRENT_TIMESTAMP
);
```

### Indexes
- `partners_company_type_idx` on `company_type`
- `partners_city_idx` on `city`
- `partners_state_idx` on `state`
- `partners_is_verified_idx` on `is_verified`

## Favorites Table Schema

```sql
CREATE TABLE `favorites` (
  `id` bigint unsigned AUTO_INCREMENT PRIMARY KEY,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `created_at` timestamp DEFAULT now(),
  UNIQUE KEY `favorites_user_property_unique` (`user_id`, `property_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
);
```

### Indexes
- `favorites_user_id_idx` on `user_id`
- `favorites_property_id_idx` on `property_id`

## Testing

### Test Partner Registration
```bash
curl -X POST http://localhost:20000/api/partners \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "companyType": "developer",
    "contactPersonName": "John Doe",
    "email": "test@example.com",
    "phone": "1234567890"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Partner registered successfully",
  "partner": { ... }
}
```

## Files Modified
- ✅ `drizzle/0007_add_partners_table.sql` (created)
- ✅ `drizzle/0008_add_favorites_table.sql` (created)
- ✅ `drizzle/meta/_journal.json` (updated)
- ✅ `src/server/db/schema.ts` (favorites table uncommented)

## Status
✅ **FIXED** - Partner registration now works correctly. The partners table exists in the database and the API endpoint can successfully create new partner records.

## Next Steps
1. Test partner registration through the UI
2. Verify email notifications are sent
3. Test partner login and dashboard access
4. Verify favorites functionality works
