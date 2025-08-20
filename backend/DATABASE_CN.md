1. users 表（用户表）
字段名	类型	说明
id	INTEGER	主键，自增ID
username	VARCHAR(50)	用户名，唯一
email	VARCHAR(255)	邮箱，唯一
password	VARCHAR(255)	密码
full_name	VARCHAR(100)	全名
role	VARCHAR(255)	角色：USER/ADMIN/MODERATOR
is_active	BOOLEAN	是否激活
created_at	TIMESTAMP	创建时间
updated_at	TIMESTAMP	更新时间
让我直接查看SQL文件来获取表结构：
2. shelters 表（避难所表）
字段名	类型	说明
id	INTEGER	主键，自增ID
shelter_name	VARCHAR(100)	避难所名称，唯一
shelter_address	VARCHAR(200)	避难所地址
representative_last_name	VARCHAR(50)	负责人姓
representative_first_name	VARCHAR(50)	负责人名
phone_number	VARCHAR(20)	电话号码
email	VARCHAR(100)	邮箱，唯一
password	VARCHAR(255)	密码
evacuee_count	INTEGER	避难者人数，默认0
injured_count	INTEGER	受伤者人数，默认0
electricity_status	VARCHAR(20)	电力状态：AVAILABLE/UNAVAILABLE
gas_status	VARCHAR(20)	燃气状态：AVAILABLE/UNAVAILABLE
water_status	VARCHAR(20)	供水状态：AVAILABLE/UNAVAILABLE
traffic_status	VARCHAR(20)	交通状态：NORMAL/RESTRICTED/CLOSED
is_active	BOOLEAN	是否激活，默认1
created_at	TIMESTAMP	创建时间
updated_at	TIMESTAMP	更新时间
3. products 表（产品表）
字段名	类型	说明
id	INTEGER	主键，自增ID
product_id	VARCHAR(100)	产品ID，唯一
name	VARCHAR(200)	产品名称
unit	VARCHAR(50)	单位
weight_grams	INTEGER	重量（克）
recommended_per_person_per_day	REAL	每人每天推荐量
image_url	VARCHAR(500)	图片URL
image_verified	BOOLEAN	图片是否验证，默认FALSE
category	VARCHAR(50)	分类：医薬品/衛生/食料/生活用品
is_active	BOOLEAN	是否激活，默认TRUE
created_at	TIMESTAMP	创建时间
updated_at	TIMESTAMP	更新时间
4. needs_lists 表（需求列表表）
字段名	类型	说明
id	INTEGER	主键，自增ID
shelter_id	INTEGER	避难所ID
evacuee_count	INTEGER	避难者人数
target_days	INTEGER	目标天数
total_units	INTEGER	总单位数
total_weight_grams	INTEGER	总重量（克）
water_cases	INTEGER	水箱数量
is_active	BOOLEAN	是否激活，默认TRUE
created_at	TIMESTAMP	创建时间
updated_at	TIMESTAMP	更新时间
5. needs_list_items 表（需求列表项目表）
字段名	类型	说明
id	INTEGER	主键，自增ID
needs_list_id	INTEGER	需求列表ID，外键
product_id	VARCHAR(100)	产品ID
product_name	VARCHAR(200)	产品名称
unit	VARCHAR(50)	单位
category	VARCHAR(50)	分类
quantity	INTEGER	数量
priority	VARCHAR(20)	优先级：high/medium/low
notes	TEXT	备注
per_unit_weight_grams	INTEGER	每单位重量（克）
total_weight_grams	INTEGER	总重量（克）
drone_eligible	BOOLEAN	是否适合无人机运输
drone_eligible_whole_order	BOOLEAN	整个订单是否适合无人机
drone_per_unit_eligible	BOOLEAN	每单位是否适合无人机
drone_units_per_flight	INTEGER	每次飞行可载单位数
drone_flights_required	INTEGER	所需飞行次数
created_at	TIMESTAMP	创建时间
updated_at	TIMESTAMP	更新时间
6. flyway_schema_history 表（数据库迁移历史表）
这是Flyway框架自动生成的表，用于记录数据库版本迁移历史，通常不需要手动操作。
枚举值说明：
角色 (role): USER（一般用户）、ADMIN（管理员）、MODERATOR（版主）
优先级 (priority): high（高）、medium（中）、low（低）
分类 (category): 医薬品、衛生、食料、生活用品
状态字段:
电力/燃气/供水状态: AVAILABLE（可用）、UNAVAILABLE（不可用）
交通状态: NORMAL（正常）、RESTRICTED（限制）、CLOSED（封闭）


