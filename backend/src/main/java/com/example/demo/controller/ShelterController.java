package com.example.demo.controller;

import com.example.demo.dto.ShelterDto;
import com.example.demo.entity.Shelter;
import com.example.demo.service.ShelterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shelters")
@CrossOrigin(origins = "*")
@Tag(name = "避難所", description = "避難所管理関連のAPI")
public class ShelterController {
    
    @Autowired
    private ShelterService shelterService;
    
    // 避難所登録
    @PostMapping
    @Operation(summary = "避難所登録", description = "新しい避難所を登録します")
    public ResponseEntity<Shelter> createShelter(@Valid @RequestBody ShelterDto shelterDto) {
        try {
            Shelter shelter = shelterService.createShelter(shelterDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(shelter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 避難所状況更新
    @PutMapping("/{id}/status")
    @Operation(summary = "避難所状況更新", description = "避難所の状況情報を更新します")
    public ResponseEntity<Shelter> updateShelterStatus(
            @PathVariable Long id, 
            @Valid @RequestBody ShelterDto shelterDto) {
        try {
            Shelter shelter = shelterService.updateShelterStatus(id, shelterDto);
            return ResponseEntity.ok(shelter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 避難所情報取得
    @GetMapping("/{id}")
    @Operation(summary = "避難所情報取得", description = "指定されたIDの避難所情報を取得します")
    public ResponseEntity<Shelter> getShelterById(@PathVariable Long id) {
        try {
            Shelter shelter = shelterService.getShelterById(id);
            return ResponseEntity.ok(shelter);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 全避難所取得
    @GetMapping
    @Operation(summary = "全避難所取得", description = "全てのアクティブな避難所を取得します")
    public ResponseEntity<List<Shelter>> getAllShelters() {
        try {
            List<Shelter> shelters = shelterService.getAllShelters();
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 避難所名で検索
    @GetMapping("/search/name")
    @Operation(summary = "避難所名検索", description = "避難所名で検索します")
    public ResponseEntity<List<Shelter>> searchByShelterName(@RequestParam String shelterName) {
        try {
            List<Shelter> shelters = shelterService.searchByShelterName(shelterName);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 住所で検索
    @GetMapping("/search/address")
    @Operation(summary = "住所検索", description = "住所で検索します")
    public ResponseEntity<List<Shelter>> searchByAddress(@RequestParam String address) {
        try {
            List<Shelter> shelters = shelterService.searchByAddress(address);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 代表者名で検索
    @GetMapping("/search/representative")
    @Operation(summary = "代表者名検索", description = "代表者名で検索します")
    public ResponseEntity<List<Shelter>> searchByRepresentativeName(
            @RequestParam String lastName, 
            @RequestParam String firstName) {
        try {
            List<Shelter> shelters = shelterService.searchByRepresentativeName(lastName, firstName);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 避難者数で検索
    @GetMapping("/search/evacuees")
    @Operation(summary = "避難者数検索", description = "指定された避難者数以上の避難所を検索します")
    public ResponseEntity<List<Shelter>> searchByEvacueeCount(@RequestParam Integer count) {
        try {
            List<Shelter> shelters = shelterService.searchByEvacueeCount(count);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // けが人数で検索
    @GetMapping("/search/injured")
    @Operation(summary = "けが人数検索", description = "指定されたけが人数以上の避難所を検索します")
    public ResponseEntity<List<Shelter>> searchByInjuredCount(@RequestParam Integer count) {
        try {
            List<Shelter> shelters = shelterService.searchByInjuredCount(count);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 複合検索
    @GetMapping("/search")
    @Operation(summary = "複合検索", description = "複数の条件で避難所を検索します")
    public ResponseEntity<List<Shelter>> searchShelters(
            @RequestParam(required = false) String shelterName,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Boolean isActive) {
        try {
            List<Shelter> shelters = shelterService.searchShelters(shelterName, address, isActive);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 避難所削除（論理削除）
    @DeleteMapping("/{id}")
    @Operation(summary = "避難所削除", description = "避難所を論理削除します")
    public ResponseEntity<Void> deleteShelter(@PathVariable Long id) {
        try {
            shelterService.deleteShelter(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
