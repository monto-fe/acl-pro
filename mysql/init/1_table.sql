-- 选择数据库
USE uacl;

-- 创建 t_namespace 表
CREATE TABLE IF NOT EXISTS `t_namespace` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `namespace` varchar(128) NOT NULL DEFAULT '' COMMENT '项目组标识',
  `parent` varchar(128) NOT NULL DEFAULT '' COMMENT '所属父项目组',
  `name` varchar(128) NOT NULL DEFAULT '' COMMENT '项目组中文名',
  `describe` varchar(128) NOT NULL DEFAULT '' COMMENT '描述',
  `operator` varchar(128) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` int unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `namespace` (`namespace`),
  KEY `parent` (`parent`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- 创建 t_login_token 表
CREATE TABLE IF NOT EXISTS `t_login_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expired_at` int NOT NULL,
  `create_time` int unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- 创建 t_resource 表
CREATE TABLE IF NOT EXISTS `t_resource` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `namespace` varchar(128) NOT NULL DEFAULT '' COMMENT '所属项目组',
  `category` varchar(128) NOT NULL DEFAULT '' COMMENT '资源分类',
  `resource` varchar(128) NOT NULL DEFAULT '' COMMENT '资源标识',
  `properties` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '资源属性 (JSON Schema)',
  `name` varchar(128) NOT NULL DEFAULT '' COMMENT '资源标识',
  `describe` text NOT NULL COMMENT '描述',
  `operator` varchar(128) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` int unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `unique_namespace_name` (`namespace`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- 创建 t_role 表
CREATE TABLE IF NOT EXISTS `t_role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `namespace` varchar(128) NOT NULL DEFAULT '' COMMENT '所属项目组',
  `role` varchar(255) NOT NULL DEFAULT '' COMMENT '角色标识',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '角色中文名',
  `describe` varchar(512) NOT NULL DEFAULT '' COMMENT '描述',
  `operator` varchar(512) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` int unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique-namespace_name` (`namespace`,`name`),
  UNIQUE KEY `unique-namespace_role` (`namespace`,`role`),
  KEY `unique-namespace_id` (`namespace`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- 创建 t_role_permission 表
CREATE TABLE IF NOT EXISTS `t_role_permission` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `namespace` varchar(128) NOT NULL DEFAULT '' COMMENT '所属项目组',
  `role_id` int unsigned NOT NULL COMMENT '角色ID',
  `resource_id` int unsigned NOT NULL COMMENT '资源ID',
  `describe` text NOT NULL COMMENT '描述',
  `operator` varchar(128) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` int unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`namespace`,`role_id`,`resource_id`),
  KEY `role_id` (`role_id`),
  KEY `resource_id` (`resource_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- 创建 t_user 表
CREATE TABLE IF NOT EXISTS `t_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'user id',
  `namespace` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `o_id` int DEFAULT NULL COMMENT 'oa id',
  `user` varchar(255) NOT NULL COMMENT '用户英文名',
  `name` varchar(255) NOT NULL COMMENT '用户中文名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `job` varchar(512) NOT NULL DEFAULT '' COMMENT '职位名称',
  `phone_number` varchar(512) NOT NULL DEFAULT '' COMMENT '手机号码',
  `email` varchar(512) NOT NULL DEFAULT '' COMMENT '邮箱',
  `create_time` int unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `delete_time` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `o_id` (`o_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- 创建 t_user_role 表
CREATE TABLE IF NOT EXISTS `t_user_role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `namespace` varchar(128) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '所属项目组',
  `user` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '用户英文名',
  `role_id` int unsigned NOT NULL COMMENT '角色ID',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '当前状态(-1: 禁用；1: 可用；)',
  `operator` varchar(512) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` int unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `namespace` (`namespace`),
  KEY `user` (`user`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;