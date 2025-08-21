-- ユーザーテーブルからusernameフィールドを削除
ALTER TABLE users DROP COLUMN username;

-- username関連のインデックスを削除
DROP INDEX IF EXISTS idx_users_username;
