package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.example.demo.service.ShelterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/supporter")
@CrossOrigin(origins = "*")
@Tag(name = "支援者専用", description = "支援者専用のAPI")
public class SupporterController {

    @Autowired
    private UserService userService;

    @Autowired
    private ShelterService shelterService;

    // 支援者のプロフィール取得
    @GetMapping("/profile/{userId}")
    @Operation(summary = "支援者プロフィール取得", description = "支援者の詳細情報を取得します")
    public ResponseEntity<UserDto> getSupporterProfile(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user != null && user.getRole().name().equals("USER")) {
                return ResponseEntity.ok(convertToDto(user));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 支援者のプロフィール更新
    @PutMapping("/profile/{userId}")
    @Operation(summary = "支援者プロフィール更新", description = "支援者の情報を更新します")
    public ResponseEntity<UserDto> updateSupporterProfile(
            @PathVariable Long userId,
            @RequestBody UserDto userDto) {
        try {
            User updatedUser = userService.updateUser(userId, userDto);
            return ResponseEntity.ok(convertToDto(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 支援者が支援可能な避難所一覧取得
    @GetMapping("/available-shelters")
    @Operation(summary = "支援可能避難所一覧", description = "支援者が支援可能な避難所の一覧を取得します")
    public ResponseEntity<List<Object>> getAvailableShelters() {
        try {
            List<Object> shelters = shelterService.getActiveSheltersForSupporters();
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 支援者の支援履歴取得
    @GetMapping("/support-history/{userId}")
    @Operation(summary = "支援履歴取得", description = "支援者の支援履歴を取得します")
    public ResponseEntity<List<Object>> getSupportHistory(@PathVariable Long userId) {
        try {
            // ここでは仮のデータを返す（実際の支援履歴テーブルが実装されたら更新）
            List<Object> history = List.of(
                Map.of(
                    "id", 1,
                    "shelterName", "避難所A",
                    "supportDate", "2024-01-15",
                    "supportType", "物資提供",
                    "status", "完了"
                ),
                Map.of(
                    "id", 2,
                    "shelterName", "避難所B", 
                    "supportDate", "2024-01-10",
                    "supportType", "ボランティア",
                    "status", "完了"
                )
            );
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 支援者の統計情報取得
    @GetMapping("/statistics/{userId}")
    @Operation(summary = "支援者統計情報", description = "支援者の支援活動の統計情報を取得します")
    public ResponseEntity<Object> getSupporterStatistics(@PathVariable Long userId) {
        try {
            Object statistics = Map.of(
                "totalSupports", 15,
                "totalShelters", 8,
                "totalHours", 120,
                "currentMonthSupports", 3,
                "favoriteShelter", "避難所A"
            );
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 支援者の通知設定取得
    @GetMapping("/notifications/{userId}")
    @Operation(summary = "通知設定取得", description = "支援者の通知設定を取得します")
    public ResponseEntity<Object> getNotificationSettings(@PathVariable Long userId) {
        try {
            Object settings = Map.of(
                "emailNotifications", true,
                "smsNotifications", false,
                "emergencyAlerts", true,
                "weeklyDigest", true,
                "shelterUpdates", true
            );
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 支援者の通知設定更新
    @PutMapping("/notifications/{userId}")
    @Operation(summary = "通知設定更新", description = "支援者の通知設定を更新します")
    public ResponseEntity<Object> updateNotificationSettings(
            @PathVariable Long userId,
            @RequestBody Object settings) {
        try {
            // 実際の実装ではデータベースに保存
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // UserエンティティをUserDtoに変換
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCardNumber(user.getCardNumber());
        dto.setCardExpiry(user.getCardExpiry());
        dto.setCardCvc(user.getCardCvc());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
