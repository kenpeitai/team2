package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@Tag(name = "ユーザー", description = "ユーザー管理関連のAPI")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // ユーザー登録
    @PostMapping
    @Operation(summary = "ユーザー登録", description = "新しいユーザーを登録します")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDto userDto) {
        try {
            User user = userService.createUser(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ユーザー情報更新
    @PutMapping("/{id}")
    @Operation(summary = "ユーザー情報更新", description = "ユーザー情報を更新します")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id, 
            @Valid @RequestBody UserDto userDto) {
        try {
            User user = userService.updateUser(id, userDto);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // パスワード更新
    @PutMapping("/{id}/password")
    @Operation(summary = "パスワード更新", description = "ユーザーのパスワードを更新します")
    public ResponseEntity<User> updatePassword(
            @PathVariable Long id, 
            @RequestParam String newPassword) {
        try {
            User user = userService.updatePassword(id, newPassword);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ユーザー情報取得
    @GetMapping("/{id}")
    @Operation(summary = "ユーザー情報取得", description = "指定されたIDのユーザー情報を取得します")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // ユーザー名で取得
    @GetMapping("/username/{username}")
    @Operation(summary = "ユーザー名検索", description = "ユーザー名でユーザーを検索します")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        try {
            User user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // メールアドレスで取得
    @GetMapping("/email/{email}")
    @Operation(summary = "メールアドレス検索", description = "メールアドレスでユーザーを検索します")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 全ユーザー取得
    @GetMapping
    @Operation(summary = "全ユーザー取得", description = "全てのアクティブなユーザーを取得します")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ロールで検索
    @GetMapping("/role/{role}")
    @Operation(summary = "ロール検索", description = "指定されたロールのユーザーを検索します")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable UserRole role) {
        try {
            List<User> users = userService.getUsersByRole(role);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // キーワード検索
    @GetMapping("/search")
    @Operation(summary = "キーワード検索", description = "キーワードでユーザーを検索します")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String keyword) {
        try {
            List<User> users = userService.searchUsers(keyword);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 複合検索
    @GetMapping("/search/advanced")
    @Operation(summary = "複合検索", description = "複数の条件でユーザーを検索します")
    public ResponseEntity<List<User>> searchUsersAdvanced(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) Boolean isActive) {
        try {
            List<User> users = userService.searchUsersAdvanced(email, role, isActive);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ユーザー削除（論理削除）
    @DeleteMapping("/{id}")
    @Operation(summary = "ユーザー削除", description = "ユーザーを論理削除します")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
