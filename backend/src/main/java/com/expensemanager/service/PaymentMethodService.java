package com.expensemanager.service;

import com.expensemanager.dto.PaymentMethodDtos;
import com.expensemanager.entity.PaymentMethod;
import com.expensemanager.entity.User;
import com.expensemanager.repository.PaymentMethodRepository;
import com.expensemanager.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    public PaymentMethodService(
            PaymentMethodRepository paymentMethodRepository,
            UserRepository userRepository
    ) {
        this.paymentMethodRepository = paymentMethodRepository;
        this.userRepository = userRepository;
    }

    public List<PaymentMethodDtos.PaymentMethodResponse> getAll(Long userId) {
        return paymentMethodRepository
                .findByUserIdOrderByMethodNameAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PaymentMethodDtos.PaymentMethodResponse create(
            PaymentMethodDtos.PaymentMethodRequest request
    ) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        PaymentMethod method = new PaymentMethod();
        method.setUser(user);
        method.setMethodName(request.methodName());
        method.setDetails(request.details());

        return toResponse(paymentMethodRepository.save(method));
    }

    private PaymentMethodDtos.PaymentMethodResponse toResponse(
            PaymentMethod method
    ) {
        return new PaymentMethodDtos.PaymentMethodResponse(
                method.getId(),
                method.getUser().getId(),
                method.getMethodName(),
                method.getDetails(),
                method.getCreatedAt()
        );
    }
}
