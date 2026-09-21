# Expense & Personal Finance Manager
## Product Requirements Document (PRD)

**Project Type:** Academic Software Project  
**Domain:** Personal Finance Management  
**Primary Language:** Java  
**Frontend:** React + TypeScript  
**Backend:** Java + Spring Boot  
**Database:** MySQL  
**Build Strategy:** FA1 → FA2  

---

# 1. Project Overview

The Expense & Personal Finance Manager is a full-stack personal finance management application that allows users to record, organize, monitor, and analyze personal income and expenses.

The application will provide:

- User authentication
- Expense management
- Income management
- Transaction history
- Category management
- Monthly budgets
- Financial dashboard
- Expense reports
- Basic financial analytics

The project is being developed in two academic stages.

---

# 2. Academic Requirements

## FA1

The FA1 requirement is:

1. Frontend/UI Development
2. Database Design

FA1 must demonstrate:

- A functional and polished frontend
- Navigation between application screens
- Forms for entering financial information
- Dashboard UI
- Transaction UI
- Budget UI
- Reports UI
- Database schema
- Entity relationships
- ER diagram
- MySQL tables

FA1 frontend may use mock/static data.

The frontend does NOT need to be connected to the Java backend during FA1.

## FA2

The FA2 requirement is:

1. Backend Implementation
2. Database Integration

FA2 must demonstrate:

- Java backend
- REST APIs
- Business logic
- MySQL connectivity
- CRUD operations
- Frontend-backend integration
- Real database data
- Working application flows

FA2 will replace the FA1 mock data with real API/database data.

---

# 3. Primary Goals

The system must allow a user to:

1. Register an account.
2. Login.
3. View their financial dashboard.
4. Add income.
5. Add expenses.
6. View transactions.
7. Filter transactions.
8. Delete/update transactions.
9. Categorize transactions.
10. Create monthly budgets.
11. Track budget usage.
12. View financial reports.
13. Logout.

---

# 4. Target Users

The primary target user is an individual who wants to track personal income and expenses.

The system is intended for:

- Students
- Working professionals
- Individual users
- People tracking monthly spending

---

# 5. Core Features

## 5.1 Authentication

### Registration

User should be able to register with:

- Name
- Email
- Password

### Login

User should be able to login using:

- Email
- Password

### Logout

User should be able to securely logout from the application.

---

# 6. Dashboard

The dashboard should display:

- Total income
- Total expenses
- Current balance
- Recent transactions
- Monthly spending
- Budget status

Example:

```text
Total Income       ₹50,000
Total Expenses     ₹18,500
Current Balance    ₹31,500
```

---

# 7. Expense Management

Users should be able to:

- Add an expense
- Edit an expense
- Delete an expense
- View expenses
- Categorize expenses

Expense fields:

- Amount
- Category
- Date
- Description
- Payment method

Example categories:

- Food
- Travel
- Shopping
- Education
- Entertainment
- Bills
- Healthcare
- Other

---

# 8. Income Management

Users should be able to record income.

Income fields:

- Amount
- Category/source
- Date
- Description
- Payment method

Example income sources:

- Salary
- Freelance
- Allowance
- Business
- Other

---

# 9. Transaction Management

The transaction page should display:

- Date
- Description
- Category
- Type
- Amount
- Payment method

Supported operations:

- Create
- Read
- Update
- Delete
- Search
- Filter

---

# 10. Budget Management

Users should be able to create monthly budgets.

Budget fields:

- Category
- Amount
- Month
- Year

The application should calculate:

```text
Budget
Spent
Remaining
Usage percentage
```

Example:

```text
Food

Budget:       ₹5,000
Spent:        ₹3,500
Remaining:    ₹1,500
Usage:        70%
```

---

# 11. Reports

The application should provide basic reports.

Required reports:

1. Category-wise expenses
2. Monthly expenses
3. Income vs expense

Charts may be implemented using Recharts.

---

# 12. Frontend Requirements

Frontend technology:

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Axios

Frontend screens:

```text
Login
Register
Dashboard
Add Expense
Add Income
Transactions
Budget
Reports
Profile/Settings
```

The frontend should be responsive and visually consistent.

---

# 13. Backend Requirements

Backend technology:

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

Backend responsibilities:

- Authentication
- Validation
- Business logic
- CRUD operations
- Financial calculations
- Report generation
- Database communication
- REST API implementation

---

# 14. Database Requirements

Database:

MySQL

Required tables:

```text
users
categories
transactions
budgets
```

Relationships must use primary and foreign keys.

---

# 15. Database Entities

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

# 16. API Requirements

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

# 17. Non-Functional Requirements

## Usability

The UI should be simple and intuitive.

## Performance

Normal UI interactions should respond quickly.

## Security

Passwords must not be stored in plaintext in the final implementation.

## Maintainability

Code must be modular and separated by responsibility.

## Reliability

Invalid input must not crash the application.

---

# 18. Out of Scope

The following are NOT required for the academic project:

- Bank account integration
- Real payment processing
- UPI integration
- Stock/investment tracking
- Cryptocurrency tracking
- AI financial advice
- Automatic bank transaction synchronization
- Multi-currency accounting
- Mobile application
- Production deployment

These may only be added after the core requirements are complete.

---

# 19. Definition of Done

FA1 is complete when:

- All required frontend screens exist.
- Navigation works.
- Forms work visually.
- Mock data is displayed.
- Database schema is finalized.
- ER diagram is available.
- MySQL tables are created.
- Required screenshots can be captured.

FA2 is complete when:

- Spring Boot backend runs.
- APIs work.
- MySQL integration works.
- CRUD operations work.
- Frontend communicates with backend.
- Mock data is replaced with real data.
- Authentication works.
- Dashboard uses database values.
- Transactions persist in MySQL.
- Budgets persist in MySQL.
- Reports use database data.
