package com.example.demo.service;

import com.example.demo.entity.Inventory;
import com.example.demo.entity.Shelter;
import com.example.demo.repository.InventoryRepository;
import com.example.demo.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ShelterRepository shelterRepository;

    // 避難所の在庫一覧取得
    public List<Inventory> getInventoryByShelter(Long shelterId) {
        return inventoryRepository.findByShelterId(shelterId);
    }

    // 在庫数量更新
    public Inventory updateInventoryQuantity(Long id, Integer quantity) {
        Optional<Inventory> optional = inventoryRepository.findById(id);
        if (optional.isPresent()) {
            Inventory inventory = optional.get();
            inventory.setQuantity(quantity);
            return inventoryRepository.save(inventory);
        }
        throw new RuntimeException("在庫アイテムが見つかりません: " + id);
    }

    // 在庫アイテム追加
    public Inventory addInventoryItem(com.example.demo.dto.InventoryDto inventoryDto) {
        Optional<Shelter> shelterOpt = shelterRepository.findById(inventoryDto.getShelterId());
        if (!shelterOpt.isPresent()) {
            throw new RuntimeException("避難所が見つかりません: " + inventoryDto.getShelterId());
        }

        Inventory inventory = new Inventory();
        inventory.setShelter(shelterOpt.get());
        inventory.setName(inventoryDto.getName());
        inventory.setQuantity(inventoryDto.getQuantity());
        inventory.setCategory(inventoryDto.getCategory());

        return inventoryRepository.save(inventory);
    }

    // 在庫アイテム削除
    public void deleteInventoryItem(Long id) {
        inventoryRepository.deleteById(id);
    }

    // 在庫検索
    public List<Inventory> searchInventory(Long shelterId, String keyword, String category) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            if (category != null && !category.trim().isEmpty()) {
                return inventoryRepository.findByShelterIdAndNameContainingAndCategory(shelterId, keyword, category);
            } else {
                return inventoryRepository.findByShelterIdAndNameContaining(shelterId, keyword);
            }
        } else if (category != null && !category.trim().isEmpty()) {
            return inventoryRepository.findByShelterIdAndCategory(shelterId, category);
        } else {
            return inventoryRepository.findByShelterId(shelterId);
        }
    }
}
