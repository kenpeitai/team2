package com.example.demo.controller;

import com.example.demo.dto.NeedsListDto;
import com.example.demo.dto.ProductDto;
import com.example.demo.entity.*;
import com.example.demo.repository.NeedsListItemRepository;
import com.example.demo.repository.NeedsListRepository;
import com.example.demo.repository.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supplies")
@CrossOrigin(origins = "*")
@Tag(name = "必要物資", description = "必要物資管理関連のAPI")
public class SupplyController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private NeedsListRepository needsListRepository;
    
    @Autowired
    private NeedsListItemRepository needsListItemRepository;
    
    // === 商品管理 ===
    
    // 全商品取得
    @GetMapping("/products")
    @Operation(summary = "全商品取得", description = "全てのアクティブな商品を取得します")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        try {
            List<Product> products = productRepository.findByIsActiveTrue();
            List<ProductDto> productDtos = products.stream()
                .map(this::convertToProductDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(productDtos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 商品登録
    @PostMapping("/products")
    @Operation(summary = "商品登録", description = "新しい商品を登録します")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto productDto) {
        try {
            Product product = convertToProduct(productDto);
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());
            
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToProductDto(savedProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 商品更新
    @PutMapping("/products/{id}")
    @Operation(summary = "商品更新", description = "商品情報を更新します")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto) {
        try {
            Optional<Product> existingProduct = productRepository.findById(id);
            if (existingProduct.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Product product = existingProduct.get();
            updateProductFromDto(product, productDto);
            product.setUpdatedAt(LocalDateTime.now());
            
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.ok(convertToProductDto(savedProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 商品検索
    @GetMapping("/products/search")
    @Operation(summary = "商品検索", description = "キーワードで商品を検索します")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String keyword) {
        try {
            List<Product> products = productRepository.searchByKeyword(keyword);
            List<ProductDto> productDtos = products.stream()
                .map(this::convertToProductDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(productDtos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // === 必要物資リスト管理 ===
    
    // 必要物資リスト作成
    @PostMapping("/needs-lists")
    @Operation(summary = "必要物資リスト作成", description = "新しい必要物資リストを作成します")
    public ResponseEntity<NeedsListDto> createNeedsList(@Valid @RequestBody NeedsListDto needsListDto) {
        try {
            // メインリスト保存
            NeedsList needsList = convertToNeedsList(needsListDto);
            needsList.setCreatedAt(LocalDateTime.now());
            needsList.setUpdatedAt(LocalDateTime.now());
            
            NeedsList savedNeedsList = needsListRepository.save(needsList);
            
            // 明細項目保存
            if (needsListDto.getItems() != null) {
                for (NeedsListDto.NeedsListItemDto itemDto : needsListDto.getItems()) {
                    NeedsListItem item = convertToNeedsListItem(itemDto, savedNeedsList.getId());
                    item.setCreatedAt(LocalDateTime.now());
                    item.setUpdatedAt(LocalDateTime.now());
                    needsListItemRepository.save(item);
                }
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToNeedsListDto(savedNeedsList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 避難所の必要物資リスト取得
    @GetMapping("/needs-lists/shelter/{shelterId}")
    @Operation(summary = "避難所の必要物資リスト取得", description = "指定された避難所の必要物資リストを取得します")
    public ResponseEntity<List<NeedsListDto>> getNeedsListsByShelter(@PathVariable Long shelterId) {
        try {
            List<NeedsList> needsLists = needsListRepository.findByShelterIdAndIsActiveTrue(shelterId);
            List<NeedsListDto> needsListDtos = needsLists.stream()
                .map(this::convertToNeedsListDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(needsListDtos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 必要物資リスト詳細取得
    @GetMapping("/needs-lists/{id}")
    @Operation(summary = "必要物資リスト詳細取得", description = "指定されたIDの必要物資リストの詳細を取得します")
    public ResponseEntity<NeedsListDto> getNeedsListById(@PathVariable Long id) {
        try {
            Optional<NeedsList> needsList = needsListRepository.findById(id);
            if (needsList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            NeedsListDto needsListDto = convertToNeedsListDto(needsList.get());
            
            // 明細項目も取得
            List<NeedsListItem> items = needsListItemRepository.findByNeedsListId(id);
            List<NeedsListDto.NeedsListItemDto> itemDtos = items.stream()
                .map(this::convertToNeedsListItemDto)
                .collect(Collectors.toList());
            needsListDto.setItems(itemDtos);
            
            return ResponseEntity.ok(needsListDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 必要物資リスト削除
    @DeleteMapping("/needs-lists/{id}")
    @Operation(summary = "必要物資リスト削除", description = "必要物資リストを論理削除します")
    public ResponseEntity<Void> deleteNeedsList(@PathVariable Long id) {
        try {
            Optional<NeedsList> needsList = needsListRepository.findById(id);
            if (needsList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            NeedsList list = needsList.get();
            list.setIsActive(false);
            list.setUpdatedAt(LocalDateTime.now());
            needsListRepository.save(list);
            
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // === 変換メソッド ===
    
    private ProductDto convertToProductDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setUnit(product.getUnit());
        dto.setWeightGrams(product.getWeightGrams());
        dto.setRecommendedPerPersonPerDay(product.getRecommendedPerPersonPerDay());
        dto.setImageUrl(product.getImageUrl());
        dto.setImageVerified(product.getImageVerified());
        dto.setCategory(product.getCategory());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
    
    private Product convertToProduct(ProductDto dto) {
        Product product = new Product();
        product.setProductId(dto.getProductId());
        product.setName(dto.getName());
        product.setUnit(dto.getUnit());
        product.setWeightGrams(dto.getWeightGrams());
        product.setRecommendedPerPersonPerDay(dto.getRecommendedPerPersonPerDay());
        product.setImageUrl(dto.getImageUrl());
        product.setImageVerified(dto.getImageVerified());
        product.setCategory(dto.getCategory());
        product.setIsActive(dto.getIsActive());
        return product;
    }
    
    private void updateProductFromDto(Product product, ProductDto dto) {
        product.setName(dto.getName());
        product.setUnit(dto.getUnit());
        product.setWeightGrams(dto.getWeightGrams());
        product.setRecommendedPerPersonPerDay(dto.getRecommendedPerPersonPerDay());
        product.setImageUrl(dto.getImageUrl());
        product.setImageVerified(dto.getImageVerified());
        product.setCategory(dto.getCategory());
        product.setIsActive(dto.getIsActive());
    }
    
    private NeedsListDto convertToNeedsListDto(NeedsList needsList) {
        NeedsListDto dto = new NeedsListDto();
        dto.setId(needsList.getId());
        dto.setShelterId(needsList.getShelterId());
        dto.setEvacueeCount(needsList.getEvacueeCount());
        dto.setTargetDays(needsList.getTargetDays());
        dto.setTotalUnits(needsList.getTotalUnits());
        dto.setTotalWeightGrams(needsList.getTotalWeightGrams());
        dto.setWaterCases(needsList.getWaterCases());
        dto.setIsActive(needsList.getIsActive());
        dto.setCreatedAt(needsList.getCreatedAt());
        dto.setUpdatedAt(needsList.getUpdatedAt());
        return dto;
    }
    
    private NeedsList convertToNeedsList(NeedsListDto dto) {
        NeedsList needsList = new NeedsList();
        needsList.setShelterId(dto.getShelterId());
        needsList.setEvacueeCount(dto.getEvacueeCount());
        needsList.setTargetDays(dto.getTargetDays());
        needsList.setTotalUnits(dto.getTotalUnits());
        needsList.setTotalWeightGrams(dto.getTotalWeightGrams());
        needsList.setWaterCases(dto.getWaterCases());
        needsList.setIsActive(dto.getIsActive());
        return needsList;
    }
    
    private NeedsListItem convertToNeedsListItem(NeedsListDto.NeedsListItemDto dto, Long needsListId) {
        NeedsListItem item = new NeedsListItem();
        item.setNeedsListId(needsListId);
        item.setProductId(dto.getProductId());
        item.setProductName(dto.getProductName());
        item.setUnit(dto.getUnit());
        item.setCategory(dto.getCategory());
        item.setQuantity(dto.getQuantity());
        item.setPriority(dto.getPriority());
        item.setNotes(dto.getNotes());
        item.setPerUnitWeightGrams(dto.getPerUnitWeightGrams());
        item.setTotalWeightGrams(dto.getTotalWeightGrams());
        item.setDroneEligible(dto.getDroneEligible());
        item.setDroneEligibleWholeOrder(dto.getDroneEligibleWholeOrder());
        item.setDronePerUnitEligible(dto.getDronePerUnitEligible());
        item.setDroneUnitsPerFlight(dto.getDroneUnitsPerFlight());
        item.setDroneFlightsRequired(dto.getDroneFlightsRequired());
        return item;
    }
    
    private NeedsListDto.NeedsListItemDto convertToNeedsListItemDto(NeedsListItem item) {
        NeedsListDto.NeedsListItemDto dto = new NeedsListDto.NeedsListItemDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProductId());
        dto.setProductName(item.getProductName());
        dto.setUnit(item.getUnit());
        dto.setCategory(item.getCategory());
        dto.setQuantity(item.getQuantity());
        dto.setPriority(item.getPriority());
        dto.setNotes(item.getNotes());
        dto.setPerUnitWeightGrams(item.getPerUnitWeightGrams());
        dto.setTotalWeightGrams(item.getTotalWeightGrams());
        dto.setDroneEligible(item.getDroneEligible());
        dto.setDroneEligibleWholeOrder(item.getDroneEligibleWholeOrder());
        dto.setDronePerUnitEligible(item.getDronePerUnitEligible());
        dto.setDroneUnitsPerFlight(item.getDroneUnitsPerFlight());
        dto.setDroneFlightsRequired(item.getDroneFlightsRequired());
        return dto;
    }
}
