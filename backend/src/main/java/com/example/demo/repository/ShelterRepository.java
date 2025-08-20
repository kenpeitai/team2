package com.example.demo.repository;

import com.example.demo.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {
    
    // メールアドレスで検索
    Optional<Shelter> findByEmail(String email);
    
    // 避難所名で検索
    List<Shelter> findByShelterNameContainingIgnoreCase(String shelterName);
    
    // 住所で検索
    List<Shelter> findByShelterAddressContainingIgnoreCase(String address);
    
    // 代表者名で検索
    List<Shelter> findByRepresentativeLastNameContainingIgnoreCaseOrRepresentativeFirstNameContainingIgnoreCase(
        String lastName, String firstName);
    
    // アクティブな避難所のみ取得
    List<Shelter> findByIsActiveTrue();
    
    // 避難者数で検索
    List<Shelter> findByEvacueeCountGreaterThan(Integer count);
    
    // けが人数で検索
    List<Shelter> findByInjuredCountGreaterThan(Integer count);
    
    // 複合検索
    @Query("SELECT s FROM Shelter s WHERE " +
           "(:shelterName IS NULL OR s.shelterName LIKE %:shelterName%) AND " +
           "(:address IS NULL OR s.shelterAddress LIKE %:address%) AND " +
           "(:isActive IS NULL OR s.isActive = :isActive)")
    List<Shelter> searchShelters(
        @Param("shelterName") String shelterName,
        @Param("address") String address,
        @Param("isActive") Boolean isActive
    );
    
    // メールアドレスの重複チェック
    boolean existsByEmail(String email);
    
    // 避難所名の重複チェック
    boolean existsByShelterName(String shelterName);
}
