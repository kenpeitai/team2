-- 支援人侧テーブル作成

<<<<<<< HEAD
-- 购物车表（按用户×避难所）
=======
-- ショッピングカートテーブル（ユーザー×避難所別）
>>>>>>> 3cf50a2829b89b75f4d6496363b425efe23a328f
CREATE TABLE carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    shelter_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, shelter_id)
);

<<<<<<< HEAD
-- 购物车明细表
=======
-- ショッピングカート明細テーブル
>>>>>>> 3cf50a2829b89b75f4d6496363b425efe23a328f
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_per_unit REAL,
    total_price REAL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id)
);

<<<<<<< HEAD
-- 订单头表
=======
-- 注文ヘッダーテーブル
>>>>>>> 3cf50a2829b89b75f4d6496363b425efe23a328f
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    shelter_id INTEGER NOT NULL,
    order_status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    total_amount REAL NOT NULL,
    shipping_address TEXT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shelter_id) REFERENCES shelters(id)
);

<<<<<<< HEAD
-- 订单明细表
=======
-- 注文明細テーブル
>>>>>>> 3cf50a2829b89b75f4d6496363b425efe23a328f
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit REAL NOT NULL,
    total_price REAL NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

<<<<<<< HEAD
-- 支付记录表
=======
-- 支払い記録テーブル
>>>>>>> 3cf50a2829b89b75f4d6496363b425efe23a328f
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- CASH, BANK_TRANSFER, CREDIT_CARD, DIGITAL_WALLET
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
    amount REAL NOT NULL,
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP,
    receipt_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- インデックス作成
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_shelter_id ON carts(shelter_id);
CREATE INDEX idx_carts_user_shelter ON carts(user_id, shelter_id);
CREATE INDEX idx_carts_is_active ON carts(is_active);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_shelter_id ON orders(shelter_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_payment_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
