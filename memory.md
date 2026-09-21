# PROJECT MEMORY
## Expense & Personal Finance Manager

This file is the persistent memory for AI agents and developers working on this project.

---

# 1. Project Identity

Project Name:

Expense & Personal Finance Manager

Project Type:

Academic Full-Stack Application

Primary Programming Language:

Java

---

# 2. Academic Context

The project is divided into two formal assessments.

## FA1

Requirements:

1. Frontend/UI Development
2. Database Design

## FA2

Requirements:

1. Backend Implementation
2. Database Integration

The implementation must respect this separation.

---

# 3. Technology Stack

## Frontend

```text
React
TypeScript
Vite
Tailwind CSS
Recharts
Axios
```

## Backend

```text
Java
Spring Boot
Spring Web
Spring Data JPA
Hibernate
Maven
```

## Database

```text
MySQL
```

---

# 4. Architecture

The application follows:

```text
React + TypeScript
        ↓
REST API
        ↓
Spring Boot
        ↓
Service Layer
        ↓
Repository Layer
        ↓
JPA/Hibernate
        ↓
MySQL
```

Architecture type:

Modular monolith / layered full-stack application.

---

# 5. Repository Structure

```text
expense-personal-finance-manager/
│
├── frontend/
├── backend/
├── database/
├── docs/
│
├── prd.md
├── architecture.md
├── rules.md
├── phases.md
└── memory.md
```

---

# 6. Core Entities

The initial database consists of:

```text
User
Category
Transaction
Budget
```

---

# 7. Database Tables

## users

```text
user_id
name
email
password
created_at
```

## categories

```text
category_id
name
type
```

## transactions

```text
transaction_id
user_id
category_id
type
amount
transaction_date
description
payment_method
created_at
```

## budgets

```text
budget_id
user_id
category_id
amount
month
year
```

---

# 8. Main Relationships

```text
User 1:N Transaction

Category 1:N Transaction

User 1:N Budget

Category 1:N Budget
```

---

# 9. Main Frontend Pages

The frontend currently targets:

```text
Login
Register
Dashboard
Expenses
Income
Transactions
Budget
Reports
Settings/Profile
```

---

# 10. Dashboard Requirements

Dashboard should display:

```text
Total Income
Total Expenses
Current Balance
Recent Transactions
Spending Overview
Budget Overview
```

---

# 11. Transaction Requirements

Transactions support:

```text
Create
Read
Update
Delete
Search
Filter
```

Fields:

```text
Amount
Category
Type
Date
Description
Payment Method
```

---

# 12. Budget Requirements

Budget tracks:

```text
Category
Monthly Budget
Amount Spent
Remaining Amount
Usage Percentage
```

---

# 13. Report Requirements

Reports include:

```text
Category-wise expenses
Monthly expenses
Income vs expenses
```

---

# 14. FA1 State

FA1 focuses on:

```text
Frontend/UI
Database Design
```

Frontend may use mock data.

The database schema must be designed and documented.

FA1 does not require frontend-to-backend integration.

---

# 15. FA2 State

FA2 focuses on:

```text
Java Backend
Database Integration
```

The backend will be implemented using Spring Boot.

The frontend mock data will progressively be replaced with API data.

---

# 16. API Contract

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
```

Transactions:

```text
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/{id}
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}
```

Categories:

```text
GET  /api/categories
POST /api/categories
```

Budgets:

```text
GET    /api/budgets
POST   /api/budgets
PUT    /api/budgets/{id}
DELETE /api/budgets/{id}
```

Dashboard:

```text
GET /api/dashboard
```

Reports:

```text
GET /api/reports/monthly
GET /api/reports/category
```

---

# 17. Development Principles

The project follows:

```text
Simple
Modular
Maintainable
Academic-focused
Feature-complete
```

The project should not be unnecessarily complicated.

---

# 18. Explicitly Out of Scope

Unless explicitly requested later:

```text
Bank API integration
UPI integration
Payment gateway
Stock portfolio
Cryptocurrency
AI financial advisor
Automatic bank synchronization
Mobile application
Microservices
Kubernetes
Cloud infrastructure
```

---

# 19. Important AI Context

Any AI agent working on this project must:

1. Read this file.
2. Read prd.md.
3. Read architecture.md.
4. Read rules.md.
5. Read phases.md.
6. Inspect the current repository.
7. Determine the current development phase.
8. Preserve existing functionality.
9. Implement one logical step at a time.

---

# 20. Current Development Status

Initial planning stage.

FA1/FA2 architecture has been selected.

Approved stack:

```text
React + TypeScript + Vite
        +
Java Spring Boot
        +
MySQL
```

No implementation should be assumed complete unless it exists in the repository.

---

# 21. Source of Truth

When documentation and actual implementation differ:

1. Inspect the current code.
2. Identify the discrepancy.
3. Do not silently redesign the project.
4. Update documentation after confirming the intended behavior.

The actual working repository is the ultimate implementation source of truth.

---

# 22. Future Memory Updates

Whenever a major implementation decision is finalized, update this file.

Examples:

- Completed features
- API changes
- Database changes
- Architecture decisions
- Important bugs
- Resolved technical decisions
- FA1 completion
- FA2 completion

Do not store temporary debugging output here.

---

# 23. Final Project Goal

The final system should provide an end-to-end working flow:

```text
User
 ↓
React UI
 ↓
REST API
 ↓
Java Spring Boot
 ↓
Business Logic
 ↓
JPA/Hibernate
 ↓
MySQL
 ↓
Response
 ↓
React UI
```

The final application must demonstrate both academic requirements:

FA1:

```text
Frontend/UI + Database Design
```

FA2:

```text
Backend + Database Integration
```
