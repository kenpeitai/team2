-- SQLite数据库初始化脚本
-- 这个脚本用于本地开发环境，与Flyway迁移脚本配合使用

-- 设置时区（SQLite不支持时区设置，但可以记录）
-- PRAGMA timezone = 'Asia/Tokyo';

-- 启用外键约束
PRAGMA foreign_keys = ON;

-- 启用WAL模式以提高并发性能
PRAGMA journal_mode = WAL;

-- 设置同步模式
PRAGMA synchronous = NORMAL;

-- 设置缓存大小（以页为单位，每页4KB）
PRAGMA cache_size = 10000;

-- 设置临时存储位置
PRAGMA temp_store = MEMORY;

-- 注意：表结构由Flyway迁移脚本创建，这里只进行一些SQLite特定的配置
-- 如果需要手动创建表，可以参考db/migration目录下的脚本

-- 创建更新时间触发器（SQLite版本）
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
    AFTER UPDATE ON users
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_shelters_updated_at 
    AFTER UPDATE ON shelters
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE shelters SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- 为其他表也创建类似的触发器
CREATE TRIGGER IF NOT EXISTS update_products_updated_at 
    AFTER UPDATE ON products
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_needs_lists_updated_at 
    AFTER UPDATE ON needs_lists
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE needs_lists SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_needs_list_items_updated_at 
    AFTER UPDATE ON needs_list_items
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE needs_list_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_carts_updated_at 
    AFTER UPDATE ON carts
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_cart_items_updated_at 
    AFTER UPDATE ON cart_items
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE cart_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_orders_updated_at 
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_order_items_updated_at 
    AFTER UPDATE ON order_items
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE order_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_payments_updated_at 
    AFTER UPDATE ON payments
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE payments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_inventories_updated_at 
    AFTER UPDATE ON inventories
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE inventories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_shelter_statuses_updated_at 
    AFTER UPDATE ON shelter_statuses
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE shelter_statuses SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
