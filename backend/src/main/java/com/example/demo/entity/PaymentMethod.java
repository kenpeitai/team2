package com.example.demo.entity;

public enum PaymentMethod {
<<<<<<< HEAD
    CASH("现金"),
    BANK_TRANSFER("银行转账"),
    CREDIT_CARD("信用卡"),
    DIGITAL_WALLET("电子钱包");
=======
    CASH("現金"),
    BANK_TRANSFER("銀行振込"),
    CREDIT_CARD("クレジットカード"),
    DIGITAL_WALLET("電子マネー");
>>>>>>> 3cf50a2829b89b75f4d6496363b425efe23a328f
    
    private final String displayName;
    
    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
