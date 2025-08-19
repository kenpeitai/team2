package com.example.demo.entity;

public enum UserRole {
    USER("一般ユーザー"),
    ADMIN("管理者"),
    MODERATOR("モデレーター");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
