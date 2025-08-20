package com.example.demo.entity;

public enum PaymentStatus {
    PENDING("待支付"),
    COMPLETED("已完成"),
    FAILED("支付失败"),
    REFUNDED("已退款");
    
    private final String displayName;
    
    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
