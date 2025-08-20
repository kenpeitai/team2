package com.example.demo.repository;

import com.example.demo.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // 根据购物车ID查找所有项目
    List<CartItem> findByCartId(Long cartId);
    
    // 根据购物车ID和产品ID查找项目
    Optional<CartItem> findByCartIdAndProductId(Long cartId, String productId);
    
    // 根据产品ID查找所有购物车项目
    List<CartItem> findByProductId(String productId);
    
    // 根据用户ID查找所有购物车项目（通过关联查询）
    @Query("SELECT ci FROM CartItem ci JOIN ci.cart c WHERE c.userId = :userId")
    List<CartItem> findByUserId(@Param("userId") Long userId);
    
    // 根据用户ID和避难所ID查找购物车项目
    @Query("SELECT ci FROM CartItem ci JOIN ci.cart c WHERE c.userId = :userId AND c.shelterId = :shelterId")
    List<CartItem> findByUserIdAndShelterId(@Param("userId") Long userId, @Param("shelterId") Long shelterId);
    
    // 删除购物车中的所有项目
    void deleteByCartId(Long cartId);
    
    // 根据购物车ID和产品ID删除项目
    void deleteByCartIdAndProductId(Long cartId, String productId);
    
    // 计算购物车中的项目总数
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cartId = :cartId")
    Long countByCartId(@Param("cartId") Long cartId);
}
