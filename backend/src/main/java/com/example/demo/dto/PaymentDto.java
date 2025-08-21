package com.example.demo.dto;

import java.time.LocalDateTime;

public class PaymentDto {
    private Long id;
    private Long orderId;
    private String paymentMethod;
    private String paymentStatus;
    private Double amount;
    private String transactionId;
    private LocalDateTime paymentDate;
    private String receiptUrl;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public PaymentDto() {}
    
    public PaymentDto(Long id, Long orderId, String paymentMethod, String paymentStatus, 
                     Double amount, String transactionId, LocalDateTime paymentDate, 
                     String receiptUrl, String notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderId = orderId;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.amount = amount;
        this.transactionId = transactionId;
        this.paymentDate = paymentDate;
        this.receiptUrl = receiptUrl;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getter and Setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    
    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
