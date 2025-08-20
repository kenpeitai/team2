package com.example.demo.repository;

import com.example.demo.entity.Product;
import com.example.demo.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByProductId(String productId);
    
    List<Product> findByCategory(ProductCategory category);
    
    List<Product> findByIsActiveTrue();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND (p.name LIKE %:keyword% OR p.productId LIKE %:keyword%)")
    List<Product> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category = :category AND (p.name LIKE %:keyword% OR p.productId LIKE %:keyword%)")
    List<Product> searchByCategoryAndKeyword(@Param("category") ProductCategory category, @Param("keyword") String keyword);
}
