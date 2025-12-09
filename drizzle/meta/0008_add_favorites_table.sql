CREATE TABLE `favorites` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`property_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `favorites_user_property_unique` UNIQUE(`user_id`,`property_id`)
);

CREATE INDEX `favorites_user_id_idx` ON `favorites` (`user_id`);
CREATE INDEX `favorites_property_id_idx` ON `favorites` (`property_id`);

ALTER TABLE `favorites` ADD CONSTRAINT `favorites_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_property_id_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;
