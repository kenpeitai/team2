package com.example.demo.controller;

import com.example.demo.dto.ShelterStatusDto;
import com.example.demo.entity.ShelterStatus;
import com.example.demo.entity.Shelter;
import com.example.demo.service.ShelterStatusService;
import com.example.demo.service.ShelterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shelter-status")
@CrossOrigin(origins = "*")
@Tag(name = "避難所状況管理", description = "避難所の状況管理API")
public class ShelterStatusController {

    @Autowired
    private ShelterStatusService shelterStatusService;

    @Autowired
    private ShelterService shelterService;

    // 避難所状況取得
    @GetMapping("/{shelterId}")
    @Operation(summary = "避難所状況取得", description = "指定された避難所の最新状況を取得します")
    public ResponseEntity<ShelterStatusDto> getShelterStatus(@PathVariable Long shelterId) {
        try {
            ShelterStatus status = shelterStatusService.getLatestStatus(shelterId);
            if (status != null) {
                return ResponseEntity.ok(convertToDto(status));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 避難所状況更新・作成
    @PutMapping("/{shelterId}")
    @Operation(summary = "避難所状況更新", description = "避難所の状況を更新または新規作成します")
    public ResponseEntity<ShelterStatusDto> updateShelterStatus(
            @PathVariable Long shelterId,
            @RequestBody @Valid ShelterStatusDto statusDto) {
        try {
            ShelterStatus updatedStatus = shelterStatusService.updateStatus(shelterId, statusDto);
            return ResponseEntity.ok(convertToDto(updatedStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 避難所状況履歴取得
    @GetMapping("/{shelterId}/history")
    @Operation(summary = "状況履歴取得", description = "避難所の状況履歴を取得します")
    public ResponseEntity<List<ShelterStatusDto>> getShelterStatusHistory(
            @PathVariable Long shelterId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<ShelterStatus> history = shelterStatusService.getStatusHistory(shelterId, limit);
            List<ShelterStatusDto> dtos = history.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 全避難所の状況概要取得
    @GetMapping("/summary")
    @Operation(summary = "全避難所状況概要", description = "全避難所の状況概要を取得します")
    public ResponseEntity<List<ShelterStatusDto>> getAllSheltersSummary() {
        try {
            List<ShelterStatus> summaries = shelterStatusService.getAllSheltersSummary();
            List<ShelterStatusDto> dtos = summaries.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 避難所状況をDTOに変換
    private ShelterStatusDto convertToDto(ShelterStatus status) {
        ShelterStatusDto dto = new ShelterStatusDto();
        dto.setId(status.getId());
        dto.setShelterId(status.getShelter().getId());
        dto.setEvacueeCount(status.getEvacueeCount());
        dto.setInjuredCount(status.getInjuredCount());
        dto.setElectricityStatus(status.getElectricityStatus());
        dto.setGasStatus(status.getGasStatus());
        dto.setWaterStatus(status.getWaterStatus());
        dto.setTrafficStatus(status.getTrafficStatus());
        dto.setCreatedAt(status.getCreatedAt());
        dto.setUpdatedAt(status.getUpdatedAt());
        return dto;
    }
}
