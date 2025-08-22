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
    
    // メールアドレスで検索
    Optional<User> findByEmail(String email);
    
    // メールアドレスの重複チェック
    boolean existsByEmail(String email);
    
    // ユーザー名の重複チェック
    boolean existsByUsername(String username);
    
    // ロールで検索
    List<User> findByRole(UserRole role);
    
    // アクティブなユーザーのみ取得
    List<User> findByIsActiveTrue();
    
    // メールアドレスまたは氏名で検索
    @Query("SELECT u FROM User u WHERE " +
           "u.email LIKE %:keyword% OR " +
           "u.fullName LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
    
    // 複合検索
    @Query("SELECT u FROM User u WHERE " +
           "(:email IS NULL OR u.email LIKE %:email%) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive)")
    List<User> searchUsersAdvanced(
        @Param("email") String email,
        @Param("role") UserRole role,
        @Param("isActive") Boolean isActive
    );
}
