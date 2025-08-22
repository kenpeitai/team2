package com.example.demo.service;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.UserRepository;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // ユーザー登録
    public User createUser(UserDto userDto) {
        // ユーザー名が空の場合は自動生成
        String username = userDto.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = generateUsername();
        }
        
        // ユーザー名の重複チェック
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("このユーザー名は既に使用されています");
        }
        
        // メールアドレスの重複チェック
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateResourceException("このメールアドレスは既に登録されています");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setFullName(userDto.getFullName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setCardNumber(userDto.getCardNumber());
        user.setCardExpiry(userDto.getCardExpiry());
        user.setCardCvc(userDto.getCardCvc());
        user.setCardHolder(userDto.getCardHolder());
        user.setRole(userDto.getRole() != null ? userDto.getRole() : UserRole.USER);
        user.setIsActive(true);
        
        return userRepository.save(user);
    }
    
    // ユーザー名自動生成メソッド
    private String generateUsername() {
        String[] adjectives = {"happy", "brave", "kind", "wise", "bright", "calm", "gentle", "smart", "quick", "warm"};
        String[] nouns = {"helper", "supporter", "friend", "hero", "star", "angel", "guardian", "champion", "warrior", "protector"};
        
        String adj = adjectives[(int) (Math.random() * adjectives.length)];
        String noun = nouns[(int) (Math.random() * nouns.length)];
        int randomNum = (int) (Math.random() * 1000);
        
        return adj + "_" + noun + "_" + randomNum;
    }
    
    // ユーザー情報更新
    public User updateUser(Long id, UserDto userDto) {
        User user = getUserById(id);
        
        // ユーザー名の重複チェック（自分以外）
        if (userDto.getUsername() != null && !userDto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userDto.getUsername())) {
                throw new DuplicateResourceException("このユーザー名は既に使用されています");
            }
            user.setUsername(userDto.getUsername());
        }
        
        // メールアドレスの重複チェック（自分以外）
        if (userDto.getEmail() != null && !userDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDto.getEmail())) {
                throw new DuplicateResourceException("このメールアドレスは既に使用されています");
            }
            user.setEmail(userDto.getEmail());
        }
        
        if (userDto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        if (userDto.getFullName() != null) {
            user.setFullName(userDto.getFullName());
        }
        
        if (userDto.getPhoneNumber() != null) {
            user.setPhoneNumber(userDto.getPhoneNumber());
        }
        
        if (userDto.getCardNumber() != null) {
            user.setCardNumber(userDto.getCardNumber());
        }
        
        if (userDto.getCardExpiry() != null) {
            user.setCardExpiry(userDto.getCardExpiry());
        }
        
        if (userDto.getCardCvc() != null) {
            user.setCardCvc(userDto.getCardCvc());
        }
        
        if (userDto.getCardHolder() != null) {
            user.setCardHolder(userDto.getCardHolder());
        }
        
        if (userDto.getRole() != null) {
            user.setRole(userDto.getRole());
        }
        
        if (userDto.getIsActive() != null) {
            user.setIsActive(userDto.getIsActive());
        }
        
        return userRepository.save(user);
    }
    
    // ユーザー取得
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + id));
    }
    
    // メールアドレスで取得
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + email));
    }
    
    // 全ユーザー取得
    public List<User> getAllUsers() {
        return userRepository.findByIsActiveTrue();
    }
    
    // ロールで検索
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    // ユーザー検索
    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }
    
    // 複合検索
    public List<User> searchUsersAdvanced(String email, UserRole role, Boolean isActive) {
        return userRepository.searchUsersAdvanced(email, role, isActive);
    }
    
    // ユーザー削除（論理削除）
    public void deleteUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    // ユーザー認証
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
    
    // パスワード更新
    public User updatePassword(Long id, String newPassword) {
        User user = getUserById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
    
    // ユーザー名で取得（emailを代わりに使用）
    public User getUserByUsername(String username) {
        return getUserByEmail(username);
    }
}
