package com.example.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
@Tag(name = "健康チェック", description = "システムとデータベースの健康状態を確認します")
public class DatabaseHealthController {
    
    @Autowired
    private DataSource dataSource;
    
    @GetMapping("/database")
    @Operation(summary = "データベース健康チェック", description = "データベース接続の状態を確認します")
    public ResponseEntity<Map<String, Object>> checkDatabaseHealth() {
        Map<String, Object> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            String databaseProductName = connection.getMetaData().getDatabaseProductName();
            String databaseProductVersion = connection.getMetaData().getDatabaseProductVersion();
            
            response.put("status", "UP");
            response.put("database", databaseProductName);
            response.put("version", databaseProductVersion);
            response.put("message", "データベース接続が正常です");
            response.put("timestamp", java.time.LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (SQLException e) {
            response.put("status", "DOWN");
            response.put("error", e.getMessage());
            response.put("message", "データベース接続に失敗しました");
            response.put("timestamp", java.time.LocalDateTime.now());
            
            return ResponseEntity.status(503).body(response);
        }
    }
    
    @GetMapping("/system")
    @Operation(summary = "システム健康チェック", description = "システム全体の状態を確認します")
    public ResponseEntity<Map<String, Object>> checkSystemHealth() {
        Map<String, Object> response = new HashMap<>();
        
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        response.put("status", "UP");
        response.put("message", "システムが正常に動作しています");
        response.put("timestamp", java.time.LocalDateTime.now());
        response.put("system", new HashMap<String, Object>() {{
            put("javaVersion", System.getProperty("java.version"));
            put("javaVendor", System.getProperty("java.vendor"));
            put("osName", System.getProperty("os.name"));
            put("osVersion", System.getProperty("os.version"));
            put("totalMemory", totalMemory);
            put("freeMemory", freeMemory);
            put("usedMemory", usedMemory);
            put("maxMemory", runtime.maxMemory());
        }});
        
        return ResponseEntity.ok(response);
    }
}
