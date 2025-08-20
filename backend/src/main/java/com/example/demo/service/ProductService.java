package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.entity.ProductCategory;
import com.example.demo.repository.ProductRepository;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // 产品创建
    public Product createProduct(Product product) {
        // 产品ID重複チェック
        if (productRepository.findByProductId(product.getProductId()).isPresent()) {
            throw new DuplicateResourceException("この商品IDは既に使用されています: " + product.getProductId());
        }
        
        product.setIsActive(true);
        return productRepository.save(product);
    }
    
    // 产品更新
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("商品が見つかりません: " + id));
        
        // 产品ID重複チェック（自分以外）
        if (!product.getProductId().equals(productDetails.getProductId()) && 
            productRepository.findByProductId(productDetails.getProductId()).isPresent()) {
            throw new DuplicateResourceException("この商品IDは既に使用されています: " + productDetails.getProductId());
        }
        
        product.setProductId(productDetails.getProductId());
        product.setName(productDetails.getName());
        product.setUnit(productDetails.getUnit());
        product.setWeightGrams(productDetails.getWeightGrams());
        product.setRecommendedPerPersonPerDay(productDetails.getRecommendedPerPersonPerDay());
        product.setCategory(productDetails.getCategory());
        product.setImageUrl(productDetails.getImageUrl());
        product.setImageVerified(productDetails.getImageVerified());
        product.setIsActive(productDetails.getIsActive());
        
        return productRepository.save(product);
    }
    
    // 产品删除（软删除）
    public Product deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("商品が見つかりません: " + id));
        
        product.setIsActive(false);
        return productRepository.save(product);
    }
    
    // 根据ID获取产品
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("商品が見つかりません: " + id));
    }
    
    // 根据产品ID获取产品
    public Product getProductByProductId(String productId) {
        return productRepository.findByProductId(productId)
            .orElseThrow(() -> new ResourceNotFoundException("商品が見つかりません: " + productId));
    }
    
    // 获取所有活跃产品
    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }
    
    // 根据分类获取产品
    public List<Product> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category);
    }
    
    // 关键词搜索产品
    public List<Product> searchProductsByKeyword(String keyword) {
        return productRepository.searchByKeyword(keyword);
    }
    
    // 根据分类和关键词搜索产品
    public List<Product> searchProductsByCategoryAndKeyword(ProductCategory category, String keyword) {
        return productRepository.searchByCategoryAndKeyword(category, keyword);
    }
    
    // 更新图片验证状态
    public Product updateImageVerification(Long id, boolean verified) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("商品が見つかりません: " + id));
        
        product.setImageVerified(verified);
        return productRepository.save(product);
    }
    
    // 根据推荐用量获取产品
    public List<Product> getProductsByRecommendedUsage(Double minUsage, Double maxUsage) {
        return productRepository.findAll().stream()
            .filter(p -> p.getRecommendedPerPersonPerDay() != null && 
                        p.getRecommendedPerPersonPerDay() >= minUsage && 
                        p.getRecommendedPerPersonPerDay() <= maxUsage)
            .toList();
    }
    
    // 根据重量范围获取产品
    public List<Product> getProductsByWeightRange(Integer minWeight, Integer maxWeight) {
        return productRepository.findAll().stream()
            .filter(p -> p.getWeightGrams() != null && 
                        p.getWeightGrams() >= minWeight && 
                        p.getWeightGrams() <= maxWeight)
            .toList();
    }
}
