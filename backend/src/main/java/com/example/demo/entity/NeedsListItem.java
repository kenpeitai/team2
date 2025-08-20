package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "needs_list_items")
public class NeedsListItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "needs_list_id", nullable = false)
    private Long needsListId;
    
    @Column(name = "product_id", nullable = false)
    private String productId;
    
    @Column(name = "product_name", nullable = false)
    private String productName;
    
    @Column(name = "unit", nullable = false)
    private String unit;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private ProductCategory category;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "per_unit_weight_grams")
    private Integer perUnitWeightGrams;
    
    @Column(name = "total_weight_grams")
    private Integer totalWeightGrams;
    
    @Column(name = "drone_eligible")
    private Boolean droneEligible;
    
    @Column(name = "drone_eligible_whole_order")
    private Boolean droneEligibleWholeOrder;
    
    @Column(name = "drone_per_unit_eligible")
    private Boolean dronePerUnitEligible;
    
    @Column(name = "drone_units_per_flight")
    private Integer droneUnitsPerFlight;
    
    @Column(name = "drone_flights_required")
    private Integer droneFlightsRequired;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public NeedsListItem() {}
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getNeedsListId() { return needsListId; }
    public void setNeedsListId(Long needsListId) { this.needsListId = needsListId; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
