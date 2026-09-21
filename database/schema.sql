CREATE DATABASE IF NOT EXISTS finora;
USE finora;

-- ============================================
-- USERS
-- ============================================

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE categories (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,

    CONSTRAINT uq_category_name_type
        UNIQUE (name, type)
);

-- ============================================
-- TRANSACTIONS
-- ============================================

CREATE TABLE transactions (
    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    type ENUM('INCOME', 'EXPENSE') NOT NULL,

    amount DECIMAL(12,2) NOT NULL,
    transaction_date DATE NOT NULL,

    description VARCHAR(255),
    payment_method VARCHAR(50),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_transaction_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id),

    CONSTRAINT chk_transaction_amount
        CHECK (amount > 0)
);

-- ============================================
-- BUDGETS
-- ============================================

CREATE TABLE budgets (
    budget_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    month TINYINT NOT NULL,
    year SMALLINT NOT NULL,

    CONSTRAINT fk_budget_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_budget_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id),

    CONSTRAINT chk_budget_amount
        CHECK (amount > 0),

    CONSTRAINT chk_budget_month
        CHECK (month BETWEEN 1 AND 12),

    CONSTRAINT uq_budget_user_category_period
        UNIQUE (user_id, category_id, month, year)
);
