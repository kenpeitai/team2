package com.example.demo.dto;

import com.example.demo.entity.Priority;
import com.example.demo.entity.ProductCategory;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public class NeedsListDto {
    
    private Long id;
    
    @NotNull(message = "避難所IDは必須です")
    private Long shelterId;
    
    @NotNull(message = "避難者数は必須です")
    @Min(value = 0, message = "避難者数は0以上で入力してください")
    private Integer evacueeCount;
    
    @NotNull(message = "対象日数は必須です")
    @Min(value = 1, message = "対象日数は1以上で入力してください")
    private Integer targetDays;
    
    private Integer totalUnits;
    private Integer totalWeightGrams;
    private Integer waterCases;
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 明細項目
    private List<NeedsListItemDto> items;
    
    // コンストラクタ
    public NeedsListDto() {}
    
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
    
    public List<NeedsListItemDto> getItems() { return items; }
    public void setItems(List<NeedsListItemDto> items) { this.items = items; }
    
    // 内部クラス：明細項目
    public static class NeedsListItemDto {
        private Long id;
        private String productId;
        private String productName;
        private String unit;
        private ProductCategory category;
        
        @NotNull(message = "数量は必須です")
        @Min(value = 0, message = "数量は0以上で入力してください")
        private Integer quantity;
        
        @NotNull(message = "優先度は必須です")
        private Priority priority;
        
        private String notes;
        private Integer perUnitWeightGrams;
        private Integer totalWeightGrams;
        private Boolean droneEligible;
        private Boolean droneEligibleWholeOrder;
        private Boolean dronePerUnitEligible;
        private Integer droneUnitsPerFlight;
        private Integer droneFlightsRequired;
        
        // Getter and Setter methods
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
        
        public ProductCategory getCategory() { return category; }
        public void setCategory(ProductCategory category) { this.category = category; }
        
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        
        public Priority getPriority() { return priority; }
        public void setPriority(Priority priority) { this.priority = priority; }
        
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        
        public Integer getPerUnitWeightGrams() { return perUnitWeightGrams; }
        public void setPerUnitWeightGrams(Integer perUnitWeightGrams) { this.perUnitWeightGrams = perUnitWeightGrams; }
        
        public Integer getTotalWeightGrams() { return totalWeightGrams; }
        public void setTotalWeightGrams(Integer totalWeightGrams) { this.totalWeightGrams = totalWeightGrams; }
        
        public Boolean getDroneEligible() { return droneEligible; }
        public void setDroneEligible(Boolean droneEligible) { this.droneEligible = droneEligible; }
        
        public Boolean getDroneEligibleWholeOrder() { return droneEligibleWholeOrder; }
        public void setDroneEligibleWholeOrder(Boolean droneEligibleWholeOrder) { this.droneEligibleWholeOrder = droneEligibleWholeOrder; }
        
        public Boolean getDronePerUnitEligible() { return dronePerUnitEligible; }
        public void setDronePerUnitEligible(Boolean dronePerUnitEligible) { this.dronePerUnitEligible = dronePerUnitEligible; }
        
        public Integer getDroneUnitsPerFlight() { return droneUnitsPerFlight; }
        public void setDroneUnitsPerFlight(Integer droneUnitsPerFlight) { this.droneUnitsPerFlight = droneUnitsPerFlight; }
        
        public Integer getDroneFlightsRequired() { return droneFlightsRequired; }
        public void setDroneFlightsRequired(Integer droneFlightsRequired) { this.droneFlightsRequired = droneFlightsRequired; }
    }
}
