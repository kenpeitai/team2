package com.example.demo.entity;

public enum InfrastructureStatus {
    AVAILABLE("利用可能"),
    UNAVAILABLE("停止中"),
    UNKNOWN("不明");
    
    private final String displayName;
    
    InfrastructureStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
