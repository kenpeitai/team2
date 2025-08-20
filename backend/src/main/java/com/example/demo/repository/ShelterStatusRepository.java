package com.example.demo.repository;

import com.example.demo.entity.ShelterStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShelterStatusRepository extends JpaRepository<ShelterStatus, Long> {

    // 避難所IDで状況一覧取得
    List<ShelterStatus> findByShelterId(Long shelterId);

    // 避難所IDで最新の状況取得
    ShelterStatus findFirstByShelterIdOrderByCreatedAtDesc(Long shelterId);
}
