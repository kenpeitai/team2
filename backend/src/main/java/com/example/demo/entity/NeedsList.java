package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "needs_lists")
public class NeedsList {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "shelter_id")
    private Long shelterId; // 避難所ID
    
    @Column(name = "evacuee_count", nullable = false)
    private Integer evacueeCount;
    
    @Column(name = "target_days", nullable = false)
    private Integer targetDays;
    
    @Column(name = "total_units")
    private Integer totalUnits;
    
    @Column(name = "total_weight_grams")
    private Integer totalWeightGrams;
    
    @Column(name = "water_cases")
    private Integer waterCases;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public NeedsList() {}
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getShelterId() { return shelterId; }
    public void setShelterId(Long shelterId) { this.shelterId = shelterId; }
    
    public Integer getEvacueeCount() { return evacueeCount; }
    public void setEvacueeCount(Integer evacueeCount) { this.evacueeCount = evacueeCount; }
    
    public Integer getTargetDays() { return targetDays; }
    public void setTargetDays(Integer targetDays) { this.targetDays = targetDays; }
    
    public Integer getTotalUnits() { return totalUnits; }
    public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }
    
    public Integer getTotalWeightGrams() { return totalWeightGrams; }
    public void setTotalWeightGrams(Integer totalWeightGrams) { this.totalWeightGrams = totalWeightGrams; }
    
    public Integer getWaterCases() { return waterCases; }
    public void setWaterCases(Integer waterCases) { this.waterCases = waterCases; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
