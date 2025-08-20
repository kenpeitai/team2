package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventories")
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_id", nullable = false)
    private Shelter shelter;
    
    @NotBlank(message = "アイテム名は必須です")
    @Size(max = 200, message = "アイテム名は200文字以内で入力してください")
    @Column(name = "name", nullable = false)
    private String name;
    
    @Min(value = 0, message = "数量は0以上で入力してください")
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 0;
    
    @NotBlank(message = "カテゴリーは必須です")
    @Size(max = 100, message = "カテゴリーは100文字以内で入力してください")
    @Column(name = "category", nullable = false)
    private String category;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public Inventory() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Shelter getShelter() { return shelter; }
    public void setShelter(Shelter shelter) { this.shelter = shelter; }
    
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
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
