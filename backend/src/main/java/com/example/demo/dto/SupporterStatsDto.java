package com.example.demo.dto;

public class SupporterStatsDto {
    private int ongoing;
    private int completed;
    private String totalAmount;

    public SupporterStatsDto() {}

    public SupporterStatsDto(int ongoing, int completed, String totalAmount) {
        this.ongoing = ongoing;
        this.completed = completed;
        this.totalAmount = totalAmount;
    }

    public int getOngoing() { return ongoing; }
    public void setOngoing(int ongoing) { this.ongoing = ongoing; }

    public int getCompleted() { return completed; }
    public void setCompleted(int completed) { this.completed = completed; }

    public String getTotalAmount() { return totalAmount; }
    public void setTotalAmount(String totalAmount) { this.totalAmount = totalAmount; }
}
