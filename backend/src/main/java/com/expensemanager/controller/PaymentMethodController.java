package com.expensemanager.controller;

import com.expensemanager.dto.PaymentMethodDtos;
import com.expensemanager.service.PaymentMethodService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping
    public List<PaymentMethodDtos.PaymentMethodResponse> getPaymentMethods(
            @RequestParam Long userId
    ) {
        return paymentMethodService.getAll(userId);
    }

    @PostMapping
    public PaymentMethodDtos.PaymentMethodResponse createPaymentMethod(
            @Valid @RequestBody PaymentMethodDtos.PaymentMethodRequest request
    ) {
        return paymentMethodService.create(request);
    }
}
