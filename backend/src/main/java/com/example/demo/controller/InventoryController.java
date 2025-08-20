package com.example.demo.controller;

import com.example.demo.dto.InventoryDto;
import com.example.demo.entity.Inventory;
import com.example.demo.entity.Shelter;
import com.example.demo.service.InventoryService;
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
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
@Tag(name = "在庫管理", description = "避難所の在庫管理API")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ShelterService shelterService;

    // 避難所の在庫一覧取得
    @GetMapping("/{shelterId}")
    @Operation(summary = "在庫一覧取得", description = "指定された避難所の在庫一覧を取得します")
    public ResponseEntity<List<InventoryDto>> getInventoryByShelter(@PathVariable Long shelterId) {
        try {
            List<Inventory> inventories = inventoryService.getInventoryByShelter(shelterId);
            List<InventoryDto> dtos = inventories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 在庫数量更新
    @PutMapping("/{id}")
    @Operation(summary = "在庫数量更新", description = "指定された在庫アイテムの数量を更新します")
    public ResponseEntity<InventoryDto> updateInventoryQuantity(
            @PathVariable Long id,
            @RequestBody @Valid InventoryDto inventoryDto) {
        try {
            Inventory updatedInventory = inventoryService.updateInventoryQuantity(id, inventoryDto.getQuantity());
            return ResponseEntity.ok(convertToDto(updatedInventory));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 在庫アイテム追加
    @PostMapping
    @Operation(summary = "在庫アイテム追加", description = "新しい在庫アイテムを追加します")
    public ResponseEntity<InventoryDto> addInventoryItem(@RequestBody @Valid InventoryDto inventoryDto) {
        try {
            Inventory newInventory = inventoryService.addInventoryItem(inventoryDto);
            return ResponseEntity.status(201).body(convertToDto(newInventory));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 在庫アイテム削除
    @DeleteMapping("/{id}")
    @Operation(summary = "在庫アイテム削除", description = "指定された在庫アイテムを削除します")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable Long id) {
        try {
            inventoryService.deleteInventoryItem(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 在庫アイテム検索
    @GetMapping("/{shelterId}/search")
    @Operation(summary = "在庫検索", description = "避難所の在庫を検索します")
    public ResponseEntity<List<InventoryDto>> searchInventory(
            @PathVariable Long shelterId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {
        try {
            List<Inventory> inventories = inventoryService.searchInventory(shelterId, keyword, category);
            List<InventoryDto> dtos = inventories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 在庫アイテムをDTOに変換
    private InventoryDto convertToDto(Inventory inventory) {
        InventoryDto dto = new InventoryDto();
        dto.setId(inventory.getId());
        dto.setShelterId(inventory.getShelter().getId());
        dto.setName(inventory.getName());
        dto.setQuantity(inventory.getQuantity());
        dto.setCategory(inventory.getCategory());
        dto.setCreatedAt(inventory.getCreatedAt());
        dto.setUpdatedAt(inventory.getUpdatedAt());
        return dto;
    }
}
