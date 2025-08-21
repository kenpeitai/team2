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
        // メールアドレスの重複チェック
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateResourceException("このメールアドレスは既に登録されています");
        }
        
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setFullName(userDto.getFullName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setCardNumber(userDto.getCardNumber());
        user.setCardExpiry(userDto.getCardExpiry());
        user.setCardCvc(userDto.getCardCvc());
        user.setRole(userDto.getRole() != null ? userDto.getRole() : UserRole.USER);
        user.setIsActive(true);
        
        return userRepository.save(user);
    }
    
    // ユーザー情報更新
    public User updateUser(Long id, UserDto userDto) {
        User user = getUserById(id);
        
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
}
