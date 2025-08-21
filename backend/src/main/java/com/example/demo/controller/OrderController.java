package com.example.demo.controller;

import com.example.demo.dto.OrderDto;
import com.example.demo.dto.OrderItemDto;
import com.example.demo.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
@Tag(name = "注文管理", description = "注文関連のAPI")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 创建订单
    @PostMapping("/{userId}/{shelterId}")
    @Operation(summary = "注文作成", description = "新しい注文を作成します")
    public ResponseEntity<OrderDto> createOrder(
            @PathVariable Long userId,
            @PathVariable Long shelterId,
            @RequestBody String requestBody) {
        try {
            System.out.println("收到订单创建请求 - userId: " + userId + ", shelterId: " + shelterId);
            System.out.println("原始请求体: " + requestBody);
            
            // 手动解析JSON
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            OrderDto orderDto = mapper.readValue(requestBody, OrderDto.class);
            
            System.out.println("解析后的订单数据: " + orderDto);
            
            // 设置用户ID和避难所ID
            orderDto.setUserId(userId);
            orderDto.setShelterId(shelterId);
            
            // 生成订单号
            String orderNumber = "ORD-" + System.currentTimeMillis();
            orderDto.setOrderNumber(orderNumber);
            
            // 设置默认状态
            if (orderDto.getStatus() == null) {
                orderDto.setStatus("PENDING");
            }
            if (orderDto.getPaymentStatus() == null) {
                orderDto.setPaymentStatus("PENDING");
            }
            
            // 设置ID（模拟）
            orderDto.setId(System.currentTimeMillis());
            
            // 确保items字段不为null
            if (orderDto.getItems() == null) {
                orderDto.setItems(java.util.Collections.emptyList());
            }
            
            System.out.println("返回订单数据: " + orderDto);
            
            // 这里需要将OrderDto转换为Order实体并保存到数据库
            // 为了简化，这里返回一个模拟响应
            return ResponseEntity.ok().body(orderDto);
        } catch (Exception e) {
            System.err.println("订单创建错误: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取订单详情
    @GetMapping("/{orderId}")
    @Operation(summary = "注文詳細取得", description = "指定された注文の詳細を取得します")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        try {
            // 这里需要实现从OrderService获取订单并转换为OrderDto
            // 为了简化，这里返回一个模拟响应
            OrderDto orderDto = new OrderDto();
            orderDto.setId(orderId);
            orderDto.setOrderNumber("ORD-" + orderId);
            orderDto.setStatus("PENDING");
            return ResponseEntity.ok(orderDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取用户的订单列表
    @GetMapping("/user/{userId}")
    @Operation(summary = "ユーザーの注文一覧取得", description = "指定されたユーザーの注文一覧を取得します")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@PathVariable Long userId) {
        try {
            // 这里需要实现从OrderService获取用户订单并转换为OrderDto列表
            // 为了简化，这里返回一个模拟响应
            return ResponseEntity.ok(List.of());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 更新订单状态
    @PutMapping("/{orderId}/status")
    @Operation(summary = "注文状態更新", description = "指定された注文の状態を更新します")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        try {
            // 这里需要实现通过OrderService更新订单状态
            // 为了简化，这里返回一个模拟响应
            OrderDto orderDto = new OrderDto();
            orderDto.setId(orderId);
            orderDto.setStatus(status);
            return ResponseEntity.ok(orderDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取订单项目
    @GetMapping("/{orderId}/items")
    @Operation(summary = "注文アイテム取得", description = "指定された注文のアイテム一覧を取得します")
    public ResponseEntity<List<OrderItemDto>> getOrderItems(@PathVariable Long orderId) {
        try {
            // 这里需要实现从OrderService获取订单项目并转换为OrderItemDto列表
            // 为了简化，这里返回一个模拟响应
            return ResponseEntity.ok(List.of());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 添加订单项目
    @PostMapping("/{orderId}/items")
    @Operation(summary = "注文アイテム追加", description = "指定された注文にアイテムを追加します")
    public ResponseEntity<OrderItemDto> addOrderItem(
            @PathVariable Long orderId,
            @RequestBody OrderItemDto itemDto) {
        try {
            // 这里需要实现通过OrderService添加订单项目
            // 为了简化，这里返回一个模拟响应
            itemDto.setOrderId(orderId);
            return ResponseEntity.ok(itemDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取所有订单
    @GetMapping
    @Operation(summary = "全注文取得", description = "全ての注文を取得します")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        try {
            // 这里需要实现从OrderService获取所有订单并转换为OrderDto列表
            // 为了简化，这里返回一个模拟响应
            return ResponseEntity.ok(List.of());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 根据状态获取订单
    @GetMapping("/status/{status}")
    @Operation(summary = "状態別注文取得", description = "指定された状態の注文一覧を取得します")
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(@PathVariable String status) {
        try {
            // 这里需要实现从OrderService根据状态获取订单并转换为OrderDto列表
            // 为了简化，这里返回一个模拟响应
            return ResponseEntity.ok(List.of());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
