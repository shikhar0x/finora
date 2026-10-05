package com.expensemanager.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {

    public enum Type {
        SAVINGS,
        CHECKING,
        CREDIT_CARD,
        CASH,
        INVESTMENT,
        WALLET,
        OTHER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "account_name", nullable = false)
    private String accountName;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private Type accountType;

    @Column(name = "current_balance", nullable = false, precision = 12, scale = 2)
    private BigDecimal currentBalance = BigDecimal.ZERO;

    @Column(nullable = false, length = 3)
    private String currency = "INR";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Account() {
    }

    public Account(
            User user,
            String accountName,
            Type accountType,
            BigDecimal currentBalance,
            String currency
    ) {
        this.user = user;
        this.accountName = accountName;
        this.accountType = accountType;
        this.currentBalance = currentBalance;
        this.currency = currency;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getAccountName() {
        return accountName;
    }

    public Type getAccountType() {
        return accountType;
    }

    public BigDecimal getCurrentBalance() {
        return currentBalance;
    }

    public String getCurrency() {
        return currency;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public void setAccountType(Type accountType) {
        this.accountType = accountType;
    }

    public void setCurrentBalance(BigDecimal currentBalance) {
        this.currentBalance = currentBalance;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
