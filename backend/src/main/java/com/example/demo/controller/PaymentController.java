package com.example.demo.controller;

import com.example.demo.dto.PaymentDto;
import com.example.demo.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
@Tag(name = "支払い管理", description = "支払い関連のAPI")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // 创建支付记录
    @PostMapping
    @Operation(summary = "支払い記録作成", description = "新しい支払い記録を作成します")
    public ResponseEntity<PaymentDto> createPayment(@RequestBody PaymentDto paymentDto) {
        try {
            PaymentDto createdPayment = paymentService.createPayment(paymentDto);
            return ResponseEntity.ok(createdPayment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 处理支付
    @PostMapping("/{paymentId}/process")
    @Operation(summary = "支払い処理", description = "指定された支払いを処理します")
    public ResponseEntity<PaymentDto> processPayment(@PathVariable Long paymentId) {
        try {
            PaymentDto processedPayment = paymentService.processPayment(paymentId);
            return ResponseEntity.ok(processedPayment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 更新支付状态
    @PutMapping("/{paymentId}/status")
    @Operation(summary = "支払い状態更新", description = "指定された支払いの状態を更新します")
    public ResponseEntity<PaymentDto> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam String status) {
        try {
            PaymentDto updatedPayment = paymentService.updatePaymentStatus(paymentId, status);
            return ResponseEntity.ok(updatedPayment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取支付记录
    @GetMapping("/{paymentId}")
    @Operation(summary = "支払い記録取得", description = "指定された支払い記録を取得します")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable Long paymentId) {
        try {
            PaymentDto payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 根据订单ID获取支付记录
    @GetMapping("/order/{orderId}")
    @Operation(summary = "注文別支払い記録取得", description = "指定された注文の支払い記録を取得します")
    public ResponseEntity<List<PaymentDto>> getPaymentsByOrderId(@PathVariable Long orderId) {
        try {
            List<PaymentDto> payments = paymentService.getPaymentsByOrderId(orderId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 根据用户ID获取支付记录
    @GetMapping("/user/{userId}")
    @Operation(summary = "ユーザー別支払い記録取得", description = "指定されたユーザーの支払い記録を取得します")
    public ResponseEntity<List<PaymentDto>> getPaymentsByUserId(@PathVariable Long userId) {
        try {
            List<PaymentDto> payments = paymentService.getPaymentsByUserId(userId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 根据支付状态获取支付记录
    @GetMapping("/status/{status}")
    @Operation(summary = "状態別支払い記録取得", description = "指定された状態の支払い記録を取得します")
    public ResponseEntity<List<PaymentDto>> getPaymentsByStatus(@PathVariable String status) {
        try {
            List<PaymentDto> payments = paymentService.getPaymentsByStatus(status);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取所有支付记录
    @GetMapping
    @Operation(summary = "全支払い記録取得", description = "全ての支払い記録を取得します")
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        try {
            List<PaymentDto> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 获取订单的总支付金额
    @GetMapping("/order/{orderId}/total")
    @Operation(summary = "注文総支払い金額取得", description = "指定された注文の総支払い金額を取得します")
    public ResponseEntity<Double> getTotalPaidAmount(@PathVariable Long orderId) {
        try {
            Double totalPaid = paymentService.getTotalPaidAmount(orderId);
            return ResponseEntity.ok(totalPaid);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 检查订单是否已完全支付
    @GetMapping("/order/{orderId}/fully-paid")
    @Operation(summary = "注文完全支払い確認", description = "指定された注文が完全に支払われているかを確認します")
    public ResponseEntity<Boolean> isOrderFullyPaid(@PathVariable Long orderId) {
        try {
            boolean isFullyPaid = paymentService.isOrderFullyPaid(orderId);
            return ResponseEntity.ok(isFullyPaid);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
