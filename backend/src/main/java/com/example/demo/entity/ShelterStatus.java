package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shelter_statuses")
public class ShelterStatus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_id", nullable = false)
    private Shelter shelter;
    
    @Min(value = 0, message = "避難者数は0以上で入力してください")
    @Column(name = "evacuee_count", nullable = false)
    private Integer evacueeCount = 0;
    
    @Min(value = 0, message = "けが人数は0以上で入力してください")
    @Column(name = "injured_count", nullable = false)
    private Integer injuredCount = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "electricity_status", nullable = false)
    private InfrastructureStatus electricityStatus = InfrastructureStatus.UNKNOWN;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gas_status", nullable = false)
    private InfrastructureStatus gasStatus = InfrastructureStatus.UNKNOWN;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "water_status", nullable = false)
    private InfrastructureStatus waterStatus = InfrastructureStatus.UNKNOWN;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "traffic_status", nullable = false)
    private TrafficStatus trafficStatus = TrafficStatus.UNKNOWN;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public ShelterStatus() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Shelter getShelter() { return shelter; }
    public void setShelter(Shelter shelter) { this.shelter = shelter; }
    
    public Integer getEvacueeCount() { return evacueeCount; }
    public void setEvacueeCount(Integer evacueeCount) { this.evacueeCount = evacueeCount; }
    
    public Integer getInjuredCount() { return injuredCount; }
    public void setInjuredCount(Integer injuredCount) { this.injuredCount = injuredCount; }
    
    public InfrastructureStatus getElectricityStatus() { return electricityStatus; }
    public void setElectricityStatus(InfrastructureStatus electricityStatus) { this.electricityStatus = electricityStatus; }
    
    public InfrastructureStatus getGasStatus() { return gasStatus; }
    public void setGasStatus(InfrastructureStatus gasStatus) { this.gasStatus = gasStatus; }
    
    public InfrastructureStatus getWaterStatus() { return waterStatus; }
    public void setWaterStatus(InfrastructureStatus waterStatus) { this.waterStatus = waterStatus; }
    
    public TrafficStatus getTrafficStatus() { return trafficStatus; }
    public void setTrafficStatus(TrafficStatus trafficStatus) { this.trafficStatus = trafficStatus; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
