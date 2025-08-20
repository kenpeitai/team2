package com.example.demo.dto;

import com.example.demo.entity.InfrastructureStatus;
import com.example.demo.entity.TrafficStatus;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class ShelterStatusDto {
    
    private Long id;
    
    private Long shelterId;
    
    @Min(value = 0, message = "避難者数は0以上で入力してください")
    private Integer evacueeCount = 0;
    
    @Min(value = 0, message = "けが人数は0以上で入力してください")
    private Integer injuredCount = 0;
    
    private InfrastructureStatus electricityStatus = InfrastructureStatus.UNKNOWN;
    
    private InfrastructureStatus gasStatus = InfrastructureStatus.UNKNOWN;
    
    private InfrastructureStatus waterStatus = InfrastructureStatus.UNKNOWN;
    
    private TrafficStatus trafficStatus = TrafficStatus.UNKNOWN;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public ShelterStatusDto() {}
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getShelterId() { return shelterId; }
    public void setShelterId(Long shelterId) { this.shelterId = shelterId; }
    
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
}
