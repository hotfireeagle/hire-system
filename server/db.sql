CREATE DATABASE hire;

-- 前台用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  `email` VARCHAR(200) UNIQUE NOT NULL,
  `password` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 后台用户表
CREATE TABLE IF NOT EXISTS `ope_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME NOT NULL,
  `delete_time` DATETIME,
  `email` VARCHAR(200) UNIQUE NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 角色表
CREATE TABLE IF NOT EXISTS `role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME NOT NULL,
  `delete_time` DATETIME,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `desc` TEXT,
  `creator_id` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 后台用户和角色表多对多的关系
CREATE TABLE IF NOT EXISTS `users_to_roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 权限表
CREATE TABLE IF NOT EXISTS `permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `parent_id` INT,
  `endpoint` VARCHAR(200),
  `method` VARCHAR(16),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 权限和角色多对多关系的中间表
CREATE TABLE IF NOT EXISTS `permissions_to_roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `permission_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;