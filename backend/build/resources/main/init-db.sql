-- PostgreSQL数据库初始化脚本
-- 这个脚本会在PostgreSQL容器首次启动时自动执行

-- 创建扩展（如果需要）
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 设置时区
SET timezone = 'Asia/Tokyo';

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建避难所表
CREATE TABLE IF NOT EXISTS shelters (
    id BIGSERIAL PRIMARY KEY,
    shelter_name VARCHAR(100) NOT NULL UNIQUE,
    shelter_address VARCHAR(200) NOT NULL,
    representative_last_name VARCHAR(50) NOT NULL,
    representative_first_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    evacuee_count INTEGER DEFAULT 0,
    injured_count INTEGER DEFAULT 0,
    electricity_status VARCHAR(20),
    gas_status VARCHAR(20),
    water_status VARCHAR(20),
    traffic_status VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_shelters_name ON shelters(shelter_name);
CREATE INDEX IF NOT EXISTS idx_shelters_address ON shelters(shelter_address);
CREATE INDEX IF NOT EXISTS idx_shelters_email ON shelters(email);
CREATE INDEX IF NOT EXISTS idx_shelters_representative ON shelters(representative_last_name, representative_first_name);
CREATE INDEX IF NOT EXISTS idx_shelters_evacuee_count ON shelters(evacuee_count);
CREATE INDEX IF NOT EXISTS idx_shelters_injured_count ON shelters(injured_count);
CREATE INDEX IF NOT EXISTS idx_shelters_is_active ON shelters(is_active);
CREATE INDEX IF NOT EXISTS idx_shelters_created_at ON shelters(created_at);

-- 插入测试数据
INSERT INTO users (username, email, password, full_name, role, is_active, created_at, updated_at) 
VALUES 
('admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'システム管理者', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user1', 'user1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'テストユーザー1', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user2', 'user2@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'テストユーザー2', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

INSERT INTO shelters (shelter_name, shelter_address, representative_last_name, representative_first_name, phone_number, email, password, evacuee_count, injured_count, electricity_status, gas_status, water_status, traffic_status, is_active, created_at, updated_at) 
VALUES 
('中央避難所', '東京都渋谷区渋谷1-1-1', '田中', '太郎', '03-1234-5678', 'central@shelter.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 150, 5, 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'NORMAL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('北区避難所', '東京都北区北1-1-1', '佐藤', '花子', '03-2345-6789', 'north@shelter.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 80, 2, 'AVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'RESTRICTED', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('南区避難所', '東京都南区南1-1-1', '鈴木', '次郎', '03-3456-7890', 'south@shelter.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 120, 8, 'UNAVAILABLE', 'UNAVAILABLE', 'AVAILABLE', 'CLOSED', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (shelter_name) DO NOTHING;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shelters_updated_at BEFORE UPDATE ON shelters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
