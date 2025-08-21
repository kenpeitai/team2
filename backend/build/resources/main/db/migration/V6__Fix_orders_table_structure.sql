-- 修复orders表结构，添加缺失的字段
ALTER TABLE orders ADD COLUMN order_status VARCHAR(20) NOT NULL DEFAULT 'PENDING';

-- 更新现有记录的order_status字段
UPDATE orders SET order_status = status WHERE order_status IS NULL;
