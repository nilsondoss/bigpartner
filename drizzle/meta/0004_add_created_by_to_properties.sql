-- Add created_by column to properties table
ALTER TABLE `properties` ADD COLUMN `created_by` int;

-- Create index for created_by
CREATE INDEX `property_created_by_idx` ON `properties` (`created_by`);
