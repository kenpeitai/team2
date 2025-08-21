package com.example.demo.service;

import com.example.demo.dto.PaymentDto;
import com.example.demo.entity.Payment;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.NeedsListItem;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.NeedsListItemRepository;
import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private NeedsListItemRepository needsListItemRepository;
    
    // 创建支付记录
    public PaymentDto createPayment(PaymentDto paymentDto) {
        System.out.println("PaymentService.createPayment - 开始处理支付记录: " + paymentDto);
        
        // 验证订单是否存在
        System.out.println("PaymentService.createPayment - 验证订单ID: " + paymentDto.getOrderId());
        Order order = orderRepository.findById(paymentDto.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("注文が見つかりません: " + paymentDto.getOrderId()));
        
        System.out.println("PaymentService.createPayment - 订单验证成功: " + order);
        
        Payment payment = new Payment();
        payment.setOrderId(paymentDto.getOrderId());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        // 使用前端传递的支付状态，如果没有则默认为PENDING
        payment.setPaymentStatus(paymentDto.getPaymentStatus() != null ? paymentDto.getPaymentStatus() : "PENDING");
        payment.setAmount(paymentDto.getAmount());
        payment.setTransactionId(generateTransactionId());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setReceiptUrl(paymentDto.getReceiptUrl());
        payment.setNotes(paymentDto.getNotes());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        System.out.println("PaymentService.createPayment - 准备保存支付记录: " + payment);
        payment = paymentRepository.save(payment);
        System.out.println("PaymentService.createPayment - 支付记录保存成功，ID: " + payment.getId());
        
        return convertToPaymentDto(payment);
    }
    
    // 处理支付
    public PaymentDto processPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("支払いが見つかりません: " + paymentId));
        
        // 模拟支付处理逻辑
        payment.setPaymentStatus("COMPLETED");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        payment = paymentRepository.save(payment);
        
        // 支付完成后更新需求清单
        updateNeedsListAfterPayment(payment.getOrderId());
        
        return convertToPaymentDto(payment);
    }
    
    // 更新支付状态
    public PaymentDto updatePaymentStatus(Long paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("支払いが見つかりません: " + paymentId));
        
        payment.setPaymentStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());
        
        if ("COMPLETED".equals(status)) {
            payment.setPaymentDate(LocalDateTime.now());
            // 支付完成后更新需求清单
            updateNeedsListAfterPayment(payment.getOrderId());
        }
        
        payment = paymentRepository.save(payment);
        
        return convertToPaymentDto(payment);
    }
    
    // 获取支付记录
    public PaymentDto getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("支払いが見つかりません: " + paymentId));
        
        return convertToPaymentDto(payment);
    }
    
    // 根据订单ID获取支付记录
    public List<PaymentDto> getPaymentsByOrderId(Long orderId) {
        List<Payment> payments = paymentRepository.findByOrderId(orderId);
        
        return payments.stream()
            .map(this::convertToPaymentDto)
            .collect(Collectors.toList());
    }
    
    // 根据用户ID获取支付记录
    public List<PaymentDto> getPaymentsByUserId(Long userId) {
        List<Payment> payments = paymentRepository.findByUserId(userId);
        
        return payments.stream()
            .map(this::convertToPaymentDto)
            .collect(Collectors.toList());
    }
    
    // 根据支付状态获取支付记录
    public List<PaymentDto> getPaymentsByStatus(String status) {
        List<Payment> payments = paymentRepository.findByPaymentStatus(status);
        
        return payments.stream()
            .map(this::convertToPaymentDto)
            .collect(Collectors.toList());
    }
    
    // 获取所有支付记录
    public List<PaymentDto> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        
        return payments.stream()
            .map(this::convertToPaymentDto)
            .collect(Collectors.toList());
    }
    
    // 计算订单的总支付金额
    public Double getTotalPaidAmount(Long orderId) {
        Double totalPaid = paymentRepository.sumCompletedPaymentsByOrderId(orderId);
        return totalPaid != null ? totalPaid : 0.0;
    }
    
    // 检查订单是否已完全支付
    public boolean isOrderFullyPaid(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("注文が見つかりません: " + orderId));
        
        Double totalPaid = getTotalPaidAmount(orderId);
        return totalPaid >= order.getTotalAmount();
    }
    
    // 支付完成后更新需求清单
    public void updateNeedsListAfterPayment(Long orderId) {
        try {
            System.out.println("PaymentService.updateNeedsListAfterPayment - 开始更新需求清单，订单ID: " + orderId);
            
            // 获取订单信息
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("注文が見つかりません: " + orderId));
            
            System.out.println("PaymentService.updateNeedsListAfterPayment - 订单信息: 避难所ID=" + order.getShelterId());
            
            // 获取订单中的所有商品
            List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
            System.out.println("PaymentService.updateNeedsListAfterPayment - 订单商品数量: " + orderItems.size());
            
            // 对每个订单商品，减少对应的需求清单项目数量
            for (OrderItem orderItem : orderItems) {
                String productId = orderItem.getProductId();
                Integer purchasedQuantity = orderItem.getQuantity();
                
                System.out.println("PaymentService.updateNeedsListAfterPayment - 处理商品: " + productId + ", 购买数量: " + purchasedQuantity);
                
                // 找到对应避难所的最新需求清单中的该商品
                List<NeedsListItem> needsListItems = needsListItemRepository
                    .findByProductIdAndShelterIdFromLatestNeedsList(productId, order.getShelterId());
                
                if (!needsListItems.isEmpty()) {
                    NeedsListItem needsListItem = needsListItems.get(0);
                    Integer currentQuantity = needsListItem.getQuantity();
                    Integer newQuantity = Math.max(0, currentQuantity - purchasedQuantity);
                    
                    System.out.println("PaymentService.updateNeedsListAfterPayment - 更新需求: " + productId + 
                        ", 原数量: " + currentQuantity + ", 新数量: " + newQuantity);
                    
                    needsListItem.setQuantity(newQuantity);
                    needsListItem.setUpdatedAt(LocalDateTime.now());
                    needsListItemRepository.save(needsListItem);
                } else {
                    System.out.println("PaymentService.updateNeedsListAfterPayment - 未找到对应的需求清单项目: " + productId);
                }
            }
            
            System.out.println("PaymentService.updateNeedsListAfterPayment - 需求清单更新完成");
            
        } catch (Exception e) {
            System.err.println("PaymentService.updateNeedsListAfterPayment - 更新需求清单时发生错误: " + e.getMessage());
            e.printStackTrace();
            // 不抛出异常，避免影响支付流程
        }
    }
    
    // 生成交易ID
    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    // 转换为PaymentDto
    private PaymentDto convertToPaymentDto(Payment payment) {
        return new PaymentDto(
            payment.getId(),
            payment.getOrderId(),
            payment.getPaymentMethod(),
            payment.getPaymentStatus(),
            payment.getAmount(),
            payment.getTransactionId(),
            payment.getPaymentDate(),
            payment.getReceiptUrl(),
            payment.getNotes(),
            payment.getCreatedAt(),
            payment.getUpdatedAt()
        );
    }
}
