package com.example.demo.controller;

import com.example.demo.service.SupporterService;
import com.example.demo.dto.SupporterStatsDto;
import com.example.demo.dto.ActiveSupportDto;
import com.example.demo.dto.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supporters")
@CrossOrigin(origins = "*")
@Tag(name = "支援者", description = "支援者関連のAPI")
public class SupporterController {

    @Autowired
    private SupporterService supporterService;

    @GetMapping("/{supporterId}/stats")
    @Operation(summary = "支援者統計取得", description = "指定された支援者の統計情報を取得します")
    public ResponseEntity<SupporterStatsDto> getSupporterStats(@PathVariable Long supporterId) {
        try {
            SupporterStatsDto stats = supporterService.getSupporterStats(supporterId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{supporterId}/active-support")
    @Operation(summary = "進行中の支援取得", description = "指定された支援者の進行中の支援を取得します")
    public ResponseEntity<ActiveSupportDto> getActiveSupport(@PathVariable Long supporterId) {
        try {
            ActiveSupportDto activeSupport = supporterService.getActiveSupport(supporterId);
            return ResponseEntity.ok(activeSupport);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{supporterId}/notifications")
    @Operation(summary = "通知取得", description = "指定された支援者の通知を取得します")
    public ResponseEntity<List<NotificationDto>> getNotifications(@PathVariable Long supporterId) {
        try {
            List<NotificationDto> notifications = supporterService.getNotifications(supporterId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
