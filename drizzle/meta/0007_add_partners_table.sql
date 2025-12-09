CREATE TABLE `partners` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`company_type` varchar(50) NOT NULL,
	`registration_number` varchar(100),
	`gst_number` varchar(15),
	`rera_number` varchar(100),
	`contact_person_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
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
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`),
	CONSTRAINT `partners_email_unique` UNIQUE(`email`)
);

CREATE INDEX `partners_company_type_idx` ON `partners` (`company_type`);
CREATE INDEX `partners_city_idx` ON `partners` (`city`);
CREATE INDEX `partners_state_idx` ON `partners` (`state`);
CREATE INDEX `partners_is_verified_idx` ON `partners` (`is_verified`);
