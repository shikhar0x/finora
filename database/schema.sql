-- ============================================================
-- Finora Database Schema
-- MySQL 8.0+
-- Expense & Personal Finance Manager
-- Parity with Authoritative ER Diagram (8 Tables)
-- ============================================================

CREATE DATABASE IF NOT EXISTS finora
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE finora;

-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. ACCOUNTS
-- ============================================================

CREATE TABLE IF NOT EXISTS accounts (
    account_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_type ENUM('SAVINGS', 'CHECKING', 'CREDIT_CARD', 'CASH', 'INVESTMENT', 'WALLET', 'OTHER') NOT NULL DEFAULT 'SAVINGS',
    current_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_accounts_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- 3. CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,

    CONSTRAINT uq_category_name_type
        UNIQUE (name, type)
);

-- ============================================================
-- 4. PAYMENT METHODS
-- ============================================================

CREATE TABLE IF NOT EXISTS payment_methods (
    payment_method_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    method_name VARCHAR(100) NOT NULL,
    details VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_methods_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- 5. BUDGETS
-- ============================================================

CREATE TABLE IF NOT EXISTS budgets (
    budget_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    month TINYINT NOT NULL,
    year SMALLINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_budget_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_budget_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_budget_amount
        CHECK (amount > 0),

    CONSTRAINT chk_budget_month
        CHECK (month BETWEEN 1 AND 12),

    CONSTRAINT chk_budget_year
        CHECK (year >= 2000),

    CONSTRAINT uq_budget_user_category_period
        UNIQUE (user_id, category_id, month, year)
);

-- ============================================================
-- 6. TRANSACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    payment_method_id BIGINT,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transaction_date DATE NOT NULL,
    description VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_transaction_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_transaction_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transaction_payment_method
        FOREIGN KEY (payment_method_id)
        REFERENCES payment_methods(payment_method_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_transaction_amount
        CHECK (amount > 0)
);

-- ============================================================
-- 7. GOALS
-- ============================================================

CREATE TABLE IF NOT EXISTS goals (
    goal_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    goal_name VARCHAR(150) NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    target_date DATE,
    status ENUM('IN_PROGRESS', 'ACHIEVED', 'CANCELLED') NOT NULL DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_goal_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_goal_target_amount
        CHECK (target_amount > 0),

    CONSTRAINT chk_goal_current_amount
        CHECK (current_amount >= 0)
);

-- ============================================================
-- 8. RECURRING TRANSACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS recurring_transactions (
    recurring_transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    payment_method_id BIGINT,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    frequency ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description VARCHAR(255),
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_recurring_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_recurring_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_recurring_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_recurring_payment_method
        FOREIGN KEY (payment_method_id)
        REFERENCES payment_methods(payment_method_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_recurring_amount
        CHECK (amount > 0)
);

-- ============================================================
-- INDEXES
-- Supports fast lookup and join operations across relational queries
-- ============================================================

CREATE INDEX idx_accounts_user
    ON accounts (user_id);

CREATE INDEX idx_payment_methods_user
    ON payment_methods (user_id);

CREATE INDEX idx_transactions_user_date
    ON transactions (user_id, transaction_date);

CREATE INDEX idx_transactions_account
    ON transactions (account_id);

CREATE INDEX idx_transactions_category
    ON transactions (category_id);

CREATE INDEX idx_transactions_type
    ON transactions (type);

CREATE INDEX idx_budgets_user_period
    ON budgets (user_id, year, month);

CREATE INDEX idx_goals_user_status
    ON goals (user_id, status);

CREATE INDEX idx_recurring_user_active
    ON recurring_transactions (user_id, is_active);

-- ============================================================
-- DEFAULT SEED DATA
-- Default Categories, Demo Accounts, and Payment Methods
-- ============================================================

INSERT INTO categories (name, type) VALUES
    ('Food', 'EXPENSE'),
    ('Transport', 'EXPENSE'),
    ('Shopping', 'EXPENSE'),
    ('Bills', 'EXPENSE'),
    ('Entertainment', 'EXPENSE'),
    ('Healthcare', 'EXPENSE'),
    ('Education', 'EXPENSE'),
    ('Other', 'EXPENSE'),
    ('Salary', 'INCOME'),
    ('Freelance', 'INCOME'),
    ('Investments', 'INCOME'),
    ('Other', 'INCOME')
ON DUPLICATE KEY UPDATE
    name = VALUES(name);

-- ============================================================
-- VERIFICATION
-- ============================================================

SHOW TABLES;
