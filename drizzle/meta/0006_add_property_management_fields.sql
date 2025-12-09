-- Add property management fields for approval, soft delete, and ownership
ALTER TABLE `properties` ADD `created_by` int;
ALTER TABLE `properties` ADD `approval_status` varchar(50) NOT NULL DEFAULT 'pending';
ALTER TABLE `properties` ADD `rejection_reason` text;
ALTER TABLE `properties` ADD `approved_by` int;
ALTER TABLE `properties` ADD `approved_at` timestamp;
ALTER TABLE `properties` ADD `deleted` boolean NOT NULL DEFAULT false;
ALTER TABLE `properties` ADD `deleted_at` timestamp;

-- Add foreign key constraints
ALTER TABLE `properties` ADD CONSTRAINT `properties_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `properties` ADD CONSTRAINT `properties_approved_by_users_id_fk` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;

-- Create favorites table
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`property_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);

-- Add indexes for favorites
CREATE INDEX `unique_favorite_idx` ON `favorites` (`user_id`,`property_id`);
CREATE INDEX `favorite_user_id_idx` ON `favorites` (`user_id`);
CREATE INDEX `favorite_property_id_idx` ON `favorites` (`property_id`);

-- Add foreign key constraints for favorites
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_property_id_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;
