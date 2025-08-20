package com.example.demo.service;

import com.example.demo.entity.NeedsList;
import com.example.demo.entity.NeedsListItem;
import com.example.demo.entity.Shelter;
import com.example.demo.entity.Priority;
import com.example.demo.entity.ProductCategory;
import com.example.demo.repository.NeedsListRepository;
import com.example.demo.repository.NeedsListItemRepository;
import com.example.demo.repository.ShelterRepository;
import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NeedsListService {
    
    @Autowired
    private NeedsListRepository needsListRepository;
    
    @Autowired
    private NeedsListItemRepository needsListItemRepository;
    
    @Autowired
    private ShelterRepository shelterRepository;
    
    // 需求清单创建
    public NeedsList createNeedsList(NeedsList needsList) {
        // 验证避难所是否存在
        shelterRepository.findById(needsList.getShelterId())
            .orElseThrow(() -> new ResourceNotFoundException("避難所が見つかりません: " + needsList.getShelterId()));
        
        needsList.setCreatedAt(LocalDateTime.now());
        needsList.setUpdatedAt(LocalDateTime.now());
        
        return needsListRepository.save(needsList);
    }
    
    // 需求清单更新
    public NeedsList updateNeedsList(Long id, NeedsList needsListDetails) {
        NeedsList needsList = needsListRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ニーズリストが見つかりません: " + id));
        
        needsList.setShelterId(needsListDetails.getShelterId());
        needsList.setEvacueeCount(needsListDetails.getEvacueeCount());
        needsList.setTargetDays(needsListDetails.getTargetDays());
        needsList.setTotalUnits(needsListDetails.getTotalUnits());
        needsList.setTotalWeightGrams(needsListDetails.getTotalWeightGrams());
        needsList.setWaterCases(needsListDetails.getWaterCases());
        needsList.setIsActive(needsListDetails.getIsActive());
        needsList.setUpdatedAt(LocalDateTime.now());
        
        return needsListRepository.save(needsList);
    }
    
    // 需求清单删除
    public void deleteNeedsList(Long id) {
        NeedsList needsList = needsListRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ニーズリストが見つかりません: " + id));
        
        needsListRepository.delete(needsList);
    }
    
    // 根据ID获取需求清单
    public NeedsList getNeedsListById(Long id) {
        return needsListRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ニーズリストが見つかりません: " + id));
    }
    
    // 根据避难所获取需求清单
    public List<NeedsList> getNeedsListsByShelter(Long shelterId) {
        return needsListRepository.findByShelterId(shelterId);
    }
    
    // 根据避难所获取活跃的需求清单
    public List<NeedsList> getActiveNeedsListsByShelter(Long shelterId) {
        return needsListRepository.findByShelterIdAndIsActiveTrue(shelterId);
    }
    
    // 获取所有活跃的需求清单
    public List<NeedsList> getAllActiveNeedsLists() {
        return needsListRepository.findAll().stream()
            .filter(NeedsList::getIsActive)
            .toList();
    }
    
    // 添加需求清单项目
    public NeedsListItem addNeedsListItem(Long needsListId, NeedsListItem item) {
        NeedsList needsList = needsListRepository.findById(needsListId)
            .orElseThrow(() -> new ResourceNotFoundException("ニーズリストが見つかりません: " + needsListId));
        
        item.setNeedsListId(needsListId);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        
        return needsListItemRepository.save(item);
    }
    
    // 更新需求清单项目
    public NeedsListItem updateNeedsListItem(Long itemId, NeedsListItem itemDetails) {
        NeedsListItem item = needsListItemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("ニーズリストアイテムが見つかりません: " + itemId));
        
        item.setProductId(itemDetails.getProductId());
        item.setProductName(itemDetails.getProductName());
        item.setQuantity(itemDetails.getQuantity());
        item.setUnit(itemDetails.getUnit());
        item.setCategory(itemDetails.getCategory());
        item.setPriority(itemDetails.getPriority());
        item.setNotes(itemDetails.getNotes());
        item.setPerUnitWeightGrams(itemDetails.getPerUnitWeightGrams());
        item.setTotalWeightGrams(itemDetails.getTotalWeightGrams());
        item.setDroneEligible(itemDetails.getDroneEligible());
        item.setDroneEligibleWholeOrder(itemDetails.getDroneEligibleWholeOrder());
        item.setDronePerUnitEligible(itemDetails.getDronePerUnitEligible());
        item.setDroneUnitsPerFlight(itemDetails.getDroneUnitsPerFlight());
        item.setDroneFlightsRequired(itemDetails.getDroneFlightsRequired());
        item.setUpdatedAt(LocalDateTime.now());
        
        return needsListItemRepository.save(item);
    }
    
    // 删除需求清单项目
    public void deleteNeedsListItem(Long itemId) {
        NeedsListItem item = needsListItemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("ニーズリストアイテムが見つかりません: " + itemId));
        
        needsListItemRepository.delete(item);
    }
    
    // 根据需求清单获取所有项目
    public List<NeedsListItem> getNeedsListItems(Long needsListId) {
        return needsListItemRepository.findByNeedsListId(needsListId);
    }
    
    // 根据优先级获取项目
    public List<NeedsListItem> getItemsByPriority(Long needsListId, Priority priority) {
        return needsListItemRepository.findByNeedsListId(needsListId).stream()
            .filter(item -> item.getPriority() == priority)
            .toList();
    }
    
    // 根据分类获取项目
    public List<NeedsListItem> getItemsByCategory(Long needsListId, ProductCategory category) {
        return needsListItemRepository.findByNeedsListId(needsListId).stream()
            .filter(item -> item.getCategory() == category)
            .toList();
    }
    
    // 计算需求清单总重量
    public Integer calculateTotalWeight(Long needsListId) {
        return needsListItemRepository.findByNeedsListId(needsListId).stream()
            .mapToInt(item -> item.getTotalWeightGrams() != null ? item.getTotalWeightGrams() : 0)
            .sum();
    }
    
    // 计算需求清单总单位数
    public Integer calculateTotalUnits(Long needsListId) {
        return needsListItemRepository.findByNeedsListId(needsListId).stream()
            .mapToInt(item -> item.getQuantity() != null ? item.getQuantity() : 0)
            .sum();
    }
}
