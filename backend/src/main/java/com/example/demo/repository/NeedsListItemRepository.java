package com.example.demo.repository;

import com.example.demo.entity.NeedsListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NeedsListItemRepository extends JpaRepository<NeedsListItem, Long> {
    
    List<NeedsListItem> findByNeedsListId(Long needsListId);
    
    void deleteByNeedsListId(Long needsListId);
    
    // 查找特定避难所最新需求清单中的特定商品
    @Query("SELECT nli FROM NeedsListItem nli " +
           "JOIN NeedsList nl ON nli.needsListId = nl.id " +
           "WHERE nli.productId = :productId AND nl.shelterId = :shelterId AND nl.isActive = true " +
           "ORDER BY nl.createdAt DESC")
    List<NeedsListItem> findByProductIdAndShelterIdFromLatestNeedsList(
        @Param("productId") String productId, 
        @Param("shelterId") Long shelterId);
}
