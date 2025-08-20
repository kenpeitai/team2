package com.example.demo.entity;

public enum OrderStatus {
<<<<<<< HEAD
    PENDING("待处理"),
    CONFIRMED("已确认"),
    SHIPPED("已发货"),
    DELIVERED("已送达"),
    CANCELLED("已取消");
=======
    PENDING("処理待ち"),
    CONFIRMED("確認済み"),
    SHIPPED("発送済み"),
    DELIVERED("配達完了"),
    CANCELLED("キャンセル");
>>>>>>> 3cf50a2829b89b75f4d6496363b425efe23a328f
    
    private final String displayName;
    
    OrderStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
