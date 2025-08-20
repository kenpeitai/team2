package com.example.demo.entity;

public enum PaymentStatus {
<<<<<<< HEAD
    PENDING("待支付"),
    COMPLETED("已完成"),
    FAILED("支付失败"),
    REFUNDED("已退款");
=======
    PENDING("支払い待ち"),
    COMPLETED("完了"),
    FAILED("支払い失敗"),
    REFUNDED("返金済み");
>>>>>>> 3cf50a2829b89b75f4d6496363b425efe23a328f
    
    private final String displayName;
    
    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
