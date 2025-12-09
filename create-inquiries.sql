-- Inquiries Table
CREATE TABLE IF NOT EXISTS `inquiries` (
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

CREATE INDEX IF NOT EXISTS `inquiry_email_idx` ON `inquiries` (`email`);
CREATE INDEX IF NOT EXISTS `inquiry_status_idx` ON `inquiries` (`status`);
CREATE INDEX IF NOT EXISTS `inquiry_priority_idx` ON `inquiries` (`priority`);
CREATE INDEX IF NOT EXISTS `inquiry_type_idx` ON `inquiries` (`inquiry_type`);
CREATE INDEX IF NOT EXISTS `inquiry_user_type_idx` ON `inquiries` (`user_type`);
CREATE INDEX IF NOT EXISTS `inquiry_property_id_idx` ON `inquiries` (`property_id`);
CREATE INDEX IF NOT EXISTS `inquiry_created_at_idx` ON `inquiries` (`created_at`);
CREATE INDEX IF NOT EXISTS `inquiry_status_priority_idx` ON `inquiries` (`status`,`priority`);
