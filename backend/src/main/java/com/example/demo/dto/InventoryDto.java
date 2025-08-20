package com.example.demo.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class InventoryDto {
    
    private Long id;
    
    private Long shelterId;
    
    @NotBlank(message = "アイテム名は必須です")
    @Size(max = 200, message = "アイテム名は200文字以内で入力してください")
    private String name;
    
    @Min(value = 0, message = "数量は0以上で入力してください")
    private Integer quantity = 0;
    
    @NotBlank(message = "カテゴリーは必須です")
    @Size(max = 100, message = "カテゴリーは100文字以内で入力してください")
    private String category;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public InventoryDto() {}
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getShelterId() { return shelterId; }
    public void setShelterId(Long shelterId) { this.shelterId = shelterId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
