package com.expensemanager.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_methods")
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_method_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "method_name", nullable = false, length = 100)
    private String methodName;

    @Column(length = 255)
    private String details;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public PaymentMethod() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getMethodName() {
        return methodName;
    }

    public String getDetails() {
        return details;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
