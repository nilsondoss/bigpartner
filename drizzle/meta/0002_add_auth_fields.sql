CREATE TABLE `inquiries` (`id` int AUTO_INCREMENT NOT NULL, `full_name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `phone` varchar(20) NOT NULL, `inquiry_type` varchar(50) NOT NULL, `property_id` varchar(100), `property_name` varchar(255), `subject` varchar(255) NOT NULL, `message` text NOT NULL, `user_type` varchar(50), `status` varchar(50) NOT NULL DEFAULT 'pending', `priority` varchar(20) NOT NULL DEFAULT 'medium', `assigned_to` varchar(255), `response_message` text, `responded_at` timestamp, `responded_by` varchar(255), `created_at` timestamp NOT NULL DEFAULT (now()), `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT `inquiries_id` PRIMARY KEY(`id`));
--> statement-breakpoint
CREATE TABLE `partners` (`id` int AUTO_INCREMENT NOT NULL, `company_name` varchar(255) NOT NULL, `company_type` varchar(100) NOT NULL, `registration_number` varchar(100), `gst_number` varchar(15), `rera_number` varchar(100), `contact_person_name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `phone` varchar(20) NOT NULL, `alternate_phone` varchar(20), `website_url` varchar(255), `password_hash` varchar(255), `email_verified` boolean DEFAULT false, `email_verification_token` varchar(255), `reset_password_token` varchar(255), `reset_password_expires` timestamp, `last_login_at` timestamp, `office_address` varchar(500), `city` varchar(100), `state` varchar(100), `pincode` varchar(10), `years_in_business` int, `number_of_projects` int DEFAULT 0, `specialization` text, `operating_cities` text, `company_pan_card` varchar(255), `gst_certificate` varchar(255), `rera_certificate` varchar(255), `verification_status` varchar(20) NOT NULL DEFAULT 'pending', `is_verified` boolean DEFAULT false, `verification_date` timestamp, `rejection_reason` text, `subscription_plan` varchar(50) NOT NULL DEFAULT 'free', `subscription_expires_at` timestamp, `created_at` timestamp NOT NULL DEFAULT (now()), `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT `partners_id` PRIMARY KEY(`id`), CONSTRAINT `partners_email_unique` UNIQUE(`email`));
--> statement-breakpoint
ALTER TABLE `investors` ADD `password_hash` varchar(255);
--> statement-breakpoint
ALTER TABLE `investors` ADD `email_verified` boolean DEFAULT false;
--> statement-breakpoint
ALTER TABLE `investors` ADD `email_verification_token` varchar(255);
--> statement-breakpoint
ALTER TABLE `investors` ADD `reset_password_token` varchar(255);
--> statement-breakpoint
ALTER TABLE `investors` ADD `reset_password_expires` timestamp;
--> statement-breakpoint
ALTER TABLE `investors` ADD `last_login_at` timestamp;
