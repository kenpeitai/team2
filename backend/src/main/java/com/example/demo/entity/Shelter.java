package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shelters")
public class Shelter {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "避難所名は必須です")
    @Size(max = 100, message = "避難所名は100文字以内で入力してください")
    @Column(name = "shelter_name", nullable = false)
    private String shelterName;
    
    @NotBlank(message = "住所は必須です")
    @Size(max = 200, message = "住所は200文字以内で入力してください")
    @Column(name = "shelter_address", nullable = false)
    private String shelterAddress;
    
    @NotBlank(message = "代表者姓は必須です")
    @Size(max = 50, message = "代表者姓は50文字以内で入力してください")
    @Column(name = "representative_last_name", nullable = false)
    private String representativeLastName;
    
    @NotBlank(message = "代表者名は必須です")
    @Size(max = 50, message = "代表者名は50文字以内で入力してください")
    @Column(name = "representative_first_name", nullable = false)
    private String representativeFirstName;
    
    @NotBlank(message = "電話番号は必須です")
    @Pattern(regexp = "^[0-9\\-]+$", message = "電話番号の形式が正しくありません")
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;
    
    @NotBlank(message = "メールアドレスは必須です")
    @Email(message = "メールアドレスの形式が正しくありません")
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "パスワードは必須です")
    @Size(min = 8, message = "パスワードは8文字以上で入力してください")
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "evacuee_count")
    private Integer evacueeCount;
    
    @Column(name = "injured_count")
    private Integer injuredCount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "electricity_status")
    private UtilityStatus electricityStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gas_status")
    private UtilityStatus gasStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "water_status")
    private UtilityStatus waterStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "traffic_status")
    private TrafficStatus trafficStatus;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // コンストラクタ
    public Shelter() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }
    
    public String getShelterAddress() { return shelterAddress; }
    public void setShelterAddress(String shelterAddress) { this.shelterAddress = shelterAddress; }
    
    public String getRepresentativeLastName() { return representativeLastName; }
    public void setRepresentativeLastName(String representativeLastName) { this.representativeLastName = representativeLastName; }
    
    public String getRepresentativeFirstName() { return representativeFirstName; }
    public void setRepresentativeFirstName(String representativeFirstName) { this.representativeFirstName = representativeFirstName; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Integer getEvacueeCount() { return evacueeCount; }
    public void setEvacueeCount(Integer evacueeCount) { this.evacueeCount = evacueeCount; }
    
    public Integer getInjuredCount() { return injuredCount; }
    public void setInjuredCount(Integer injuredCount) { this.injuredCount = injuredCount; }
    
    public UtilityStatus getElectricityStatus() { return electricityStatus; }
    public void setElectricityStatus(UtilityStatus electricityStatus) { this.electricityStatus = electricityStatus; }
    
    public UtilityStatus getGasStatus() { return gasStatus; }
    public void setGasStatus(UtilityStatus gasStatus) { this.gasStatus = gasStatus; }
    
    public UtilityStatus getWaterStatus() { return waterStatus; }
    public void setWaterStatus(UtilityStatus waterStatus) { this.waterStatus = waterStatus; }
    
    public TrafficStatus getTrafficStatus() { return trafficStatus; }
    public void setTrafficStatus(TrafficStatus trafficStatus) { this.trafficStatus = trafficStatus; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
