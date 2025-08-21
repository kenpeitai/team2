package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Shelter;
import com.example.demo.entity.User;
import com.example.demo.service.ShelterService;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "認証", description = "ユーザー認証関連のAPI")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ShelterService shelterService;
    
    // ユーザー登録
    @PostMapping("/register")
    @Operation(summary = "ユーザー登録", description = "新しいユーザーを登録します")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody UserDto userDto) {
        try {
            User user = userService.createUser(userDto);
            UserDto createdUserDto = convertToDto(user);
            
            AuthResponse response = new AuthResponse(
                "登録が完了しました", 
                "ユーザー登録が正常に完了しました", 
                createdUserDto
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse("登録に失敗しました: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 避難所登録
    @PostMapping("/register-shelter")
    @Operation(summary = "避難所登録", description = "新しい避難所を登録します")
    public ResponseEntity<AuthResponse> registerShelter(@Valid @RequestBody ShelterDto shelterDto) {
        try {
            Shelter shelter = shelterService.createShelter(shelterDto);
            
            AuthResponse response = new AuthResponse("避難所登録が完了しました");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse("避難所登録に失敗しました: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // ユーザーログイン
    @PostMapping("/login")
    @Operation(summary = "ユーザーログイン", description = "ユーザーとしてログインします")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOpt = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                UserDto userDto = convertToDto(user);
                
                AuthResponse response = new AuthResponse(
                    "dummy-token-" + user.getId(), // 実際のJWTトークンを生成する必要があります
                    "ログインが完了しました", 
                    userDto
                );
                
                return ResponseEntity.ok(response);
            } else {
                AuthResponse response = new AuthResponse("メールアドレスまたはパスワードが正しくありません");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            AuthResponse response = new AuthResponse("ログインに失敗しました: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 避難所ログイン
    @PostMapping("/login-shelter")
    @Operation(summary = "避難所ログイン", description = "避難所としてログインします")
    public ResponseEntity<AuthResponse> loginShelter(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<Shelter> shelterOpt = shelterService.authenticateShelter(loginRequest.getEmail(), loginRequest.getPassword());
            
            if (shelterOpt.isPresent()) {
                Shelter shelter = shelterOpt.get();
                ShelterDto shelterDto = convertToShelterDto(shelter);
                
                AuthResponse response = new AuthResponse(
                    "dummy-token-" + shelter.getId(), // 実際のJWTトークンを生成する必要があります
                    "避難所ログインが完了しました", 
                    shelterDto
                );
                
                return ResponseEntity.ok(response);
            } else {
                AuthResponse response = new AuthResponse("メールアドレスまたはパスワードが正しくありません");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            AuthResponse response = new AuthResponse("避難所ログインに失敗しました: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // ログアウト
    @PostMapping("/logout")
    @Operation(summary = "ログアウト", description = "ログアウトします")
    public ResponseEntity<AuthResponse> logout() {
        AuthResponse response = new AuthResponse("ログアウトが完了しました");
        return ResponseEntity.ok(response);
    }
    
    // UserエンティティをUserDtoに変換
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
    
    // ShelterエンティティをShelterDtoに変換
    private ShelterDto convertToShelterDto(Shelter shelter) {
        ShelterDto dto = new ShelterDto();
        dto.setId(shelter.getId());
        dto.setShelterName(shelter.getShelterName());
        dto.setShelterAddress(shelter.getShelterAddress());
        dto.setRepresentativeLastName(shelter.getRepresentativeLastName());
        dto.setRepresentativeFirstName(shelter.getRepresentativeFirstName());
        dto.setPhoneNumber(shelter.getPhoneNumber());
        dto.setEmail(shelter.getEmail());
        dto.setEvacueeCount(shelter.getEvacueeCount());
        dto.setInjuredCount(shelter.getInjuredCount());
        dto.setElectricityStatus(shelter.getElectricityStatus());
        dto.setGasStatus(shelter.getGasStatus());
        dto.setWaterStatus(shelter.getWaterStatus());
        dto.setTrafficStatus(shelter.getTrafficStatus());
        dto.setIsActive(shelter.getIsActive());
        dto.setCreatedAt(shelter.getCreatedAt());
        dto.setUpdatedAt(shelter.getUpdatedAt());
        return dto;
    }
}
