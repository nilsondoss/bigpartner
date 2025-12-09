CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) PRIMARY KEY NOT NULL,
  `user_id` int NOT NULL,
  `user_type` varchar(50) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `sessions` (`user_id`);
--> statement-breakpoint
CREATE INDEX `session_expires_at_idx` ON `sessions` (`expires_at`);
