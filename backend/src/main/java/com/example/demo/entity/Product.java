package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", unique = true, nullable = false)
    private String productId; // 前端のidフィールド
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "unit", nullable = false)
    private String unit;
    
    @Column(name = "weight_grams", nullable = false)
    private Integer weightGrams;
    
    @Column(name = "recommended_per_person_per_day")
    private Double recommendedPerPersonPerDay;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "image_verified")
    private Boolean imageVerified = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private ProductCategory category;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public Product() {}
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    
    public Integer getWeightGrams() { return weightGrams; }
    public void setWeightGrams(Integer weightGrams) { this.weightGrams = weightGrams; }
    
    public Double getRecommendedPerPersonPerDay() { return recommendedPerPersonPerDay; }
    public void setRecommendedPerPersonPerDay(Double recommendedPerPersonPerDay) { this.recommendedPerPersonPerDay = recommendedPerPersonPerDay; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Boolean getImageVerified() { return imageVerified; }
    public void setImageVerified(Boolean imageVerified) { this.imageVerified = imageVerified; }
    
    public ProductCategory getCategory() { return category; }
    public void setCategory(ProductCategory category) { this.category = category; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
