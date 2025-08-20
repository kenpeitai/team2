package com.example.demo.entity;

public enum TrafficStatus {
    NORMAL("問題なし"),
    RESTRICTED("一部規制あり"),
    CLOSED("通行止め"),
    UNKNOWN("不明");
    
    private final String displayName;
    
    TrafficStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
