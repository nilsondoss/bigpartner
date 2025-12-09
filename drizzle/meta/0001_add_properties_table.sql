-- Add properties table
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`property_type` varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'available',
	`address_line1` varchar(255) NOT NULL,
	`address_line2` varchar(255),
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`pincode` varchar(10) NOT NULL,
	`locality` varchar(255),
	`landmark` varchar(255),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`price` decimal(15,2) NOT NULL,
	`price_per_sqft` decimal(10,2),
	`currency` varchar(3) NOT NULL DEFAULT 'INR',
	`negotiable` boolean NOT NULL DEFAULT false,
	`bedrooms` int,
	`bathrooms` int,
	`balconies` int,
	`carpet_area` decimal(10,2),
	`built_up_area` decimal(10,2),
	`plot_area` decimal(10,2),
	`area_unit` varchar(20) NOT NULL DEFAULT 'sqft',
	`total_floors` int,
	`floor_number` int,
	`facing` varchar(50),
	`furnishing_status` varchar(50),
	`age_of_property` int,
	`possession_date` date,
	`amenities` text,
	`featured_image` varchar(500),
	`images` text,
	`video_url` varchar(500),
	`virtual_tour_url` varchar(500),
	`rera_approved` boolean NOT NULL DEFAULT false,
	`rera_number` varchar(100),
	`approval_authority` varchar(255),
	`ownership_type` varchar(50),
	`partner_id` int,
	`owner_name` varchar(255),
	`owner_phone` varchar(20),
	`owner_email` varchar(255),
	`meta_title` varchar(255),
	`meta_description` text,
	`keywords` text,
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_verified` boolean NOT NULL DEFAULT false,
	`view_count` int NOT NULL DEFAULT 0,
	`inquiry_count` int NOT NULL DEFAULT 0,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`),
	CONSTRAINT `properties_slug_unique` UNIQUE(`slug`)
);

-- Create indexes for properties table
CREATE INDEX `property_slug_idx` ON `properties` (`slug`);
CREATE INDEX `property_city_idx` ON `properties` (`city`);
CREATE INDEX `property_state_idx` ON `properties` (`state`);
CREATE INDEX `property_type_idx` ON `properties` (`property_type`);
CREATE INDEX `property_status_idx` ON `properties` (`status`);
CREATE INDEX `property_price_idx` ON `properties` (`price`);
CREATE INDEX `property_bedrooms_idx` ON `properties` (`bedrooms`);
CREATE INDEX `property_partner_id_idx` ON `properties` (`partner_id`);
CREATE INDEX `property_is_featured_idx` ON `properties` (`is_featured`);
CREATE INDEX `property_is_verified_idx` ON `properties` (`is_verified`);
CREATE INDEX `property_published_at_idx` ON `properties` (`published_at`);
CREATE INDEX `property_created_at_idx` ON `properties` (`created_at`);
CREATE INDEX `property_city_type_idx` ON `properties` (`city`,`property_type`);
CREATE INDEX `property_status_type_idx` ON `properties` (`status`,`property_type`);
CREATE INDEX `property_city_price_idx` ON `properties` (`city`,`price`);
