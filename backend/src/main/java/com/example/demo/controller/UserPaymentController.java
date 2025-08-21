package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.example.demo.dto.UserPaymentInfoDto;
import com.example.demo.dto.UserDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@Tag(name = "ユーザー支払い情報", description = "ユーザー固有の支払い情報を管理します")
public class UserPaymentController {

    @Autowired
    private UserService userService;

    // ユーザーの支払い情報を取得
    @GetMapping("/{userId}/payment-info")
    @Operation(summary = "ユーザー支払い情報取得", description = "指定されたユーザーの支払い情報を取得します")
    public ResponseEntity<UserPaymentInfoDto> getUserPaymentInfo(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            
            UserPaymentInfoDto paymentInfo = new UserPaymentInfoDto();
            paymentInfo.setUserId(userId);
            paymentInfo.setCardNumber(user.getCardNumber());
            paymentInfo.setCardExpiry(user.getCardExpiry());
            paymentInfo.setCardCvc(user.getCardCvc());
            paymentInfo.setFullName(user.getFullName());
            paymentInfo.setCardHolder(user.getCardHolder());
            
            return ResponseEntity.ok(paymentInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ユーザーの支払い情報を更新
    @PutMapping("/{userId}/payment-info")
    @Operation(summary = "ユーザー支払い情報更新", description = "指定されたユーザーの支払い情報を更新します")
    public ResponseEntity<Map<String, String>> updateUserPaymentInfo(
            @PathVariable Long userId,
            @RequestBody UserPaymentInfoDto paymentInfoDto) {
        try {
            // 既存のユーザー情報を取得
            User existingUser = userService.getUserById(userId);
            
            // UserDtoを作成して支払い情報を更新
            UserDto userDto = new UserDto();
            userDto.setEmail(existingUser.getEmail());
            userDto.setFullName(existingUser.getFullName());
            userDto.setPhoneNumber(existingUser.getPhoneNumber());
            userDto.setRole(existingUser.getRole());
            userDto.setIsActive(existingUser.getIsActive());
            
            // 支払い情報を更新
            userDto.setCardNumber(paymentInfoDto.getCardNumber());
            userDto.setCardExpiry(paymentInfoDto.getCardExpiry());
            userDto.setCardCvc(paymentInfoDto.getCardCvc());
            userDto.setCardHolder(paymentInfoDto.getCardHolder());
            
            userService.updateUser(userId, userDto);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "支払い情報が正常に更新されました");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "支払い情報の更新に失敗しました: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ユーザーの支払い情報を削除
    @DeleteMapping("/{userId}/payment-info")
    @Operation(summary = "ユーザー支払い情報削除", description = "指定されたユーザーの支払い情報を削除します")
    public ResponseEntity<Map<String, String>> deleteUserPaymentInfo(@PathVariable Long userId) {
        try {
            // 既存のユーザー情報を取得
            User existingUser = userService.getUserById(userId);
            
            // UserDtoを作成して支払い情報をクリア
            UserDto userDto = new UserDto();
            userDto.setEmail(existingUser.getEmail());
            userDto.setFullName(existingUser.getFullName());
            userDto.setPhoneNumber(existingUser.getPhoneNumber());
            userDto.setRole(existingUser.getRole());
            userDto.setIsActive(existingUser.getIsActive());
            
            // 支払い情報をクリア
            userDto.setCardNumber(null);
            userDto.setCardExpiry(null);
            userDto.setCardCvc(null);
            
            userService.updateUser(userId, userDto);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "支払い情報が正常に削除されました");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "支払い情報の削除に失敗しました: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
