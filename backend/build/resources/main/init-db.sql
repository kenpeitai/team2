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

-- 创建商品表
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    weight_grams INTEGER NOT NULL,
    recommended_per_person_per_day REAL,
    image_url VARCHAR(500),
    image_verified BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建需求清单表
CREATE TABLE IF NOT EXISTS needs_lists (
    id BIGSERIAL PRIMARY KEY,
    shelter_id BIGINT,
    evacuee_count INTEGER NOT NULL,
    target_days INTEGER NOT NULL,
    total_units INTEGER,
    total_weight_grams INTEGER,
    water_cases INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES shelters(id)
);

-- 创建需求清单项目表
CREATE TABLE IF NOT EXISTS needs_list_items (
    id BIGSERIAL PRIMARY KEY,
    needs_list_id BIGINT NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    priority VARCHAR(20) NOT NULL,
    notes TEXT,
    per_unit_weight_grams INTEGER,
    total_weight_grams INTEGER,
    drone_eligible BOOLEAN,
    drone_eligible_whole_order BOOLEAN,
    drone_per_unit_eligible BOOLEAN,
    drone_units_per_flight INTEGER,
    drone_flights_required INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (needs_list_id) REFERENCES needs_lists(id)
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

CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

CREATE INDEX IF NOT EXISTS idx_needs_lists_shelter_id ON needs_lists(shelter_id);
CREATE INDEX IF NOT EXISTS idx_needs_lists_is_active ON needs_lists(is_active);
CREATE INDEX IF NOT EXISTS idx_needs_list_items_needs_list_id ON needs_list_items(needs_list_id);
CREATE INDEX IF NOT EXISTS idx_needs_list_items_product_id ON needs_list_items(product_id);

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

-- 插入商品数据
INSERT INTO products (product_id, name, unit, weight_grams, recommended_per_person_per_day, image_url, image_verified, category, is_active, created_at, updated_at) VALUES
-- 食料品
('p-water-2l', '飲料水 2L×6本（1ケース）', 'ケース', 12000, 3.0, '/products/p-water-2l.png', true, '食料', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-instant-rice', 'サトウのごはん 200g×5食', '箱', 1000, 2.0, '/products/p-instant-rice.png', true, '食料', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-canned-food', '缶詰(主食) 1缶', '缶', 350, 1.0, '/products/p-canned-food.png', true, '食料', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-bread', '食パン 6枚切り', '袋', 400, 1.0, '/products/p-bread.png', true, '食料', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-cup-noodle', 'カップ麺', '個', 120, 1.0, '/products/p-cup-noodle.png', true, '食料', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 生活用品
('p-blanket', '毛布', '枚', 800, 0.1, '/products/p-blanket.png', true, '生活用品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-battery-aa', '単3電池(8本)', 'パック', 180, 0.1, '/products/p-battery-aa.png', true, '生活用品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-flashlight', '懐中電灯', '個', 200, 0.1, '/products/p-flashlight.png', true, '生活用品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-radio', 'ラジオ', '個', 300, 0.1, '/products/p-radio.png', true, '生活用品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-sleeping-bag', '寝袋', '個', 1500, 0.1, '/products/p-sleeping-bag.png', true, '生活用品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 衛生用品
('p-mask', '不織布マスク(50枚)', '箱', 200, 2.0, '/products/p-mask.png', true, '衛生', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-toilet-paper', 'トイレットペーパー 12ロール', 'パック', 800, 0.5, '/products/p-toilet-paper.png', true, '衛生', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-wet-tissue', 'ウェットティッシュ 100枚', 'パック', 300, 1.0, '/products/p-wet-tissue.png', true, '衛生', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-soap', '石鹸', '個', 100, 0.2, '/products/p-soap.png', true, '衛生', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-toothbrush', '歯ブラシ', '本', 20, 0.1, '/products/p-toothbrush.png', true, '衛生', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 医薬品
('m-acetaminophen', '解熱鎮痛剤（アセトアミノフェン）20錠', '箱', 25, 0.1, '/products/m-acetaminophen.png', true, '医薬品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-ibuprofen', '解熱鎮痛剤（イブプロフェン）24錠', '箱', 28, 0.1, '/products/m-ibuprofen.png', true, '医薬品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-cold-combo', '総合感冒薬（風邪薬）30錠', '箱', 40, 0.1, '/products/m-cold-combo.png', true, '医薬品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-antihistamine', '抗ヒスタミン薬（アレルギー薬）10錠', '箱', 20, 0.1, '/products/m-antihistamine.png', true, '医薬品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-anti-diarrhea', '下痢止め（ロペラミド等）12錠', '箱', 18, 0.1, '/products/m-anti-diarrhea.png', true, '医薬品', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (product_id) DO NOTHING;

-- 插入需求清单数据
-- 中央避難所 (150人, 5人受伤) - 7天需求
INSERT INTO needs_lists (shelter_id, evacuee_count, target_days, total_units, total_weight_grams, water_cases, is_active, created_at, updated_at) VALUES
(1, 150, 7, 0, 0, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 北区避難所 (80人, 2人受伤) - 5天需求
INSERT INTO needs_lists (shelter_id, evacuee_count, target_days, total_units, total_weight_grams, water_cases, is_active, created_at, updated_at) VALUES
(2, 80, 5, 0, 0, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 南区避難所 (120人, 8人受伤) - 10天需求
INSERT INTO needs_lists (shelter_id, evacuee_count, target_days, total_units, total_weight_grams, water_cases, is_active, created_at, updated_at) VALUES
(3, 120, 10, 0, 0, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 中央避難所需求清单项目 (7天 × 150人)
INSERT INTO needs_list_items (needs_list_id, product_id, product_name, unit, category, quantity, priority, notes, per_unit_weight_grams, total_weight_grams, drone_eligible, drone_eligible_whole_order, drone_per_unit_eligible, drone_units_per_flight, drone_flights_required, created_at, updated_at) VALUES
-- 食料品 (高优先级)
(1, 'p-water-2l', '飲料水 2L×6本（1ケース）', 'ケース', '食料', 525, 'HIGH', '1日3ケース × 150人 × 7日', 12000, 6300000, false, false, false, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-instant-rice', 'サトウのごはん 200g×5食', '箱', '食料', 420, 'HIGH', '1日2箱 × 150人 × 7日', 1000, 420000, true, false, true, 5, 84, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-canned-food', '缶詰(主食) 1缶', '缶', '食料', 1050, 'HIGH', '1日1缶 × 150人 × 7日', 350, 367500, true, false, true, 10, 105, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-bread', '食パン 6枚切り', '袋', '食料', 1050, 'MEDIUM', '1日1袋 × 150人 × 7日', 400, 420000, true, false, true, 8, 132, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-cup-noodle', 'カップ麺', '個', '食料', 1050, 'MEDIUM', '1日1個 × 150人 × 7日', 120, 126000, true, false, true, 15, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 生活用品
(1, 'p-blanket', '毛布', '枚', '生活用品', 150, 'HIGH', '1人1枚', 800, 120000, true, false, true, 3, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-battery-aa', '単3電池(8本)', 'パック', '生活用品', 75, 'MEDIUM', '2人に1パック', 180, 13500, true, false, true, 20, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-flashlight', '懐中電灯', '個', '生活用品', 75, 'HIGH', '2人に1個', 200, 15000, true, false, true, 15, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-radio', 'ラジオ', '個', '生活用品', 15, 'MEDIUM', '10人に1個', 300, 4500, true, false, true, 10, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-sleeping-bag', '寝袋', '個', '生活用品', 150, 'HIGH', '1人1個', 1500, 225000, true, false, true, 2, 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 衛生用品
(1, 'p-mask', '不織布マスク(50枚)', '箱', '衛生', 21, 'HIGH', '1日2枚 × 150人 × 7日 ÷ 50枚', 200, 4200, true, false, true, 25, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-toilet-paper', 'トイレットペーパー 12ロール', 'パック', '衛生', 35, 'HIGH', '1日0.5ロール × 150人 × 7日 ÷ 12ロール', 800, 28000, true, false, true, 5, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-wet-tissue', 'ウェットティッシュ 100枚', 'パック', '衛生', 105, 'MEDIUM', '1日1枚 × 150人 × 7日 ÷ 100枚', 300, 31500, true, false, true, 10, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-soap', '石鹸', '個', '衛生', 75, 'MEDIUM', '2人に1個', 100, 7500, true, false, true, 25, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'p-toothbrush', '歯ブラシ', '本', '衛生', 150, 'MEDIUM', '1人1本', 20, 3000, true, false, true, 100, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 医薬品 (根据受伤人数调整)
(1, 'm-acetaminophen', '解熱鎮痛剤（アセトアミノフェン）20錠', '箱', '医薬品', 15, 'HIGH', '3人に1箱', 25, 375, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'm-ibuprofen', '解熱鎮痛剤（イブプロフェン）24錠', '箱', '医薬品', 15, 'HIGH', '3人に1箱', 28, 420, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'm-cold-combo', '総合感冒薬（風邪薬）30錠', '箱', '医薬品', 10, 'MEDIUM', '5人に1箱', 40, 400, true, false, true, 75, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'm-antihistamine', '抗ヒスタミン薬（アレルギー薬）10錠', '箱', '医薬品', 8, 'LOW', '10人に1箱', 20, 160, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'm-anti-diarrhea', '下痢止め（ロペラミド等）12錠', '箱', '医薬品', 5, 'MEDIUM', '15人に1箱', 18, 90, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 北区避難所需求清单项目 (5天 × 80人)
INSERT INTO needs_list_items (needs_list_id, product_id, product_name, unit, category, quantity, priority, notes, per_unit_weight_grams, total_weight_grams, drone_eligible, drone_eligible_whole_order, drone_per_unit_eligible, drone_units_per_flight, drone_flights_required, created_at, updated_at) VALUES
-- 食料品
(2, 'p-water-2l', '飲料水 2L×6本（1ケース）', 'ケース', '食料', 200, 'HIGH', '1日3ケース × 80人 × 5日', 12000, 2400000, false, false, false, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-instant-rice', 'サトウのごはん 200g×5食', '箱', '食料', 160, 'HIGH', '1日2箱 × 80人 × 5日', 1000, 160000, true, false, true, 5, 32, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-canned-food', '缶詰(主食) 1缶', '缶', '食料', 400, 'HIGH', '1日1缶 × 80人 × 5日', 350, 140000, true, false, true, 10, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-bread', '食パン 6枚切り', '袋', '食料', 400, 'MEDIUM', '1日1袋 × 80人 × 5日', 400, 160000, true, false, true, 8, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-cup-noodle', 'カップ麺', '個', '食料', 400, 'MEDIUM', '1日1個 × 80人 × 5日', 120, 48000, true, false, true, 15, 27, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 生活用品
(2, 'p-blanket', '毛布', '枚', '生活用品', 80, 'HIGH', '1人1枚', 800, 64000, true, false, true, 3, 27, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-battery-aa', '単3電池(8本)', 'パック', '生活用品', 40, 'MEDIUM', '2人に1パック', 180, 7200, true, false, true, 20, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-flashlight', '懐中電灯', '個', '生活用品', 40, 'HIGH', '2人に1個', 200, 8000, true, false, true, 15, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-radio', 'ラジオ', '個', '生活用品', 8, 'MEDIUM', '10人に1個', 300, 2400, true, false, true, 10, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-sleeping-bag', '寝袋', '個', '生活用品', 80, 'HIGH', '1人1個', 1500, 120000, true, false, true, 2, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 衛生用品
(2, 'p-mask', '不織布マスク(50枚)', '箱', '衛生', 8, 'HIGH', '1日2枚 × 80人 × 5日 ÷ 50枚', 200, 1600, true, false, true, 25, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-toilet-paper', 'トイレットペーパー 12ロール', 'パック', '衛生', 14, 'HIGH', '1日0.5ロール × 80人 × 5日 ÷ 12ロール', 800, 11200, true, false, true, 5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-wet-tissue', 'ウェットティッシュ 100枚', 'パック', '衛生', 40, 'MEDIUM', '1日1枚 × 80人 × 5日 ÷ 100枚', 300, 12000, true, false, true, 10, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-soap', '石鹸', '個', '衛生', 40, 'MEDIUM', '2人に1個', 100, 4000, true, false, true, 25, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'p-toothbrush', '歯ブラシ', '本', '衛生', 80, 'MEDIUM', '1人1本', 20, 1600, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 医薬品
(2, 'm-acetaminophen', '解熱鎮痛剤（アセトアミノフェン）20錠', '箱', '医薬品', 8, 'HIGH', '3人に1箱', 25, 200, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'm-ibuprofen', '解熱鎮痛剤（イブプロフェン）24錠', '箱', '医薬品', 8, 'HIGH', '3人に1箱', 28, 224, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'm-cold-combo', '総合感冒薬（風邪薬）30錠', '箱', '医薬品', 5, 'MEDIUM', '5人に1箱', 40, 200, true, false, true, 75, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'm-antihistamine', '抗ヒスタミン薬（アレルギー薬）10錠', '箱', '医薬品', 4, 'LOW', '10人に1箱', 20, 80, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'm-anti-diarrhea', '下痢止め（ロペラミド等）12錠', '箱', '医薬品', 3, 'MEDIUM', '15人に1箱', 18, 54, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 南区避難所需求清单项目 (10天 × 120人)
INSERT INTO needs_list_items (needs_list_id, product_id, product_name, unit, category, quantity, priority, notes, per_unit_weight_grams, total_weight_grams, drone_eligible, drone_eligible_whole_order, drone_per_unit_eligible, drone_units_per_flight, drone_flights_required, created_at, updated_at) VALUES
-- 食料品
(3, 'p-water-2l', '飲料水 2L×6本（1ケース）', 'ケース', '食料', 600, 'HIGH', '1日3ケース × 120人 × 10日', 12000, 7200000, false, false, false, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-instant-rice', 'サトウのごはん 200g×5食', '箱', '食料', 480, 'HIGH', '1日2箱 × 120人 × 10日', 1000, 480000, true, false, true, 5, 96, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-canned-food', '缶詰(主食) 1缶', '缶', '食料', 1200, 'HIGH', '1日1缶 × 120人 × 10日', 350, 420000, true, false, true, 10, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-bread', '食パン 6枚切り', '袋', '食料', 1200, 'MEDIUM', '1日1袋 × 120人 × 10日', 400, 480000, true, false, true, 8, 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-cup-noodle', 'カップ麺', '個', '食料', 1200, 'MEDIUM', '1日1個 × 120人 × 10日', 120, 144000, true, false, true, 15, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 生活用品
(3, 'p-blanket', '毛布', '枚', '生活用品', 120, 'HIGH', '1人1枚', 800, 96000, true, false, true, 3, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-battery-aa', '単3電池(8本)', 'パック', '生活用品', 60, 'MEDIUM', '2人に1パック', 180, 10800, true, false, true, 20, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-flashlight', '懐中電灯', '個', '生活用品', 60, 'HIGH', '2人に1個', 200, 12000, true, false, true, 15, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-radio', 'ラジオ', '個', '生活用品', 12, 'MEDIUM', '10人に1個', 300, 3600, true, false, true, 10, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-sleeping-bag', '寝袋', '個', '生活用品', 120, 'HIGH', '1人1個', 1500, 180000, true, false, true, 2, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 衛生用品
(3, 'p-mask', '不織布マスク(50枚)', '箱', '衛生', 24, 'HIGH', '1日2枚 × 120人 × 10日 ÷ 50枚', 200, 4800, true, false, true, 25, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-toilet-paper', 'トイレットペーパー 12ロール', 'パック', '衛生', 42, 'HIGH', '1日0.5ロール × 120人 × 10日 ÷ 12ロール', 800, 33600, true, false, true, 5, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-wet-tissue', 'ウェットティッシュ 100枚', 'パック', '衛生', 120, 'MEDIUM', '1日1枚 × 120人 × 10日 ÷ 100枚', 300, 36000, true, false, true, 10, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-soap', '石鹸', '個', '衛生', 60, 'MEDIUM', '2人に1個', 100, 6000, true, false, true, 25, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'p-toothbrush', '歯ブラシ', '本', '衛生', 120, 'MEDIUM', '1人1本', 20, 2400, true, false, true, 100, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 医薬品 (根据受伤人数8人调整)
(3, 'm-acetaminophen', '解熱鎮痛剤（アセトアミノフェン）20錠', '箱', '医薬品', 12, 'HIGH', '3人に1箱', 25, 300, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'm-ibuprofen', '解熱鎮痛剤（イブプロフェン）24錠', '箱', '医薬品', 12, 'HIGH', '3人に1箱', 28, 336, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'm-cold-combo', '総合感冒薬（風邪薬）30錠', '箱', '医薬品', 8, 'MEDIUM', '5人に1箱', 40, 320, true, false, true, 75, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'm-antihistamine', '抗ヒスタミン薬（アレルギー薬）10錠', '箱', '医薬品', 6, 'LOW', '10人に1箱', 20, 120, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'm-anti-diarrhea', '下痢止め（ロペラミド等）12錠', '箱', '医薬品', 4, 'MEDIUM', '15人に1箱', 18, 72, true, false, true, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

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

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_needs_lists_updated_at BEFORE UPDATE ON needs_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_needs_list_items_updated_at BEFORE UPDATE ON needs_list_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
