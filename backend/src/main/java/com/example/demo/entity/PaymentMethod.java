package com.example.demo.entity;

public enum PaymentMethod {
    CASH("现金"),
    BANK_TRANSFER("银行转账"),
    CREDIT_CARD("信用卡"),
    DIGITAL_WALLET("电子钱包");
    
    private final String displayName;
    
    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
