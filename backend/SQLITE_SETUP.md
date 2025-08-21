# SQLite 数据库配置说明

## 概述

本项目支持两种数据库环境：
- **本地开发环境**: 使用 SQLite 数据库
- **Docker生产环境**: 使用 PostgreSQL 数据库

## SQLite 配置

### 1. 数据库文件位置

SQLite 数据库文件会在应用启动时自动创建在以下位置：
- 项目根目录: `./demo.db`
- 或者 backend 目录: `./backend/demo.db`

### 2. 配置文件

- **主配置**: `src/main/resources/application.yml`
- **SQLite初始化脚本**: `src/main/resources/init-sqlite.sql`
- **数据初始化**: `src/main/resources/data.sql`

### 3. 数据库迁移

项目使用 Flyway 进行数据库迁移，迁移脚本位于：
`src/main/resources/db/migration/`

所有迁移脚本都已经适配 SQLite 语法。

### 4. SQLite 特定配置

#### PRAGMA 设置
- `foreign_keys = ON`: 启用外键约束
- `journal_mode = WAL`: 使用 WAL 模式提高并发性能
- `synchronous = NORMAL`: 设置同步模式
- `cache_size = 10000`: 设置缓存大小
- `temp_store = MEMORY`: 临时存储使用内存

#### 触发器
自动创建 `updated_at` 字段的触发器，确保记录更新时间。

### 5. 启动应用

```bash
# 从项目根目录启动
cd backend
./gradlew bootRun

# 或者使用 IDE 启动 DemoApplication.java
```

### 6. 数据库可视化工具

推荐使用以下工具查看 SQLite 数据库：

#### DB Browser for SQLite (推荐)
- 下载: https://sqlitebrowser.org/
- 功能完整，界面友好
- 支持浏览数据、执行SQL、设计表结构

#### DBeaver Community
- 下载: https://dbeaver.io/download/
- 支持多种数据库
- 功能丰富，适合专业开发

#### SQLite Studio
- 下载: https://sqlitestudio.pl/
- 轻量级，专门为 SQLite 设计

### 7. 连接字符串

在可视化工具中使用以下连接字符串：
```
jdbc:sqlite:./demo.db
```

### 8. 注意事项

1. **并发限制**: SQLite 是文件型数据库，并发写入有限制
2. **性能**: 适合开发和小型应用，生产环境建议使用 PostgreSQL
3. **备份**: 直接复制 `.db` 文件即可备份
4. **迁移**: 可以使用工具将 SQLite 数据迁移到 PostgreSQL

### 9. 故障排除

#### 数据库文件未创建
- 确保应用成功启动
- 检查日志中的错误信息
- 确认 Flyway 迁移成功执行

#### 连接失败
- 检查数据库文件路径
- 确认文件权限
- 验证 JDBC 驱动版本

#### 触发器创建失败
- 检查 `init-sqlite.sql` 文件是否存在
- 查看应用启动日志
- 触发器已存在时会忽略错误

### 10. 开发建议

1. **数据备份**: 定期备份 `demo.db` 文件
2. **版本控制**: 不要将数据库文件提交到 Git
3. **测试数据**: 使用 `data.sql` 插入测试数据
4. **迁移测试**: 在修改表结构前测试迁移脚本

## 与 PostgreSQL 的差异

| 特性 | SQLite | PostgreSQL |
|------|--------|------------|
| 自增主键 | `AUTOINCREMENT` | `SERIAL` 或 `GENERATED ALWAYS AS IDENTITY` |
| 插入忽略 | `INSERT OR IGNORE` | `INSERT ... ON CONFLICT DO NOTHING` |
| 布尔类型 | `BOOLEAN` (存储为整数) | `BOOLEAN` |
| 时间戳 | `CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` |
| 触发器语法 | SQLite 特定语法 | PostgreSQL 特定语法 |

## 相关文件

- `SQLiteConfig.java`: SQLite 配置类
- `init-sqlite.sql`: SQLite 初始化脚本
- `data.sql`: 测试数据插入脚本
- `db/migration/*.sql`: 数据库迁移脚本
