# DEVELOPMENT PHASE PLAN
## Expense & Personal Finance Manager

---

# 1. Development Strategy

The project will be developed in two academic milestones:

```text
FA1
│
├── Frontend/UI
└── Database Design
        │
        ▼
FA2
│
├── Backend
└── Database Integration
        │
        ▼
Final Integrated Application
```

The frontend and database structure must be designed in FA1 so that FA2 can integrate them without major redesign.

---

# 2. Phase 0 — Project Setup

## Objective

Establish the repository and development standards.

### Tasks

- Create Git repository.
- Create frontend directory.
- Create backend directory.
- Create database directory.
- Add documentation files.
- Configure React + TypeScript + Vite.
- Configure Java Spring Boot + Maven.
- Create MySQL database.
- Establish development conventions.

### Output

```text
frontend/
backend/
database/
docs/
```

---

# 3. Phase 1 — Requirements & Database Design

## Objective

Finalize the application's data model.

### Tasks

- Identify entities.
- Identify attributes.
- Define relationships.
- Define primary keys.
- Define foreign keys.
- Create ER diagram.
- Create schema.sql.
- Create seed.sql.
- Insert default categories.

### Deliverables

```text
ER diagram
schema.sql
seed.sql
Database documentation
```

---

# 4. Phase 2 — Frontend Foundation

## Objective

Create the visual foundation.

### Tasks

- Configure routing.
- Create application layout.
- Create sidebar/navbar.
- Define design system.
- Create reusable buttons.
- Create reusable cards.
- Create reusable form components.
- Create reusable table components.
- Create responsive layout.

---

# 5. Phase 3 — Authentication UI

## Objective

Build authentication screens.

### Tasks

- Login page.
- Register page.
- Form validation.
- Error states.
- Loading states.
- Navigation flow.

FA1 uses mock authentication.

---

# 6. Phase 4 — Dashboard UI

## Objective

Create the main application dashboard.

### Tasks

- Income card.
- Expense card.
- Balance card.
- Spending chart.
- Recent transactions.
- Budget overview.
- Responsive layout.

Use mock data.

---

# 7. Phase 5 — Transaction UI

## Objective

Build financial transaction management screens.

### Tasks

- Expense form.
- Income form.
- Transaction table.
- Search.
- Filters.
- Edit UI.
- Delete UI.
- Validation.

Use mock data during FA1.

---

# 8. Phase 6 — Budget & Reports UI

## Objective

Complete the FA1 frontend.

### Budget

- Budget creation form.
- Budget list.
- Spending progress.
- Remaining budget.

### Reports

- Category chart.
- Monthly chart.
- Income vs expense chart.
- Summary cards.

---

# 9. Phase 7 — FA1 Verification

## Objective

Prepare the FA1 submission.

### Verify

- All pages work.
- Navigation works.
- Forms work visually.
- Mock data works.
- Database exists.
- Tables exist.
- Relationships are correct.
- ER diagram is complete.

### Screenshots

Capture:

```text
Login
Register
Dashboard
Add Expense
Add Income
Transactions
Budget
Reports
ER Diagram
MySQL tables
```

### FA1 PDF

Create one PDF containing the screenshots.

File naming:

```text
A12.pdf
```

Replace A12 with the actual group name.

---

# 10. Phase 8 — Spring Boot Foundation

## Objective

Start FA2 backend development.

### Tasks

- Create Spring Boot application.
- Configure Maven.
- Configure MySQL.
- Configure JPA.
- Configure Hibernate.
- Verify database connection.
- Create base package structure.

---

# 11. Phase 9 — Backend Entities & Repositories

Create:

```text
User
Category
Transaction
Budget
```

Repositories:

```text
UserRepository
CategoryRepository
TransactionRepository
BudgetRepository
```

Verify database operations.

---

# 12. Phase 10 — Backend Services

Implement:

```text
AuthService
TransactionService
CategoryService
BudgetService
DashboardService
ReportService
```

Business logic belongs here.

---

# 13. Phase 11 — REST APIs

Implement:

```text
POST /api/auth/register
POST /api/auth/login

GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/{id}
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}

GET  /api/categories
POST /api/categories

GET    /api/budgets
POST   /api/budgets
PUT    /api/budgets/{id}
DELETE /api/budgets/{id}

GET /api/dashboard

GET /api/reports/monthly
GET /api/reports/category
```

Test APIs before frontend integration.

---

# 14. Phase 12 — Database Integration

## Objective

Make the backend operate on the real MySQL database.

Verify:

```text
Create
Read
Update
Delete
```

for applicable entities.

Verify:

- Foreign keys.
- Constraints.
- Validation.
- Transactions.
- Aggregation queries.

---

# 15. Phase 13 — Frontend/API Integration

Replace FA1 mock data.

Before:

```text
React → Mock Data
```

After:

```text
React
 ↓
Axios
 ↓
Spring Boot
 ↓
JPA
 ↓
MySQL
```

Integrate feature-by-feature:

1. Authentication
2. Dashboard
3. Transactions
4. Categories
5. Budgets
6. Reports

---

# 16. Phase 14 — FA2 Verification

Verify:

- Backend starts.
- Database connection works.
- APIs work.
- Frontend communicates with backend.
- Data persists after restart.
- CRUD works.
- Dashboard calculations are correct.
- Reports use real data.
- Invalid input is handled.

---

# 17. Phase 15 — FA2 Submission

Capture screenshots of:

```text
Backend running
API request/response
MySQL database
Login
Dashboard with real data
Add expense
Transaction persisted in database
Budget
Reports
```

Create the FA2 PDF.

---

# 18. Team Allocation

The following allocation is a base structure and should be customized to the actual team size.

## Member 1 — Frontend Lead

### FA1

- Application layout
- Navigation
- Dashboard
- Shared UI components

### FA2

- Dashboard API integration
- Frontend state integration
- UI/API error handling

---

## Member 2 — Transaction Module

### FA1

- Expense UI
- Income UI
- Transaction table
- Filters

### FA2

- Transaction entity
- Transaction repository
- Transaction service
- Transaction APIs
- Frontend integration

---

## Member 3 — Budget & Reports

### FA1

- Budget UI
- Reports UI
- Charts

### FA2

- Budget backend
- Report queries
- Dashboard aggregation
- Chart API integration

---

## Member 4 — Database & Authentication

### FA1

- ER diagram
- Database schema
- MySQL setup
- Authentication UI

### FA2

- User entity
- Authentication backend
- MySQL integration
- Security
- Database verification

---

# 19. If More Team Members Exist

Additional members should be assigned to:

- UI component development
- Testing
- API testing
- Documentation
- Database testing
- Integration testing
- QA
- Submission preparation

No member should be given meaningless work merely to distribute tasks evenly.

---

# 20. Dependency Order

The project must follow:

```text
Requirements
     ↓
Database Design
     ↓
Frontend Design
     ↓
FA1 Submission
     ↓
Backend
     ↓
Database Integration
     ↓
API Integration
     ↓
Testing
     ↓
FA2 Submission
```

---

# 21. Critical Milestone

Before starting FA2, the following must be frozen:

- Database entities
- Major frontend screens
- Core field names
- Basic API contracts
- Project architecture

Changes after this point require explicit review.

---

# 22. Final Milestone

The final application should demonstrate:

```text
React + TypeScript
        ↓
Java Spring Boot
        ↓
MySQL
```

with all core financial management features functioning end-to-end.
