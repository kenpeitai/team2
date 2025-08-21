package com.example.demo.controller;

import com.example.demo.dto.OrderDto;
import com.example.demo.dto.OrderItemDto;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
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
            @RequestBody OrderDto orderDto) {
        try {
            System.out.println("收到订单创建请求 - userId: " + userId + ", shelterId: " + shelterId);
            System.out.println("订单数据: " + orderDto);
            
            // 设置用户ID和避难所ID
            orderDto.setUserId(userId);
            orderDto.setShelterId(shelterId);
            
            // 生成订单号
            String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + 
                java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            orderDto.setOrderNumber(orderNumber);
            
            // 设置默认状态
            if (orderDto.getStatus() == null) {
                orderDto.setStatus("PENDING");
            }
            if (orderDto.getPaymentStatus() == null) {
                orderDto.setPaymentStatus("PENDING");
            }
            
            // 转换为Order实体
            Order order = new Order();
            order.setOrderNumber(orderDto.getOrderNumber());
            order.setUserId(orderDto.getUserId());
            order.setShelterId(orderDto.getShelterId());
            order.setStatus(orderDto.getStatus());
            order.setOrderStatus(orderDto.getStatus());
            order.setPaymentStatus(orderDto.getPaymentStatus());
            order.setTotalAmount(orderDto.getTotalAmount());
            order.setShippingAddress(orderDto.getShippingAddress());
            order.setContactPhone(orderDto.getContactPhone());
            order.setContactEmail(orderDto.getContactEmail());
            order.setNotes(orderDto.getNotes());
            order.setCreatedAt(java.time.LocalDateTime.now());
            order.setUpdatedAt(java.time.LocalDateTime.now());
            
            // 保存订单
            Order savedOrder = orderService.createOrder(order);
            System.out.println("订单保存成功，ID: " + savedOrder.getId());
            
            // 保存订单项目
            if (orderDto.getItems() != null && !orderDto.getItems().isEmpty()) {
                for (OrderItemDto itemDto : orderDto.getItems()) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrderId(savedOrder.getId());
                    orderItem.setProductId(itemDto.getProductId());
                    orderItem.setProductName(itemDto.getProductName());
                    orderItem.setUnit(itemDto.getUnit());
                    orderItem.setCategory(itemDto.getCategory());
                    orderItem.setQuantity(itemDto.getQuantity());
                    orderItem.setPricePerUnit(itemDto.getPricePerUnit());
                    orderItem.setTotalPrice(itemDto.getTotalPrice());
                    orderItem.setNotes(itemDto.getNotes());
                    orderItem.setCreatedAt(java.time.LocalDateTime.now());
                    orderItem.setUpdatedAt(java.time.LocalDateTime.now());
                    
                    orderService.addOrderItem(savedOrder.getId(), orderItem);
                }
                System.out.println("订单项目保存成功，共 " + orderDto.getItems().size() + " 个项目");
            }
            
            // 转换为OrderDto返回
            OrderDto resultDto = new OrderDto();
            resultDto.setId(savedOrder.getId());
            resultDto.setOrderNumber(savedOrder.getOrderNumber());
            resultDto.setUserId(savedOrder.getUserId());
            resultDto.setShelterId(savedOrder.getShelterId());
            resultDto.setStatus(savedOrder.getOrderStatus());
            resultDto.setPaymentStatus(savedOrder.getPaymentStatus());
            resultDto.setTotalAmount(savedOrder.getTotalAmount());
            resultDto.setShippingAddress(savedOrder.getShippingAddress());
            resultDto.setContactPhone(savedOrder.getContactPhone());
            resultDto.setContactEmail(savedOrder.getContactEmail());
            resultDto.setNotes(savedOrder.getNotes());
            resultDto.setCreatedAt(savedOrder.getCreatedAt());
            resultDto.setUpdatedAt(savedOrder.getUpdatedAt());
            
            System.out.println("返回订单数据: " + resultDto);
            
            return ResponseEntity.ok().body(resultDto);
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
            System.out.println("收到订单状态更新请求 - orderId: " + orderId + ", status: " + status);
            
            // 调用OrderService更新订单状态
            Order updatedOrder = orderService.updateOrderStatus(orderId, status);
            
            // 转换为OrderDto
            OrderDto orderDto = new OrderDto();
            orderDto.setId(updatedOrder.getId());
            orderDto.setOrderNumber(updatedOrder.getOrderNumber());
            orderDto.setUserId(updatedOrder.getUserId());
            orderDto.setShelterId(updatedOrder.getShelterId());
            orderDto.setStatus(updatedOrder.getOrderStatus());
            orderDto.setPaymentStatus(updatedOrder.getPaymentStatus());
            orderDto.setTotalAmount(updatedOrder.getTotalAmount());
            orderDto.setShippingAddress(updatedOrder.getShippingAddress());
            orderDto.setContactPhone(updatedOrder.getContactPhone());
            orderDto.setContactEmail(updatedOrder.getContactEmail());
            orderDto.setNotes(updatedOrder.getNotes());
            orderDto.setCreatedAt(updatedOrder.getCreatedAt());
            orderDto.setUpdatedAt(updatedOrder.getUpdatedAt());
            
            System.out.println("订单状态更新成功 - orderId: " + orderId + ", newStatus: " + updatedOrder.getOrderStatus());
            
            return ResponseEntity.ok(orderDto);
        } catch (Exception e) {
            System.err.println("订单状态更新错误: " + e.getMessage());
            e.printStackTrace();
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
