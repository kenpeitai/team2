package com.example.demo.controller;

import com.example.demo.dto.CartDto;
import com.example.demo.dto.CartItemDto;
import com.example.demo.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
@Tag(name = "ショッピングカート", description = "ショッピングカート関連のAPI")
public class CartController {

    @Autowired
    private CartService cartService;

    // 获取用户的购物车
    @GetMapping("/{userId}/{shelterId}")
    @Operation(summary = "ユーザーのカート取得", description = "指定されたユーザーと避難所のカートを取得します")
    public ResponseEntity<CartDto> getUserCart(@PathVariable Long userId, @PathVariable Long shelterId) {
        try {
            CartDto cart = cartService.getUserCart(userId, shelterId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取用户的所有购物车
    @GetMapping("/{userId}")
    @Operation(summary = "ユーザーの全カート取得", description = "指定されたユーザーの全カートを取得します")
    public ResponseEntity<List<CartDto>> getUserCarts(@PathVariable Long userId) {
        try {
            List<CartDto> carts = cartService.getUserCarts(userId);
            return ResponseEntity.ok(carts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 添加商品到购物车
    @PostMapping("/{userId}/{shelterId}/items")
    @Operation(summary = "カートに商品追加", description = "指定されたカートに商品を追加します")
    public ResponseEntity<CartItemDto> addItemToCart(
            @PathVariable Long userId,
            @PathVariable Long shelterId,
            @RequestBody CartItemDto itemDto) {
        try {
            System.out.println("Received cart item request - userId: " + userId + ", shelterId: " + shelterId);
            System.out.println("Cart item data: " + itemDto);
            CartItemDto addedItem = cartService.addItemToCart(userId, shelterId, itemDto);
            return ResponseEntity.ok(addedItem);
        } catch (Exception e) {
            System.err.println("Error adding item to cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 更新购物车商品数量
    @PutMapping("/{userId}/{shelterId}/items/{productId}")
    @Operation(summary = "カート商品数量更新", description = "指定されたカートの商品数量を更新します")
    public ResponseEntity<CartItemDto> updateCartItemQuantity(
            @PathVariable Long userId,
            @PathVariable Long shelterId,
            @PathVariable String productId,
            @RequestParam Integer quantity) {
        try {
            CartItemDto updatedItem = cartService.updateCartItemQuantity(userId, shelterId, productId, quantity);
            if (updatedItem == null) {
                return ResponseEntity.ok().build(); // 商品被删除
            }
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 从购物车删除商品
    @DeleteMapping("/{userId}/{shelterId}/items/{productId}")
    @Operation(summary = "カートから商品削除", description = "指定されたカートから商品を削除します")
    public ResponseEntity<Void> removeItemFromCart(
            @PathVariable Long userId,
            @PathVariable Long shelterId,
            @PathVariable String productId) {
        try {
            cartService.removeItemFromCart(userId, shelterId, productId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 清空购物车
    @DeleteMapping("/{userId}/{shelterId}")
    @Operation(summary = "カートを空にする", description = "指定されたカートを空にします")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId, @PathVariable Long shelterId) {
        try {
            cartService.clearCart(userId, shelterId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
