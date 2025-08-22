-- 修复username字段的约束问题
-- 如果username字段存在且有NOT NULL约束，将其设为可空或删除
-- PostgreSQL语法
DO $$
BEGIN
    -- 检查username字段是否存在
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'username'
    ) THEN
        -- 如果存在，删除该字段
        ALTER TABLE users DROP COLUMN IF EXISTS username;
    END IF;
END $$;

-- 删除username相关的索引（如果存在）
DROP INDEX IF EXISTS idx_users_username;
