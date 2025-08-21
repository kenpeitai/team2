package com.example.demo.dto;

public class NotificationDto {
    private String message;
    private String time;
    private String color;

    public NotificationDto() {}

    public NotificationDto(String message, String time, String color) {
        this.message = message;
        this.time = time;
        this.color = color;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
