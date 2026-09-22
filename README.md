# Finora — Expense & Personal Finance Manager

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF.svg)](https://vitejs.dev/)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)

**Finora** is a full-stack personal finance and expense management platform designed for individuals to track expenses, monitor income streams, set categorized monthly budgets, and analyze spending patterns through rich visual reports.

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Academic Context](#academic-context)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Frontend Setup & Quick Start](#frontend-setup--quick-start)
- [Database Setup](#database-setup)
- [Design System & UI Philosophy](#design-system--ui-philosophy)
- [Roadmap (FA2 Backend Integration)](#roadmap-fa2-backend-integration)

---

## 💡 Project Overview

Finora provides an intuitive, high-performance financial management hub featuring:
- **Real-Time Financial Dashboard**: Instant visibility into total balance, monthly income, monthly expenses, net savings rate, budget caps, and dynamic interactive trend charts.
- **Full Transaction Lifecycle**: Real-time transaction recording, multi-criteria filtering, live search, and deletion confirmation dialogs.
- **Categorized Monthly Budgets**: Visual budget progress bars, health badges (*Within Budget*, *Warning*, *Overbudget*), and dynamic budget creation/editing.
- **Deep Analytics & Reports**: Timeframe filters (This Month, Last 3 Months, Last 6 Months, This Year), income vs. expense comparison bars, category expense donut breakdown, and savings trajectory area charts.
- **Personalized Settings**: User profile configuration, localization settings (Currency: `₹`, `$`, `€`, `£`, date formats, default types), and seamless dark/light theme switching.

---

## 🎓 Academic Context

This project is architected across two formal assessment phases:

| Phase | Scope | Status | Deliverables |
| :--- | :--- | :---: | :--- |
| **FA1** | **Frontend UI & Database Design** | **✅ Complete** | 5 core React + TypeScript screens, responsive floating framed design system, central state management, custom form controls, and comprehensive MySQL relational database schema. |
| **FA2** | **Java Backend & DB Integration** | 🔄 *Upcoming* | Spring Boot RESTful APIs, Spring Data JPA/Hibernate persistence, MySQL integration, JWT security, and API synchronization. |

---

## ✨ Key Features

### 1. Dashboard
- **Dynamic KPI Metric Cards**: Total Balance, Monthly Income, Monthly Expense, and Net Savings Rate with trend comparison metrics.
- **Income vs. Expense Trend**: Interactive 6-month visual area/line chart.
- **Category Spending Donut**: Interactive breakdown of spending with dynamic center totals.
- **Recent Activity & Quick Action**: Instant access to recent ledger items and "+ Add Transaction" popup.
- **Live Budget Progress**: Visual meters alerting when spending approaches 80% or 100% of limits.

### 2. Transactions
- **Unified Ledger**: Complete searchable list of income and expense records.
- **Dynamic Filtering**: Filter by type (*Income*, *Expense*), Category, and Payment Method (*Cash*, *UPI*, *Credit Card*, *Debit Card*, *Net Banking*).
- **Search & Pagination**: Instant text filtering across descriptions and notes with clean page navigation.
- **Modal Form**: Custom popup featuring floating date picker, custom select menus, and field validation.

### 3. Budgets
- **Monthly Summary Cards**: Total budget allocated, total spent, and remaining allowance.
- **Category Progress Cards**: Detailed cards showing spend vs. limit, percentage used, remaining allowance, and color-coded status badges.
- **Budget Management**: "+ Create Budget" and "Edit Budget" modals with auto-fill and category validation.

### 4. Reports & Analytics
- **Timeframe Selector**: Dynamically filter report metrics by *This Month*, *Last 3 Months*, *Last 6 Months*, or *This Year*.
- **Grouped Bar Charts**: Monthly side-by-side comparison of Income vs. Expenses.
- **Category Donut Chart**: Category distribution breakdown with visual legends and percentage chips.
- **Savings Area Chart**: Net savings trajectory with smooth gradient fill.

### 5. Settings & Customization
- **Profile Management**: Name, email, and password update forms.
- **Localization Controls**: Select preferred currency symbol (`₹`, `$`, `€`, `£`), date formatting, and default transaction type.
- **Theme Selection**: Instant toggling between **Light Mode** and **Dark Mode**.
- **Data Reset**: Reset to baseline demo data for testing.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Charts & Data Visualization**: [Recharts 2](https://recharts.org/)
- **Styling**: Custom Design System with CSS Variables, Flexbox, CSS Grid, and Spring Micro-Animations
- **Icons**: 100% Custom SVG Vector Library (`Icon.tsx`)

### Database
- **Engine**: [MySQL 8.0](https://www.mysql.com/)
- **Design**: Relational Schema with Foreign Keys, `ON DELETE CASCADE`, Constraints (`CHECK`), and Performance Indexes.

### Backend *(FA2 Target)*
- **Language**: Java 17+
- **Framework**: Spring Boot 3 (Spring Web, Spring Data JPA, Hibernate, Maven)

---

## 📁 Repository Structure

```text
finora/
├── database/
│   └── schema.sql              # MySQL DDL schema, relationships, and seed data
├── frontend/
│   ├── index.html              # HTML5 entry point with Google Fonts (Plus Jakarta Sans)
│   ├── package.json            # NPM dependencies and build scripts
│   ├── tsconfig.json           # TypeScript configuration
│   ├── vite.config.ts          # Vite configuration
│   └── src/
│       ├── main.tsx            # React application entry point
│       ├── App.tsx             # Root routing and page switcher
│       ├── styles.css          # Core CSS variables, animations, and component styles
│       ├── types/              # TypeScript interfaces (Transaction, Budget, Category, Settings)
│       ├── data/               # Mock dataset for initial FA1 state
│       ├── context/            # FinanceContext (Centralized state & KPI calculations)
│       ├── utils/              # Formatters (currency, dates, percentages)
│       ├── components/
│       │   ├── layout/         # Header, Sidebar, Live Status Beacon, Layout frames
│       │   ├── dashboard/      # StatCards, OverviewChart, ExpenseBreakdown, BudgetProgress
│       │   ├── transactions/   # TransactionForm modal
│       │   ├── budgets/        # BudgetCard, BudgetForm modal
│       │   ├── reports/        # IncomeExpenseBarChart, CategoryPieChart, SavingsAreaChart
│       │   └── ui/             # Icon (SVG library), Modal, SelectField, DateField
│       ├── layouts/            # AppLayout (Floating framed desktop canvas)
│       └── pages/              # Dashboard, Transactions, Budgets, Reports, Settings, NotFound
├── prd.md                      # Product Requirements Document
├── architecture.md             # System Architecture & API contract
├── rules.md                    # Project Rules & Implementation Constraints
├── phases.md                   # Phased Implementation Plan (FA1 & FA2)
├── memory.md                   # Project Persistent Memory
└── README.md                   # Project Documentation
```

---

## 🚀 Frontend Setup & Quick Start

### Prerequisites
Make sure you have installed:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/shikhar0x/finora.git
cd finora/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
The application will launch locally at:
```text
http://localhost:5174/ (or http://localhost:5173/)
```

### 4. Build for Production
To validate TypeScript types and compile an optimized production bundle:
```bash
npm run build
```
The output will be placed in the `frontend/dist/` folder.

### 5. Preview the Production Build
```bash
npm run preview
```

---

## 🗄 Database Setup

The database definition is located in [`database/schema.sql`](./database/schema.sql).

### Schema Summary
- **`users`**: User identity, authentication credentials, and timestamps.
- **`categories`**: Financial categories (Income / Expense) with associated colors and icons.
- **`transactions`**: Financial records referencing user and category, transaction type, amount, date, description, and payment method.
- **`budgets`**: Monthly spending limits per category and year/month combination.

### Initializing MySQL Database
1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal CLI).
2. Execute the schema script:
```bash
mysql -u root -p < database/schema.sql
```
This creates the `finora` database, all tables with foreign key relationships, indexes, and initial seed categories and demo data.

---

## 🎨 Design System & UI Philosophy

Finora adheres to a desktop workspace design system:
1. **Floating Framed Canvas**: Padded outer boundary (`12px`) with rounded floating panels (`16px` radius) providing clean visual separation.
2. **Spring Micro-Interactions**: Smooth hover elevations, button compressions, and modal entry transitions using spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
3. **Adaptive Color Theming**: Complete CSS custom properties supporting seamless switching between Light Mode and deep Navy Dark Mode.
4. **Floating Popups & Form Controls**: Custom themed select menus and floating date pickers that do not cause internal scroll clipping.
5. **Clean SVG Iconography**: Zero emoji or unicode glyphs — all UI elements use scalable, pixel-aligned SVG vector paths (`Icon.tsx`).

---

## 🔮 Roadmap (FA2 Backend Integration)

- [ ] **Spring Boot REST API**: Build controllers, service layers, and repository interfaces.
- [ ] **Authentication & Security**: Implement Spring Security with JWT tokens and password hashing.
- [ ] **JPA / Hibernate Persistence**: Entity mappings corresponding to `database/schema.sql`.
- [ ] **Frontend-Backend Synchronization**: Replace `FinanceContext` mock state with Axios HTTP service layer calling `/api/*` endpoints.
- [ ] **Validation & Exception Handling**: Global error controller and validation advice.

---

## 📄 License
This project is created for academic assessment purposes.
