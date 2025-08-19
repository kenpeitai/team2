package com.example.demo.entity;

public enum UtilityStatus {
    AVAILABLE("利用可能"),
    UNAVAILABLE("停止中");
    
    private final String displayName;
    
    UtilityStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
