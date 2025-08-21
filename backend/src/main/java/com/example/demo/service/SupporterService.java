package com.example.demo.service;

import com.example.demo.dto.SupporterStatsDto;
import com.example.demo.dto.ActiveSupportDto;
import com.example.demo.dto.NotificationDto;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class SupporterService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ShelterRepository shelterRepository;

    public SupporterStatsDto getSupporterStats(Long supporterId) {
        // データベースから実際の統計データを取得
        long ongoingCount = orderRepository.countByUserIdAndStatusIn(
            supporterId, 
            List.of("PENDING", "PAID", "PROCESSING")
        );
        
        long completedCount = orderRepository.countByUserIdAndStatus(
            supporterId, 
            "COMPLETED"
        );
        
        // 総金額を計算（完了した注文から）
        Double totalAmount = orderRepository.sumTotalAmountByUserIdAndStatus(
            supporterId, 
            "COMPLETED"
        );
        
        String formattedAmount = totalAmount != null ? 
            String.format("¥%,.0f", totalAmount) : "¥0";
        
        return new SupporterStatsDto(
            (int) ongoingCount,
            (int) completedCount,
            formattedAmount
        );
    }

    public ActiveSupportDto getActiveSupport(Long supporterId) {
        // 获取最新的进行中订单
        var latestOrder = orderRepository.findFirstByUserIdAndStatusInOrderByCreatedAtDesc(
            supporterId,
            List.of("PENDING", "PAID", "PROCESSING")
        );
        
        if (latestOrder.isPresent()) {
            var order = latestOrder.get();
            var shelter = shelterRepository.findById(order.getShelterId()).orElse(null);
            String shelterName = shelter != null ? shelter.getShelterName() : "不明な避難所";
            
            // 将订单状态映射为前端期望的状态值
            String mappedStatus = mapOrderStatusToActiveSupportStatus(order.getStatus());
            
            return new ActiveSupportDto(
                shelterName,
                "支援物資", // 可以从订单项中获取更详细的信息
                mappedStatus
            );
        }
        
        return null;
    }
    
    private String mapOrderStatusToActiveSupportStatus(String orderStatus) {
        switch (orderStatus) {
            case "PENDING":
                return "purchased";
            case "PAID":
                return "delivery_drone";
            case "PROCESSING":
                return "delivered";
            case "COMPLETED":
                return "received";
            default:
                return "purchased";
        }
    }

    public List<NotificationDto> getNotifications(Long supporterId) {
        List<NotificationDto> notifications = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        // 获取最近的已完成订单，生成感谢通知（只显示最近3个）
        var recentCompletedOrders = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(
            supporterId,
            "COMPLETED"
        );
        
        int completedCount = 0;
        for (var order : recentCompletedOrders) {
            if (completedCount >= 3) break; // 只显示最近3个
            
            var shelter = shelterRepository.findById(order.getShelterId()).orElse(null);
            if (shelter != null) {
                String timeAgo = calculateTimeAgo(order.getCreatedAt(), now);
                notifications.add(new NotificationDto(
                    shelter.getShelterName() + "から感謝の通知が届きました",
                    timeAgo,
                    "bg-green-500"
                ));
                completedCount++;
            }
        }
        
        // 如果有进行中的支援，添加进度通知（只显示最近2个）
        var activeOrders = orderRepository.findByUserIdAndStatusIn(
            supporterId,
            List.of("PENDING", "PAID", "PROCESSING")
        );
        
        int activeCount = 0;
        for (var order : activeOrders) {
            if (activeCount >= 2) break; // 只显示最近2个
            
            var shelter = shelterRepository.findById(order.getShelterId()).orElse(null);
            if (shelter != null) {
                String timeAgo = calculateTimeAgo(order.getCreatedAt(), now);
                String statusMessage = getStatusMessage(order.getStatus());
                notifications.add(new NotificationDto(
                    shelter.getShelterName() + "への支援が" + statusMessage,
                    timeAgo,
                    "bg-blue-500"
                ));
                activeCount++;
            }
        }
        
        return notifications;
    }
    
    private String getStatusMessage(String status) {
        switch (status) {
            case "PENDING":
                return "確認待ちです";
            case "PAID":
                return "支払い完了、準備中です";
            case "PROCESSING":
                return "配送準備中です";
            default:
                return "進行中です";
        }
    }
    
    private String calculateTimeAgo(LocalDateTime createdAt, LocalDateTime now) {
        long minutes = ChronoUnit.MINUTES.between(createdAt, now);
        long hours = ChronoUnit.HOURS.between(createdAt, now);
        long days = ChronoUnit.DAYS.between(createdAt, now);
        
        if (minutes < 1) {
            return "今";
        } else if (minutes < 60) {
            return minutes + "分前";
        } else if (hours < 24) {
            return hours + "時間前";
        } else if (days < 7) {
            return days + "日前";
        } else {
            long weeks = days / 7;
            return weeks + "週間前";
        }
    }
}
