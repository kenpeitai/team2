package com.example.demo.repository;

import com.example.demo.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // 避難所IDで在庫一覧取得
    List<Inventory> findByShelterId(Long shelterId);

    // 避難所IDとカテゴリーで在庫一覧取得
    List<Inventory> findByShelterIdAndCategory(Long shelterId, String category);

    // 避難所IDとキーワードで在庫検索
    List<Inventory> findByShelterIdAndNameContaining(Long shelterId, String name);

    // 避難所ID、カテゴリー、キーワードで在庫検索
    List<Inventory> findByShelterIdAndNameContainingAndCategory(Long shelterId, String name, String category);

    // カテゴリー別在庫数集計
    @Query("SELECT i.category, COUNT(i) FROM Inventory i WHERE i.shelter.id = :shelterId GROUP BY i.category")
    List<Object[]> countByCategory(@Param("shelterId") Long shelterId);
}
