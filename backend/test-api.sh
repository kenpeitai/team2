#!/bin/bash

echo "等待应用程序启动..."
sleep 10

echo "测试健康检查接口..."
curl -s http://localhost:8080/api/health | jq . 2>/dev/null || curl -s http://localhost:8080/api/health

echo -e "\n\n测试用户API接口..."
echo "创建用户..."
curl -s -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456","fullName":"Test User"}' | jq . 2>/dev/null || curl -s -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456","fullName":"Test User"}'

echo -e "\n\n获取所有用户..."
curl -s http://localhost:8080/api/users | jq . 2>/dev/null || curl -s http://localhost:8080/api/users

echo -e "\n\n测试完成！"
