-- 避難所テーブル作成
CREATE TABLE shelters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- username関連のインデックスを削除
DROP INDEX IF EXISTS idx_users_username;

-- ユーザーテーブルからusernameフィールドを削除（SQLiteでは制約を削除してからカラムを削除）
-- 新しいテーブルを作成してデータを移行
CREATE TABLE users_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- データを移行
INSERT INTO users_new (id, email, password, full_name, role, is_active, created_at, updated_at)
SELECT id, email, password, full_name, role, is_active, created_at, updated_at FROM users;

-- 古いテーブルを削除
DROP TABLE users;

-- 新しいテーブルをリネーム
ALTER TABLE users_new RENAME TO users;

-- インデックスを再作成（V1で既に作成されているものは除外）
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- インデックス作成
CREATE INDEX idx_shelters_name ON shelters(shelter_name);
CREATE INDEX idx_shelters_address ON shelters(shelter_address);
CREATE INDEX idx_shelters_email ON shelters(email);
CREATE INDEX idx_shelters_representative ON shelters(representative_last_name, representative_first_name);
CREATE INDEX idx_shelters_evacuee_count ON shelters(evacuee_count);
CREATE INDEX idx_shelters_injured_count ON shelters(injured_count);
CREATE INDEX idx_shelters_is_active ON shelters(is_active);
CREATE INDEX idx_shelters_created_at ON shelters(created_at);
