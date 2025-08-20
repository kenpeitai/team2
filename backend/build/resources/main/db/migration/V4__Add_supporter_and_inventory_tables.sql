-- 支援者テーブルに新フィールドを追加
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN card_number VARCHAR(20);
ALTER TABLE users ADD COLUMN card_expiry VARCHAR(10);
ALTER TABLE users ADD COLUMN card_cvc VARCHAR(10);

-- 在庫管理テーブル
CREATE TABLE inventories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shelter_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (shelter_id) REFERENCES shelters(id)
);

-- 在庫管理テーブルのインデックス
CREATE INDEX idx_inventories_shelter_id ON inventories(shelter_id);
CREATE INDEX idx_inventories_category ON inventories(category);

-- 避難所状況テーブル
CREATE TABLE shelter_statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shelter_id INTEGER NOT NULL,
    evacuee_count INTEGER NOT NULL DEFAULT 0,
    injured_count INTEGER NOT NULL DEFAULT 0,
    electricity_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
    gas_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
    water_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
    traffic_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (shelter_id) REFERENCES shelters(id)
);

-- 避難所状況テーブルのインデックス
CREATE INDEX idx_shelter_statuses_shelter_id ON shelter_statuses(shelter_id);
CREATE INDEX idx_shelter_statuses_created_at ON shelter_statuses(created_at);

-- サンプル在庫データ挿入（前端のdefaultItemsに基づく）
INSERT INTO inventories (shelter_id, name, quantity, category, created_at, updated_at) VALUES
(1, '水', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '緑茶', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '麦茶', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'アクエリアス', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'ポカリスエット', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '牛乳', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '紅茶', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'コーヒー', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'スポーツドリンク', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'ジュース', 0, '水・飲料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'カップラーメン', 0, '食料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '乾パン', 0, '食料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'おにぎり', 0, '食料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '缶詰（魚）', 0, '食料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '缶詰（肉）', 0, '食料', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '包帯', 0, '医療・衛生', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '消毒液', 0, '医療・衛生', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '絆創膏', 0, '医療・衛生', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'マスク', 0, '医療・衛生', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '毛布', 0, '衣類・寝具', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '防寒着', 0, '衣類・寝具', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'レインコート', 0, '衣類・寝具', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '懐中電灯', 0, '避難用品', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '電池', 0, '避難用品', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'ラジオ', 0, '避難用品', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '鍋', 0, '調理器具・食器', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'フライパン', 0, '調理器具・食器', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'お皿', 0, '調理器具・食器', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '軍手', 0, '便利品', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'カッターナイフ', 0, '便利品', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'メモ帳', 0, '便利品', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'ペン', 0, '便利品', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
