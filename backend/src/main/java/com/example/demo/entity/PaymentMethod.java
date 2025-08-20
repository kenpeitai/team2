package com.example.demo.entity;

public enum PaymentMethod {
    CASH("現金"),
    BANK_TRANSFER("銀行振込"),
    CREDIT_CARD("クレジットカード"),
    DIGITAL_WALLET("電子マネー");
    
    private final String displayName;
    
    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
