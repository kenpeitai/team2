package com.example.demo.repository;

import com.example.demo.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    // 根据用户ID查找购物车
    List<Cart> findByUserId(Long userId);
    
    // 根据用户ID和避难所ID查找购物车
    Optional<Cart> findByUserIdAndShelterId(Long userId, Long shelterId);
    
    // 查找用户的所有活跃购物车
    List<Cart> findByUserIdAndIsActiveTrue(Long userId);
    
    // 根据避难所ID查找购物车
    List<Cart> findByShelterId(Long shelterId);
    
    // 查找所有活跃的购物车
    List<Cart> findByIsActiveTrue();
    
    // 检查用户是否对特定避难所有购物车
    boolean existsByUserIdAndShelterId(Long userId, Long shelterId);
    
    // 根据用户ID和避难所ID删除购物车
    void deleteByUserIdAndShelterId(Long userId, Long shelterId);
}
