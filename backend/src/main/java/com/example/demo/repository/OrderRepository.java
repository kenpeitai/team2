package com.example.demo.repository;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserId(Long userId);
    
    List<Order> findByOrderStatus(String orderStatus);
    
    List<Order> findByUserIdAndOrderStatus(Long userId, String orderStatus);
    
    // 统计进行中的订单数量
    long countByUserIdAndStatusIn(Long userId, List<String> statuses);
    
    // 统计已完成的订单数量
    long countByUserIdAndStatus(Long userId, String status);
    
    // 计算总金额
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.userId = :userId AND o.status = :status")
    Double sumTotalAmountByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
    
    // 获取最新的进行中订单
    Optional<Order> findFirstByUserIdAndStatusInOrderByCreatedAtDesc(Long userId, List<String> statuses);
    
    // 获取已完成的订单（按时间倒序）
    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
    
    // 获取进行中的订单
    List<Order> findByUserIdAndStatusIn(Long userId, List<String> statuses);
}
