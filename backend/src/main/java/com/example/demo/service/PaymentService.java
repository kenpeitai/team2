package com.example.demo.service;

import com.example.demo.dto.PaymentDto;
import com.example.demo.entity.Payment;
import com.example.demo.entity.Order;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.OrderRepository;
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
    
    // 创建支付记录
    public PaymentDto createPayment(PaymentDto paymentDto) {
        // 验证订单是否存在
        Order order = orderRepository.findById(paymentDto.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("注文が見つかりません: " + paymentDto.getOrderId()));
        
        Payment payment = new Payment();
        payment.setOrderId(paymentDto.getOrderId());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        payment.setPaymentStatus("PENDING");
        payment.setAmount(paymentDto.getAmount());
        payment.setTransactionId(generateTransactionId());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setReceiptUrl(paymentDto.getReceiptUrl());
        payment.setNotes(paymentDto.getNotes());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        payment = paymentRepository.save(payment);
        
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
