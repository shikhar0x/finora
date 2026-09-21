# AI DEVELOPMENT RULES
## Expense & Personal Finance Manager

This document contains mandatory rules for any AI agent, coding assistant, or developer working on this project.

---

# 1. PRIMARY OBJECTIVE

Build the Expense & Personal Finance Manager according to:

- prd.md
- architecture.md
- phases.md
- memory.md

These documents define the intended project direction.

Do not introduce unrelated features.

---

# 2. ACADEMIC REQUIREMENT HAS PRIORITY

The project is being developed in two academic phases.

## FA1

ONLY:

- Frontend/UI
- Database Design

## FA2

ONLY:

- Backend
- Database Integration

Do not prematurely implement FA2 functionality while FA1 is being finalized unless explicitly requested.

---

# 3. TECHNOLOGY LOCK

The approved stack is:

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Axios

Backend:

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

Database:

- MySQL

Do not replace these technologies without explicit approval.

---

# 4. NO UNAUTHORIZED ARCHITECTURAL CHANGES

Do NOT:

- Replace React with another frontend framework.
- Replace Java/Spring Boot with Node.js/Python.
- Replace MySQL with MongoDB.
- Convert the project into a desktop Swing application.
- Introduce microservices.
- Introduce Docker unnecessarily.
- Introduce Kubernetes.
- Introduce cloud infrastructure.
- Introduce unnecessary authentication infrastructure.

The project is a modular monolithic application.

---

# 5. NO OVERENGINEERING

Do not add technology merely because it is popular.

Prefer:

```text
Simple
Readable
Modular
Maintainable
Academic-friendly
```

over:

```text
Complex
Over-engineered
Distributed
Production-scale infrastructure
```

---

# 6. FA1 FRONTEND RULES

FA1 frontend must be visually complete.

Required pages:

- Login
- Register
- Dashboard
- Expenses
- Income
- Transactions
- Budget
- Reports

Use mock data where necessary.

The UI should not appear unfinished merely because backend integration has not happened yet.

---

# 7. FA1 DATABASE RULES

Database design must be finalized before backend implementation begins.

Required tables:

```text
users
categories
transactions
budgets
```

Every relationship must be explicitly documented.

---

# 8. FA2 BACKEND RULES

Backend must follow:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Do not place business logic inside controllers.

Do not access repositories directly from controllers when a service layer is appropriate.

---

# 9. FRONTEND/BACKEND CONTRACT

API contracts must be documented before implementation.

Example:

```text
POST /api/transactions
```

Request and response structures must remain consistent.

If an API contract changes, update:

- Frontend types
- Backend DTOs
- API documentation
- memory.md

---

# 10. DATABASE RULES

Never allow the frontend to connect directly to MySQL.

Correct:

```text
React → Spring Boot → MySQL
```

Incorrect:

```text
React → MySQL
```

---

# 11. CODE QUALITY

Code must:

- Have meaningful names.
- Avoid unnecessary duplication.
- Use appropriate types.
- Handle errors.
- Validate user input.
- Avoid hardcoded credentials.
- Avoid dead code.
- Avoid unnecessary comments.
- Follow the architecture.

---

# 12. SECURITY

Never:

- Store plaintext passwords in the final application.
- Commit database passwords.
- Commit API keys.
- Commit secrets.
- Put MySQL credentials in frontend code.

Use environment/configuration mechanisms.

---

# 13. DATABASE MIGRATION SAFETY

Do not arbitrarily change existing database columns.

Before changing:

- Table structure
- Relationships
- Column names
- Data types

verify the impact on:

- Backend entities
- Repositories
- Services
- DTOs
- Frontend

---

# 14. UI CONSISTENCY

All screens must share:

- Typography
- Spacing
- Navigation
- Buttons
- Form styles
- Color system
- Card styles

Do not design every page as a separate application.

---

# 15. RESPONSIVE DESIGN

Frontend should work on:

- Desktop
- Laptop
- Tablet-sized screens

Do not build layouts that break immediately when the viewport changes.

---

# 16. MOCK DATA RULE

Mock data is allowed in FA1.

Mock data must:

- Be realistic.
- Match the final database structure.
- Match expected API response structures.

This ensures FA2 integration does not require redesigning the UI.

---

# 17. BEFORE WRITING CODE

The AI must:

1. Inspect the repository.
2. Read relevant documentation.
3. Understand existing implementation.
4. Identify what phase the project is currently in.
5. Make the smallest necessary change.
6. Verify the change.

Do not blindly overwrite files.

---

# 18. ONE LOGICAL STEP AT A TIME

When implementing a feature:

```text
Plan
 ↓
Implement
 ↓
Run
 ↓
Test
 ↓
Verify
 ↓
Proceed
```

Do not implement ten unrelated features simultaneously.

---

# 19. PRESERVE WORKING CODE

If existing functionality works:

DO NOT rewrite it without a reason.

Prefer targeted changes.

---

# 20. NO FEATURE CREEP

Do not implement:

- AI financial advisor
- Bank synchronization
- UPI integration
- Stock portfolio management
- Cryptocurrency
- Payment gateway
- Real bank APIs

unless explicitly requested.

---

# 21. ERROR HANDLING

Errors must be:

- Handled
- Understandable
- Visible where appropriate

The application must not crash because of ordinary invalid input.

---

# 22. TESTING RULE

Every completed feature must be tested before moving to the next feature.

Minimum testing:

- Happy path
- Invalid input
- Empty input
- Database failure where applicable

---

# 23. DOCUMENTATION RULE

When architecture or behavior changes, update the appropriate documentation.

Relevant files:

```text
prd.md
architecture.md
rules.md
phases.md
memory.md
```

Do not allow documentation to become contradictory to the implementation.

---

# 24. GIT RULES

Use meaningful commits.

Examples:

```text
feat: add dashboard UI
feat: add transaction management
feat: implement transaction API
feat: integrate MySQL
fix: validate expense amount
```

Avoid:

```text
update
changes
final
new
stuff
```

---

# 25. COMPLETION RULE

A feature is not considered complete merely because the code compiles.

It must:

1. Build.
2. Run.
3. Work as intended.
4. Match the architecture.
5. Not break existing features.

---

# 26. AI DECISION RULE

When uncertain:

1. Check PRD.
2. Check architecture.
3. Check phases.
4. Check memory.
5. Inspect existing code.
6. Ask the developer if ambiguity remains.

Do not invent project requirements.

---

# 27. FINAL PRINCIPLE

Build exactly what is required.

Do not optimize for complexity.

Optimize for:

```text
Correctness
Clarity
Maintainability
Academic Requirements
Working Demonstration
```
