-- 设置数据库字符集和排序规则
ALTER DATABASE uacl CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;  
-- 为用户赋予权限
GRANT ALL PRIVILEGES ON uacl.* TO 'mysql'@'%'; 
FLUSH PRIVILEGES;