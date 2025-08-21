package com.example.demo.dto;

public class ActiveSupportDto {
    private String supportedShelterName;
    private String itemName;
    private String status;

    public ActiveSupportDto() {}

    public ActiveSupportDto(String supportedShelterName, String itemName, String status) {
        this.supportedShelterName = supportedShelterName;
        this.itemName = itemName;
        this.status = status;
    }

    public String getSupportedShelterName() { return supportedShelterName; }
    public void setSupportedShelterName(String supportedShelterName) { this.supportedShelterName = supportedShelterName; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
