#!/bin/bash

echo "🔍 测试数据库连接和API..."

# 测试数据库健康检查
echo "📊 测试数据库健康检查..."
curl -s http://localhost:8080/api/health/database | jq '.'

echo -e "\n📊 测试系统健康检查..."
curl -s http://localhost:8080/api/health/system | jq '.'

echo -e "\n👥 测试用户API..."
echo "获取所有用户:"
curl -s http://localhost:8080/api/users | jq '.'

echo -e "\n🏠 测试避难所API..."
echo "获取所有避难所:"
curl -s http://localhost:8080/api/shelters | jq '.'

echo -e "\n🔐 测试认证API..."
echo "测试用户登录 (admin@example.com / password):"
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' | jq '.'

echo -e "\n✅ 数据库测试完成！"
