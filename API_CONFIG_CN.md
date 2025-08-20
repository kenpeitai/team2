# 🌐 API配置说明

## 🔍 **问题描述**

当前配置中，前端容器无法正确调用后端API，因为：
- 前端容器中的`localhost:8080`指向容器内部
- 不是指向宿主机（你的电脑）的8080端口

## 🔧 **解决方案**

### **方案1：使用host.docker.internal（推荐）**

我已经在`compose.yaml`中配置了：
```yaml
frontend:
  environment:
    - REACT_APP_API_URL=http://host.docker.internal:8080
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

**`host.docker.internal`** 是Docker的特殊域名，指向宿主机。

### **方案2：使用宿主机IP地址**

1. **查看你的IP地址**
   ```bash
   # Linux/WSL
   ip addr show
   
   # Windows
   ipconfig
   ```

2. **修改compose.yaml**
   ```yaml
   frontend:
     environment:
       - REACT_APP_API_URL=http://你的IP:8080
   ```

### **方案3：前端不在Docker中运行**

如果前端遇到问题，可以让前端在宿主机上运行：

```bash
# 只启动后端和数据库
docker-compose up backend database

# 前端在宿主机上运行
cd frontend
npm install
npm start
```

## 📱 **不同环境的配置**

### **本地开发（推荐）**
```bash
# 后端用Docker
docker-compose up backend database

# 前端用本地
cd frontend
npm start
```

### **完全Docker环境**
```bash
# 启动所有服务
docker-compose up -d

# 前端端口：3000
# 前端API地址：http://host.docker.internal:8080
```

### **团队协作**
```bash
# 每个成员启动自己的Docker环境
docker-compose up -d

# 前端会自动连接到正确的后端API
```

## 🔍 **测试API连接**

### **检查后端是否可访问**
```bash
# 在宿主机上测试
curl http://localhost:8080/api/health

# 在Docker容器中测试
docker exec -it team2_frontend_1 curl http://host.docker.internal:8080/api/health
```

### **检查前端环境变量**
```bash
# 查看前端容器的环境变量
docker exec -it team2_frontend_1 env | grep REACT_APP_API_URL
```

## 🚀 **推荐配置**

**对于团队开发，推荐使用：**

1. **后端和数据库**：Docker运行
2. **前端**：宿主机运行（避免跨容器通信问题）

```bash
# 启动后端服务
docker-compose up backend database

# 启动前端（新终端）
cd frontend
npm start
```

这样前端直接访问`http://localhost:8080`，不会有任何问题！

## 📋 **端口配置**

- **前端端口**：3000
- **后端端口**：8080
- **数据库端口**：5432

## ❓ **还有问题？**

如果前端仍然无法调用API，请检查：
1. 后端服务是否正常运行
2. 端口8080是否被占用
3. 防火墙设置
4. 网络配置

**现在重新启动项目试试看！** 🚀
