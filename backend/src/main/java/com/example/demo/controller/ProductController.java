package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.entity.ProductCategory;
import com.example.demo.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@Tag(name = "商品", description = "商品管理関連のAPI")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    // 商品作成
    @PostMapping
    @Operation(summary = "商品作成", description = "新しい商品を作成します")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 商品更新
    @PutMapping("/{id}")
    @Operation(summary = "商品更新", description = "商品情報を更新します")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id, 
            @Valid @RequestBody Product productDetails) {
        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 商品削除（ソフト削除）
    @DeleteMapping("/{id}")
    @Operation(summary = "商品削除", description = "商品を削除します（ソフト削除）")
    public ResponseEntity<Product> deleteProduct(@PathVariable Long id) {
        try {
            Product deletedProduct = productService.deleteProduct(id);
            return ResponseEntity.ok(deletedProduct);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 商品詳細取得
    @GetMapping("/{id}")
    @Operation(summary = "商品詳細取得", description = "指定されたIDの商品詳細を取得します")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 商品IDで取得
    @GetMapping("/product-id/{productId}")
    @Operation(summary = "商品ID検索", description = "商品IDで商品を検索します")
    public ResponseEntity<Product> getProductByProductId(@PathVariable String productId) {
        try {
            Product product = productService.getProductByProductId(productId);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 全商品取得（アクティブのみ）
    @GetMapping
    @Operation(summary = "全商品取得", description = "アクティブな商品の一覧を取得します")
    public ResponseEntity<List<Product>> getAllActiveProducts() {
        try {
            List<Product> products = productService.getAllActiveProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // カテゴリ別商品取得
    @GetMapping("/category/{category}")
    @Operation(summary = "カテゴリ別商品取得", description = "指定されたカテゴリの商品を取得します")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable ProductCategory category) {
        try {
            List<Product> products = productService.getProductsByCategory(category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // キーワード検索
    @GetMapping("/search")
    @Operation(summary = "キーワード検索", description = "キーワードで商品を検索します")
    public ResponseEntity<List<Product>> searchProductsByKeyword(@RequestParam String keyword) {
        try {
            List<Product> products = productService.searchProductsByKeyword(keyword);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // カテゴリとキーワード検索
    @GetMapping("/search/category")
    @Operation(summary = "カテゴリ・キーワード検索", description = "カテゴリとキーワードで商品を検索します")
    public ResponseEntity<List<Product>> searchProductsByCategoryAndKeyword(
            @RequestParam ProductCategory category, 
            @RequestParam String keyword) {
        try {
            List<Product> products = productService.searchProductsByCategoryAndKeyword(category, keyword);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 画像検証状態更新
    @PutMapping("/{id}/image-verification")
    @Operation(summary = "画像検証状態更新", description = "商品の画像検証状態を更新します")
    public ResponseEntity<Product> updateImageVerification(
            @PathVariable Long id, 
            @RequestParam boolean verified) {
        try {
            Product product = productService.updateImageVerification(id, verified);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 推奨使用量範囲で商品取得
    @GetMapping("/recommended-usage")
    @Operation(summary = "推奨使用量範囲検索", description = "推奨使用量の範囲で商品を検索します")
    public ResponseEntity<List<Product>> getProductsByRecommendedUsage(
            @RequestParam Double minUsage, 
            @RequestParam Double maxUsage) {
        try {
            List<Product> products = productService.getProductsByRecommendedUsage(minUsage, maxUsage);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 重量範囲で商品取得
    @GetMapping("/weight-range")
    @Operation(summary = "重量範囲検索", description = "重量の範囲で商品を検索します")
    public ResponseEntity<List<Product>> getProductsByWeightRange(
            @RequestParam Integer minWeight, 
            @RequestParam Integer maxWeight) {
        try {
            List<Product> products = productService.getProductsByWeightRange(minWeight, maxWeight);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
