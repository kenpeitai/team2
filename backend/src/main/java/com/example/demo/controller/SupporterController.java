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

    // 支援者登録
    @PostMapping("/register")
    @Operation(summary = "支援者登録", description = "新しい支援者を登録します")
    public ResponseEntity<UserDto> registerSupporter(@RequestBody UserDto userDto) {
        try {
            User user = userService.createUser(userDto);
            return ResponseEntity.ok(convertToDto(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 可支援的需求清单获取
    @GetMapping("/needs-lists")
    @Operation(summary = "支援可能なニーズリスト取得", description = "支援者が支援可能なニーズリストを取得します")
    public ResponseEntity<List<Object>> getAvailableNeedsLists() {
        try {
            // 这里应该调用NeedsListService获取可支援的需求清单
            // 为了简化，返回模拟数据
            List<Object> needsLists = List.of(
                Map.of(
                    "id", 1,
                    "shelterName", "緑区徳重地区会館",
                    "evacueeCount", 85,
                    "targetDays", 5,
                    "totalItems", 7,
                    "priority", "high"
                ),
                Map.of(
                    "id", 2,
                    "shelterName", "名古屋市立大学病院",
                    "evacueeCount", 120,
                    "targetDays", 3,
                    "totalItems", 12,
                    "priority", "medium"
                )
            );
            return ResponseEntity.ok(needsLists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取特定避难所的需求清单
    @GetMapping("/needs-lists/{shelterId}")
    @Operation(summary = "避難所別ニーズリスト取得", description = "指定された避難所のニーズリストを取得します")
    public ResponseEntity<Object> getNeedsListByShelter(@PathVariable Long shelterId) {
        try {
            // 这里应该调用NeedsListService获取特定避难所的需求清单
            // 为了简化，返回模拟数据
            Object needsList = Map.of(
                "shelterName", "緑区徳重地区会館",
                "evacueeCount", 85,
                "targetDays", 5,
                "items", List.of(
                    Map.of(
                        "id", "1",
                        "productId", "p-water-2l",
                        "productName", "飲料水 2L×6本（1ケース）",
                        "unit", "ケース",
                        "quantity", 43,
                        "priority", "high",
                        "category", "食料",
                        "notes", "生命維持に不可欠",
                        "estimatedPrice", 1000
                    ),
                    Map.of(
                        "id", "2",
                        "productId", "p-instant-rice",
                        "productName", "サトウのごはん 200g×5食",
                        "unit", "箱",
                        "quantity", 85,
                        "priority", "high",
                        "category", "食料",
                        "notes", "主食として重要",
                        "estimatedPrice", 600
                    )
                )
            );
            return ResponseEntity.ok(needsList);
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
