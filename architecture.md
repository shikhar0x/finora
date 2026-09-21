# Expense & Personal Finance Manager
## System Architecture

---

# 1. Architecture Overview

The application uses a three-tier full-stack architecture:

```text
┌──────────────────────────────────────────────┐
│              PRESENTATION LAYER              │
│                                              │
│        React + TypeScript + Vite             │
│        Tailwind CSS + Recharts               │
└──────────────────────┬───────────────────────┘
                       │
                  REST / JSON
                       │
                       ▼
┌──────────────────────────────────────────────┐
│               APPLICATION LAYER              │
│                                              │
│             Java + Spring Boot               │
│                                              │
│ Controller → Service → Repository            │
└──────────────────────┬───────────────────────┘
                       │
                    JPA/Hibernate
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                   DATA LAYER                 │
│                                              │
│                    MySQL                     │
│                                              │
│ Users / Categories / Transactions / Budgets  │
└──────────────────────────────────────────────┘
```

---

# 2. Repository Structure

```text
expense-personal-finance-manager/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/expensemanager/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── entity/
│   │   │   │       ├── dto/
│   │   │   │       ├── exception/
│   │   │   │       └── config/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── er-diagram/
│   └── screenshots/
│
├── prd.md
├── architecture.md
├── rules.md
├── phases.md
├── memory.md
└── README.md
```

---

# 3. Frontend Architecture

The frontend follows a component-based architecture.

```text
Pages
 │
 ├── Login
 ├── Register
 ├── Dashboard
 ├── Expenses
 ├── Income
 ├── Transactions
 ├── Budget
 └── Reports
      │
      ▼
Reusable Components
      │
      ▼
Services / API Client
      │
      ▼
REST API
```

---

# 4. Frontend Responsibilities

React is responsible for:

- Rendering UI
- Navigation
- Forms
- Client-side validation
- UI state
- Charts
- User interactions
- API communication

React must NOT contain database logic.

React must NOT connect directly to MySQL.

---

# 5. Backend Architecture

The backend uses layered architecture.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

---

# 6. Controller Layer

Controllers expose REST endpoints.

Examples:

```text
AuthController
TransactionController
CategoryController
BudgetController
DashboardController
ReportController
```

Controllers should:

- Receive requests
- Validate basic request structure
- Call services
- Return responses

Controllers should NOT contain complex business logic.

---

# 7. Service Layer

Services contain business logic.

Examples:

```text
AuthService
TransactionService
CategoryService
BudgetService
DashboardService
ReportService
```

Services handle:

- Calculations
- Validation
- Business rules
- Coordination between repositories

---

# 8. Repository Layer

Repositories handle database access.

Examples:

```text
UserRepository
TransactionRepository
CategoryRepository
BudgetRepository
```

Spring Data JPA should be used.

---

# 9. Entity Layer

Entities:

```text
User
Category
Transaction
Budget
```

Relationships:

```text
User 1 ───── N Transaction

Category 1 ───── N Transaction

User 1 ───── N Budget

Category 1 ───── N Budget
```

---

# 10. DTO Layer

DTOs should be used where appropriate to avoid exposing database entities directly through APIs.

Examples:

```text
LoginRequest
RegisterRequest
TransactionRequest
TransactionResponse
BudgetRequest
BudgetResponse
DashboardResponse
```

---

# 11. Database Architecture

MySQL is the persistent storage layer.

```text
users
   │
   ├──────────── transactions
   │                    │
   │                    └──── categories
   │
   └──────────── budgets
                        │
                        └──── categories
```

---

# 12. Transaction Flow

Example: adding an expense.

```text
User
 ↓
React Expense Form
 ↓
Axios
 ↓
POST /api/transactions
 ↓
TransactionController
 ↓
TransactionService
 ↓
TransactionRepository
 ↓
MySQL
 ↓
Response
 ↓
React UI update
```

---

# 13. Dashboard Flow

```text
Dashboard
 ↓
GET /api/dashboard
 ↓
DashboardController
 ↓
DashboardService
 ↓
TransactionRepository
 ↓
Aggregate database queries
 ↓
DashboardResponse
 ↓
React
```

---

# 14. FA1 Architecture

During FA1:

```text
React
  ↓
Mock Data
```

Database is designed separately:

```text
MySQL Schema
     +
ER Diagram
```

No direct React → MySQL connection.

---

# 15. FA2 Architecture

During FA2:

```text
React
  ↓
REST API
  ↓
Spring Boot
  ↓
JPA/Hibernate
  ↓
MySQL
```

Mock data is gradually removed.

---

# 16. Security Architecture

Minimum requirements:

- Password hashing
- Input validation
- No plaintext passwords
- Backend validation
- Parameterized database access through JPA
- No database credentials in frontend code

JWT authentication may be introduced if required, but it is not necessary for the first FA2 milestone unless authentication scope requires it.

---

# 17. Architecture Principles

1. Separation of concerns.
2. Frontend never directly accesses the database.
3. Controllers remain thin.
4. Business logic belongs in services.
5. Database access belongs in repositories.
6. Entities represent persistence models.
7. DTOs represent API contracts.
8. Features should remain modular.
9. Avoid unnecessary abstractions.
10. Preserve the FA1 UI when implementing FA2.
