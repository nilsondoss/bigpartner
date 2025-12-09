-- Add role column to users table
ALTER TABLE `users` ADD `role` varchar(50) NOT NULL DEFAULT 'user';
