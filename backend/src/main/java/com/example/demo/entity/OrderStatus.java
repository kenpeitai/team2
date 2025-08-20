package com.example.demo.entity;

public enum OrderStatus {
    PENDING("待处理"),
    CONFIRMED("已确认"),
    SHIPPED("已发货"),
    DELIVERED("已送达"),
    CANCELLED("已取消");
    
    private final String displayName;
    
    OrderStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
