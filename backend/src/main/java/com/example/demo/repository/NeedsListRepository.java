package com.example.demo.repository;

import com.example.demo.entity.NeedsList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NeedsListRepository extends JpaRepository<NeedsList, Long> {
    
    List<NeedsList> findByShelterId(Long shelterId);
    
    List<NeedsList> findByShelterIdAndIsActiveTrue(Long shelterId);
    
    @Query("SELECT nl FROM NeedsList nl WHERE nl.isActive = true AND nl.evacueeCount >= :minEvacueeCount")
    List<NeedsList> findByMinEvacueeCount(@Param("minEvacueeCount") Integer minEvacueeCount);
    
    @Query("SELECT nl FROM NeedsList nl WHERE nl.isActive = true AND nl.totalWeightGrams >= :minWeight")
    List<NeedsList> findByMinWeight(@Param("minWeight") Integer minWeight);
    
    // 避難所の最新の必要物資リスト取得
    @Query("SELECT nl FROM NeedsList nl WHERE nl.shelterId = :shelterId AND nl.isActive = true ORDER BY nl.createdAt DESC")
    List<NeedsList> findLatestByShelterId(@Param("shelterId") Long shelterId);
}
