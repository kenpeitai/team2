package com.example.demo.entity;

public enum PaymentStatus {
    PENDING("支払い待ち"),
    COMPLETED("完了"),
    FAILED("支払い失敗"),
    REFUNDED("返金済み");
    
    private final String displayName;
    
    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
