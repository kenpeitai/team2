package com.example.demo.repository;

import com.example.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // 根据订单ID查找支付记录
    List<Payment> findByOrderId(Long orderId);
    
    // 根据支付状态查找支付记录
    List<Payment> findByPaymentStatus(String paymentStatus);
    
    // 根据支付方式查找支付记录
    List<Payment> findByPaymentMethod(String paymentMethod);
    
    // 根据交易ID查找支付记录
    Optional<Payment> findByTransactionId(String transactionId);
    
    // 根据用户ID查找支付记录（通过关联查询）
    @Query("SELECT p FROM Payment p JOIN p.order o WHERE o.userId = :userId")
    List<Payment> findByUserId(@Param("userId") Long userId);
    
    // 根据订单ID和支付状态查找支付记录
    List<Payment> findByOrderIdAndPaymentStatus(Long orderId, String paymentStatus);
    
    // 查找指定日期范围内的支付记录
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findByPaymentDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // 计算指定订单的总支付金额
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.orderId = :orderId AND p.paymentStatus = 'COMPLETED'")
    Double sumCompletedPaymentsByOrderId(@Param("orderId") Long orderId);
    
    // 查找待处理的支付记录
    List<Payment> findByPaymentStatusOrderByCreatedAtAsc(String paymentStatus);
}
