package com.example.demo.service;

import com.example.demo.dto.CartDto;
import com.example.demo.dto.CartItemDto;
import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.User;
import com.example.demo.entity.Shelter;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ShelterRepository;
import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ShelterRepository shelterRepository;
    
    // 获取用户的购物车
    public CartDto getUserCart(Long userId, Long shelterId) {
        // 验证用户是否存在
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));
        
        // 验证避难所是否存在
        Shelter shelter = shelterRepository.findById(shelterId)
            .orElseThrow(() -> new ResourceNotFoundException("避難所が見つかりません: " + shelterId));
        
        // 查找或创建购物车
        Optional<Cart> existingCart = cartRepository.findByUserIdAndShelterId(userId, shelterId);
        Cart cart;
        
        if (existingCart.isPresent()) {
            cart = existingCart.get();
        } else {
            cart = new Cart();
            cart.setUserId(userId);
            cart.setShelterId(shelterId);
            cart.setIsActive(true);
            cart.setCreatedAt(LocalDateTime.now());
            cart.setUpdatedAt(LocalDateTime.now());
            cart = cartRepository.save(cart);
        }
        
        // 获取购物车项目
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        List<CartItemDto> itemDtos = cartItems.stream()
            .map(this::convertToCartItemDto)
            .collect(Collectors.toList());
        
        CartDto cartDto = convertToCartDto(cart);
        cartDto.setItems(itemDtos);
        
        return cartDto;
    }
    
    // 添加商品到购物车
    public CartItemDto addItemToCart(Long userId, Long shelterId, CartItemDto itemDto) {
        // 获取或创建购物车
        Cart cart = getOrCreateCart(userId, shelterId);
        
        // 检查商品是否已存在
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), itemDto.getProductId());
        
        CartItem cartItem;
        if (existingItem.isPresent()) {
            // 更新现有商品数量
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + itemDto.getQuantity());
            cartItem.setUpdatedAt(LocalDateTime.now());
        } else {
            // 创建新商品
            cartItem = new CartItem();
            cartItem.setCartId(cart.getId());
            cartItem.setProductId(itemDto.getProductId());
            cartItem.setProductName(itemDto.getProductName());
            cartItem.setUnit(itemDto.getUnit());
            cartItem.setCategory(itemDto.getCategory());
            cartItem.setQuantity(itemDto.getQuantity());
            cartItem.setPricePerUnit(itemDto.getPricePerUnit());
            cartItem.setTotalPrice(itemDto.getPricePerUnit() * itemDto.getQuantity());
            cartItem.setNotes(itemDto.getNotes());
            cartItem.setCreatedAt(LocalDateTime.now());
            cartItem.setUpdatedAt(LocalDateTime.now());
        }
        
        cartItem = cartItemRepository.save(cartItem);
        
        // 更新购物车时间戳
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        
        return convertToCartItemDto(cartItem);
    }
    
    // 更新购物车商品数量
    public CartItemDto updateCartItemQuantity(Long userId, Long shelterId, String productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId, shelterId);
        
        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
            .orElseThrow(() -> new ResourceNotFoundException("カートアイテムが見つかりません: " + productId));
        
        if (quantity <= 0) {
            // 如果数量为0或负数，删除商品
            cartItemRepository.delete(cartItem);
            return null;
        }
        
        cartItem.setQuantity(quantity);
        cartItem.setTotalPrice(cartItem.getPricePerUnit() * quantity);
        cartItem.setUpdatedAt(LocalDateTime.now());
        
        cartItem = cartItemRepository.save(cartItem);
        
        // 更新购物车时间戳
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        
        return convertToCartItemDto(cartItem);
    }
    
    // 从购物车删除商品
    public void removeItemFromCart(Long userId, Long shelterId, String productId) {
        Cart cart = getOrCreateCart(userId, shelterId);
        
        cartItemRepository.deleteByCartIdAndProductId(cart.getId(), productId);
        
        // 更新购物车时间戳
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }
    
    // 清空购物车
    public void clearCart(Long userId, Long shelterId) {
        Cart cart = getOrCreateCart(userId, shelterId);
        
        cartItemRepository.deleteByCartId(cart.getId());
        
        // 更新购物车时间戳
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }
    
    // 获取用户的所有购物车
    public List<CartDto> getUserCarts(Long userId) {
        List<Cart> carts = cartRepository.findByUserIdAndIsActiveTrue(userId);
        
        return carts.stream()
            .map(cart -> {
                List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
                List<CartItemDto> itemDtos = cartItems.stream()
                    .map(this::convertToCartItemDto)
                    .collect(Collectors.toList());
                
                CartDto cartDto = convertToCartDto(cart);
                cartDto.setItems(itemDtos);
                return cartDto;
            })
            .collect(Collectors.toList());
    }
    
    // 获取或创建购物车
    private Cart getOrCreateCart(Long userId, Long shelterId) {
        return cartRepository.findByUserIdAndShelterId(userId, shelterId)
            .orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setUserId(userId);
                newCart.setShelterId(shelterId);
                newCart.setIsActive(true);
                newCart.setCreatedAt(LocalDateTime.now());
                newCart.setUpdatedAt(LocalDateTime.now());
                return cartRepository.save(newCart);
            });
    }
    
    // 转换为CartDto
    private CartDto convertToCartDto(Cart cart) {
        return new CartDto(
            cart.getId(),
            cart.getUserId(),
            cart.getShelterId(),
            cart.getIsActive(),
            cart.getCreatedAt(),
            cart.getUpdatedAt()
        );
    }
    
    // 转换为CartItemDto
    private CartItemDto convertToCartItemDto(CartItem cartItem) {
        return new CartItemDto(
            cartItem.getId(),
            cartItem.getCartId(),
            cartItem.getProductId(),
            cartItem.getProductName(),
            cartItem.getUnit(),
            cartItem.getCategory(),
            cartItem.getQuantity(),
            cartItem.getPricePerUnit(),
            cartItem.getTotalPrice(),
            cartItem.getNotes(),
            cartItem.getCreatedAt(),
            cartItem.getUpdatedAt()
        );
    }
}
