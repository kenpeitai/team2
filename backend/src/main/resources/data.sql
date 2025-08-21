-- SQLite数据库初始化数据
-- 注意：这个文件只在开发环境使用，生产环境应该通过API创建数据

-- 插入测试用户
INSERT OR IGNORE INTO users (username, email, password, full_name, role, is_active, created_at, updated_at) 
VALUES 
('admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'システム管理者', 'ADMIN', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user1', 'user1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'テストユーザー1', 'USER', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user2', 'user2@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'テストユーザー2', 'USER', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 插入测试避难所
INSERT OR IGNORE INTO shelters (shelter_name, shelter_address, representative_last_name, representative_first_name, phone_number, email, password, evacuee_count, injured_count, electricity_status, gas_status, water_status, traffic_status, is_active, created_at, updated_at) 
VALUES 
('中央避難所', '東京都渋谷区渋谷1-1-1', '田中', '太郎', '03-1234-5678', 'central@shelter.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 150, 5, 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'NORMAL', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('北区避難所', '東京都北区北1-1-1', '佐藤', '花子', '03-2345-6789', 'north@shelter.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 80, 2, 'AVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'RESTRICTED', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('南区避難所', '東京都南区南1-1-1', '鈴木', '次郎', '03-3456-7890', 'south@shelter.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 120, 8, 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'CLOSED', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
