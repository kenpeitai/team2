package com.example.demo.dto;

import com.example.demo.entity.ProductCategory;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class ProductDto {
    
    private Long id;
    
    @NotBlank(message = "商品IDは必須です")
    private String productId;
    
    @NotBlank(message = "商品名は必須です")
    @Size(max = 200, message = "商品名は200文字以内で入力してください")
    private String name;
    
    @NotBlank(message = "単位は必須です")
    @Size(max = 50, message = "単位は50文字以内で入力してください")
    private String unit;
    
    @NotNull(message = "重量は必須です")
    @Min(value = 0, message = "重量は0以上で入力してください")
    private Integer weightGrams;
    
    @Min(value = 0, message = "推奨数量は0以上で入力してください")
    private Double recommendedPerPersonPerDay;
    
    private String imageUrl;
    private Boolean imageVerified = false;
    
    @NotNull(message = "カテゴリは必須です")
    private ProductCategory category;
    
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public ProductDto() {}
    
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
