-- 商品テーブル
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    weight_grams INTEGER NOT NULL,
    recommended_per_person_per_day REAL,
    image_url VARCHAR(500),
    image_verified BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 必要物資リストテーブル
CREATE TABLE needs_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shelter_id INTEGER,
    evacuee_count INTEGER NOT NULL,
    target_days INTEGER NOT NULL,
    total_units INTEGER,
    total_weight_grams INTEGER,
    water_cases INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 必要物資リスト明細テーブル
CREATE TABLE needs_list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    needs_list_id INTEGER NOT NULL,
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
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (needs_list_id) REFERENCES needs_lists(id)
);

-- インデックス作成
CREATE INDEX idx_products_product_id ON products(product_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_needs_lists_shelter_id ON needs_lists(shelter_id);
CREATE INDEX idx_needs_lists_is_active ON needs_lists(is_active);
CREATE INDEX idx_needs_list_items_needs_list_id ON needs_list_items(needs_list_id);
CREATE INDEX idx_needs_list_items_product_id ON needs_list_items(product_id);

-- サンプルデータ挿入（前端のDEFAULT_CATALOGに基づく）
INSERT INTO products (product_id, name, unit, weight_grams, category, is_active, created_at, updated_at) VALUES
('p-water-2l', '飲料水 2L×6本（1ケース）', 'ケース', 12000, '食料', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-instant-rice', 'サトウのごはん 200g×5食', '箱', 1000, '食料', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-canned-food', '缶詰(主食) 1缶', '缶', 350, '食料', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-blanket', '毛布', '枚', 800, '生活用品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-battery-aa', '単3電池(8本)', 'パック', 180, '生活用品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p-mask', '不織布マスク(50枚)', '箱', 200, '衛生', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-acetaminophen', '解熱鎮痛剤（アセトアミノフェン）20錠', '箱', 25, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-ibuprofen', '解熱鎮痛剤（イブプロフェン）24錠', '箱', 28, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-cold-combo', '総合感冒薬（風邪薬）30錠', '箱', 40, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-antihistamine', '抗ヒスタミン薬（アレルギー薬）10錠', '箱', 20, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-anti-diarrhea', '下痢止め（ロペラミド等）12錠', '箱', 18, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-ors-500', '経口補水液 500mL（1本）', '本', 500, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-povidone', '消毒液（ポビドンヨード）100mL', '本', 120, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-sterile-gauze', '滅菌ガーゼ 10枚入', '袋', 50, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-bandage-roll', '包帯 5cm×5m', '巻', 30, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-surgical-tape', 'サージカルテープ 12mm×9m', '巻', 25, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-bandaids', 'ばんそうこう（アソート20枚）', '箱', 80, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-thermometer', '体温計', '本', 50, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-eyedrops', '目薬（人工涙液）', '本', 20, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-cough-syrup', '咳止めシロップ 120mL', '本', 160, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('m-throat-candy', 'のど飴', '袋', 80, '医薬品', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
