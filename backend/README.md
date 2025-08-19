# Spring Boot 后端 API

这是一个使用 Spring Boot 3.5.4 和 Java 21 开发的后端API项目。

## 技术栈

- **Java**: 21
- **Spring Boot**: 3.5.4
- **数据库**: SQLite
- **构建工具**: Gradle 9.0.0
- **API文档**: OpenAPI 3 (Swagger)
- **安全**: Spring Security
- **数据访问**: Spring Data JPA + Hibernate
- **数据库迁移**: Flyway

## 开发环境要求

- Java 21 或更高版本
- Gradle 9.0.0 或更高版本

## 快速开始

### 1. 启动应用程序

```bash
./gradlew bootRun
```

应用程序将在 http://localhost:8080 启动

### 2. 测试API

运行测试脚本：
```bash
./test-api.sh
```

### 3. 访问API文档

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

## 主要功能

### 用户管理 API

- `GET /api/users` - 获取所有用户
- `GET /api/users/{id}` - 根据ID获取用户
- `POST /api/users` - 创建新用户
- `PUT /api/users/{id}` - 更新用户
- `DELETE /api/users/{id}` - 删除用户
- `GET /api/users/search?keyword=xxx` - 搜索用户
- `GET /api/users/role/{role}` - 根据角色获取用户
- `GET /api/users/active` - 获取活跃用户

### 健康检查

- `GET /api/health` - 应用程序健康状态

## 项目结构

```
src/main/java/com/example/demo/
├── DemoApplication.java          # 主启动类
├── controller/                   # 控制器层
│   ├── UserController.java      # 用户API控制器
│   └── HealthController.java    # 健康检查控制器
├── service/                     # 服务层
│   └── UserService.java         # 用户业务逻辑
├── repository/                  # 数据访问层
│   └── UserRepository.java      # 用户数据访问接口
├── entity/                      # 实体类
│   ├── User.java               # 用户实体
│   └── UserRole.java           # 用户角色枚举
├── dto/                         # 数据传输对象
│   └── UserDto.java            # 用户DTO
├── config/                      # 配置类
│   └── SecurityConfig.java      # 安全配置
└── exception/                   # 异常处理
    └── GlobalExceptionHandler.java # 全局异常处理器
```

## 数据库

项目使用 SQLite 数据库，数据库文件将自动创建在项目根目录下的 `demo.db` 文件中。

## 构建和部署

### 构建项目

```bash
./gradlew build
```

### 运行测试

```bash
./gradlew test
```

### 创建可执行JAR

```bash
./gradlew bootJar
```

生成的JAR文件位于 `build/libs/` 目录中。

## Docker 支持

项目包含 Dockerfile，可以使用 Docker 构建和运行：

```bash
# 构建镜像
docker build -t demo-api .

# 运行容器
docker run -p 8080:8080 demo-api
```

## 开发建议

1. 使用 IDE（如 IntelliJ IDEA、VS Code）打开项目
2. 确保 Java 21 和 Gradle 已正确安装
3. 首次运行前确保端口 8080 未被占用
4. 查看控制台日志了解应用程序状态

## 故障排除

### 端口被占用
如果端口 8080 被占用，可以在 `application.yml` 中修改 `server.port` 配置。

### 数据库连接问题
确保项目目录有写入权限，SQLite 数据库文件会自动创建。

### 依赖下载问题
如果 Gradle 依赖下载失败，可以尝试：
```bash
./gradlew --refresh-dependencies build
```
