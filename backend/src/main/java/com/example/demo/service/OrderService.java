package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // 创建订单
    public Order createOrder(Order order) {
        // 验证用户是否存在
        User user = userRepository.findById(order.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + order.getUserId()));
        
        order.setOrderStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        return orderRepository.save(order);
    }
    
    // 更新订单状态
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("注文が見つかりません: " + orderId));
        
        order.setOrderStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        
        return orderRepository.save(order);
    }
    
    // 根据ID获取订单
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("注文が見つかりません: " + id));
    }
    
    // 根据用户获取订单
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    // 根据状态获取订单
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findAll().stream()
            .filter(order -> order.getOrderStatus().equals(status))
            .toList();
    }
    
    // 获取所有订单
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    // 添加订单项目
    public OrderItem addOrderItem(Long orderId, OrderItem item) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("注文が見つかりません: " + orderId));
        
        item.setOrderId(orderId);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        
        return orderItemRepository.save(item);
    }
    
    // 更新订单项目
    public OrderItem updateOrderItem(Long itemId, OrderItem itemDetails) {
        OrderItem item = orderItemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("注文アイテムが見つかりません: " + itemId));
        
        item.setProductId(itemDetails.getProductId());
        item.setProductName(itemDetails.getProductName());
        item.setQuantity(itemDetails.getQuantity());
        item.setUnitPrice(itemDetails.getUnitPrice());
        item.setTotalPrice(itemDetails.getTotalPrice());
        item.setUpdatedAt(LocalDateTime.now());
        
        return orderItemRepository.save(item);
    }
    
    // 删除订单项目
    public void deleteOrderItem(Long itemId) {
        OrderItem item = orderItemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("注文アイテムが見つかりません: " + itemId));
        
        orderItemRepository.delete(item);
    }
    
    // 根据订单获取所有项目
    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
    
    // 计算订单总金额
    public Double calculateOrderTotal(Long orderId) {
        return orderItemRepository.findByOrderId(orderId).stream()
            .mapToDouble(item -> item.getTotalPrice() != null ? item.getTotalPrice() : 0.0)
            .sum();
    }
    
    // 计算订单总数量
    public Integer calculateOrderTotalQuantity(Long orderId) {
        return orderItemRepository.findByOrderId(orderId).stream()
            .mapToInt(item -> item.getQuantity() != null ? item.getQuantity() : 0)
            .sum();
    }
}
