package com.example.demo.repository;

import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // ユーザー名で検索
    Optional<User> findByUsername(String username);
    
    // メールアドレスで検索
    Optional<User> findByEmail(String email);
    
    // ユーザー名の重複チェック
    boolean existsByUsername(String username);
    
    // メールアドレスの重複チェック
    boolean existsByEmail(String email);
    
    // ロールで検索
    List<User> findByRole(UserRole role);
    
    // アクティブなユーザーのみ取得
    List<User> findByIsActiveTrue();
    
    // ユーザー名またはメールアドレスで検索
    @Query("SELECT u FROM User u WHERE " +
           "u.username LIKE %:keyword% OR " +
           "u.email LIKE %:keyword% OR " +
           "u.fullName LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
    
    // 複合検索
    @Query("SELECT u FROM User u WHERE " +
           "(:username IS NULL OR u.username LIKE %:username%) AND " +
           "(:email IS NULL OR u.email LIKE %:email%) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive)")
    List<User> searchUsersAdvanced(
        @Param("username") String username,
        @Param("email") String email,
        @Param("role") UserRole role,
        @Param("isActive") Boolean isActive
    );
}
