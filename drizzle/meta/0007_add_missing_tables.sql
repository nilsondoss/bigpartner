-- Add missing tables: partners, favorites, inquiries

-- Partners Table
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`company_type` varchar(100) NOT NULL,
	`registration_number` varchar(100),
	`gst_number` varchar(15),
	`rera_number` varchar(100),
	`contact_person_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`alternate_phone` varchar(20),
	`website_url` varchar(255),
	`password_hash` varchar(255),
	`email_verified` boolean DEFAULT false,
	`email_verification_token` varchar(255),
	`reset_password_token` varchar(255),
	`reset_password_expires` timestamp,
	`last_login_at` timestamp,
	`office_address` varchar(500),
	`city` varchar(100),
	`state` varchar(100),
	`pincode` varchar(10),
	`years_in_business` int,
	`total_projects_completed` int,
	`ongoing_projects` int,
	`specialization` text,
	`service_areas` text,
	`company_description` text,
	`logo_url` varchar(255),
	`company_documents` json,
	`certifications` json,
	`portfolio_images` json,
	`social_media_links` json,
	`bank_account_number` varchar(50),
	`bank_name` varchar(100),
	`bank_ifsc_code` varchar(20),
	`bank_branch` varchar(100),
	`pan_number` varchar(10),
	`status` varchar(50) DEFAULT 'pending' NOT NULL,
	`rejection_reason` text,
	`approved_at` timestamp,
	`approved_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`),
	CONSTRAINT `partners_email_unique` UNIQUE(`email`)
);

CREATE INDEX `partner_email_idx` ON `partners` (`email`);
CREATE INDEX `partner_company_type_idx` ON `partners` (`company_type`);
CREATE INDEX `partner_status_idx` ON `partners` (`status`);
CREATE INDEX `partner_city_idx` ON `partners` (`city`);
CREATE INDEX `partner_state_idx` ON `partners` (`state`);

-- Inquiries Table
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inquiry_type` varchar(50) NOT NULL,
	`user_type` varchar(50) NOT NULL,
	`property_id` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`subject` varchar(255),
	`message` text NOT NULL,
	`preferred_contact_method` varchar(50),
	`preferred_contact_time` varchar(100),
	`budget_range` varchar(100),
	`timeline` varchar(100),
	`additional_info` json,
	`ip_address` varchar(45),
	`user_agent` text,
	`referrer_url` varchar(500),
	`status` varchar(50) DEFAULT 'pending' NOT NULL,
	`priority` varchar(20) DEFAULT 'medium' NOT NULL,
	`assigned_to` varchar(255),
	`response_message` text,
	`responded_at` timestamp,
	`responded_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);

CREATE INDEX `inquiry_email_idx` ON `inquiries` (`email`);
CREATE INDEX `inquiry_status_idx` ON `inquiries` (`status`);
CREATE INDEX `inquiry_priority_idx` ON `inquiries` (`priority`);
CREATE INDEX `inquiry_type_idx` ON `inquiries` (`inquiry_type`);
CREATE INDEX `inquiry_user_type_idx` ON `inquiries` (`user_type`);
CREATE INDEX `inquiry_property_id_idx` ON `inquiries` (`property_id`);
CREATE INDEX `inquiry_created_at_idx` ON `inquiries` (`created_at`);
CREATE INDEX `inquiry_status_priority_idx` ON `inquiries` (`status`,`priority`);

-- Favorites Table
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`property_id` int NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `favorites_user_id_property_id_unique` UNIQUE(`user_id`,`property_id`)
);

CREATE INDEX `favorite_user_id_idx` ON `favorites` (`user_id`);
CREATE INDEX `favorite_property_id_idx` ON `favorites` (`property_id`);
CREATE INDEX `favorite_created_at_idx` ON `favorites` (`created_at`);
