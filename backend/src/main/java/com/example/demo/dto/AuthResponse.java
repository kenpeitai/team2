package com.example.demo.dto;

import java.time.LocalDateTime;

public class AuthResponse {
    
    private String token;
    private String message;
    private UserDto user;
    private ShelterDto shelter;
    private LocalDateTime timestamp;
    
    // コンストラクタ
    public AuthResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    public AuthResponse(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
    
    public AuthResponse(String token, String message, UserDto user) {
        this.token = token;
        this.message = message;
        this.user = user;
        this.timestamp = LocalDateTime.now();
    }
    
    public AuthResponse(String token, String message, ShelterDto shelter) {
        this.token = token;
        this.message = message;
        this.shelter = shelter;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getter and Setter methods
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
    
    public ShelterDto getShelter() { return shelter; }
    public void setShelter(ShelterDto shelter) { this.shelter = shelter; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
