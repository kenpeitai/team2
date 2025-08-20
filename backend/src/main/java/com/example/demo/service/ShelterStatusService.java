package com.example.demo.service;

import com.example.demo.entity.ShelterStatus;
import com.example.demo.entity.Shelter;
import com.example.demo.repository.ShelterStatusRepository;
import com.example.demo.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelterStatusService {

    @Autowired
    private ShelterStatusRepository shelterStatusRepository;

    @Autowired
    private ShelterRepository shelterRepository;

    // 最新の避難所状況取得
    public ShelterStatus getLatestStatus(Long shelterId) {
        return shelterStatusRepository.findFirstByShelterIdOrderByCreatedAtDesc(shelterId);
    }

    // 避難所状況更新・作成
    public ShelterStatus updateStatus(Long shelterId, com.example.demo.dto.ShelterStatusDto statusDto) {
        Optional<Shelter> shelterOpt = shelterRepository.findById(shelterId);
        if (!shelterOpt.isPresent()) {
            throw new RuntimeException("避難所が見つかりません: " + shelterId);
        }

        // 既存の状況を取得または新規作成
        ShelterStatus status = getLatestStatus(shelterId);
        if (status == null) {
            status = new ShelterStatus();
            status.setShelter(shelterOpt.get());
        }

        // 状況を更新
        status.setEvacueeCount(statusDto.getEvacueeCount());
        status.setInjuredCount(statusDto.getInjuredCount());
        status.setElectricityStatus(statusDto.getElectricityStatus());
        status.setGasStatus(statusDto.getGasStatus());
        status.setWaterStatus(statusDto.getWaterStatus());
        status.setTrafficStatus(statusDto.getTrafficStatus());

        return shelterStatusRepository.save(status);
    }

    // 避難所状況履歴取得
    public List<ShelterStatus> getStatusHistory(Long shelterId, int limit) {
        return shelterStatusRepository.findByShelterId(shelterId)
            .stream()
            .limit(limit)
            .collect(java.util.stream.Collectors.toList());
    }

    // 全避難所の状況概要取得
    public List<ShelterStatus> getAllSheltersSummary() {
        // 一時的に全避難所の状況を返す
        return shelterStatusRepository.findAll();
    }
}
