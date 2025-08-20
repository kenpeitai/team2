# 数据库字段说明文档

## 数据库概述
- **数据库类型**: SQLite
- **数据库文件**: `demo.db`
- **位置**: `backend/demo.db`

---

## 支援人侧新增表结构

### 1. carts 表（购物车表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增ID |
| user_id | INTEGER | 用户ID，外键 |
| shelter_id | INTEGER | 避难所ID，外键 |
| is_active | BOOLEAN | 是否激活，默认TRUE |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 2. cart_items 表（购物车明细表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增ID |
| cart_id | INTEGER | 购物车ID，外键 |
| product_id | VARCHAR(100) | 产品ID |
| product_name | VARCHAR(200) | 产品名称 |
| unit | VARCHAR(50) | 单位 |
| category | VARCHAR(50) | 分类 |
| quantity | INTEGER | 数量，默认1 |
| price_per_unit | REAL | 单价 |
| total_price | REAL | 总价 |
| notes | TEXT | 备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 3. orders 表（订单头表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增ID |
| order_number | VARCHAR(50) | 订单号，唯一 |
| user_id | INTEGER | 用户ID，外键 |
| shelter_id | INTEGER | 避难所ID，外键 |
| order_status | VARCHAR(20) | 订单状态，默认PENDING |
| total_amount | REAL | 订单总金额 |
| shipping_address | TEXT | 配送地址 |
| contact_phone | VARCHAR(20) | 联系电话 |
| contact_email | VARCHAR(100) | 联系邮箱 |
| estimated_delivery_date | DATE | 预计送达日期 |
| actual_delivery_date | DATE | 实际送达日期 |
| notes | TEXT | 备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 4. order_items 表（订单明细表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增ID |
| order_id | INTEGER | 订单ID，外键 |
| product_id | VARCHAR(100) | 产品ID |
| product_name | VARCHAR(200) | 产品名称 |
| unit | VARCHAR(50) | 单位 |
| category | VARCHAR(50) | 分类 |
| quantity | INTEGER | 数量 |
| price_per_unit | REAL | 单价 |
| total_price | REAL | 总价 |
| notes | TEXT | 备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 5. payments 表（支付记录表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增ID |
| order_id | INTEGER | 订单ID，外键 |
| payment_method | VARCHAR(50) | 支付方式 |
| payment_status | VARCHAR(20) | 支付状态，默认PENDING |
| amount | REAL | 支付金额 |
| transaction_id | VARCHAR(100) | 交易ID |
| payment_date | TIMESTAMP | 支付时间 |
| receipt_url | VARCHAR(500) | 收据URL |
| notes | TEXT | 备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 枚举值说明

### 订单状态 (order_status)
- **PENDING**: 待处理
- **CONFIRMED**: 已确认
- **SHIPPED**: 已发货
- **DELIVERED**: 已送达
- **CANCELLED**: 已取消

### 支付方式 (payment_method)
- **CASH**: 现金
- **BANK_TRANSFER**: 银行转账
- **CREDIT_CARD**: 信用卡
- **DIGITAL_WALLET**: 电子钱包

### 支付状态 (payment_status)
- **PENDING**: 待支付
- **COMPLETED**: 已完成
- **FAILED**: 支付失败
- **REFUNDED**: 已退款
