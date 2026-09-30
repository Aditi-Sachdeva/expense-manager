# Expense Manager

A web-based application built with **HTML, CSS, and JavaScript** to manage personal and group expenses.

---

## 📌 Project Proposal

### Project Description

Expense Manager helps users manage personal and group expenses. It supports splitting shared bills, tracking who paid, calculating balances, and simplifying settlements. The application also provides dashboards for financial summaries and an alerts system that notifies users when budgets are nearing or exceeding limits.

### Goals

- Provide a simple interface for tracking expenses across multiple categories and groups.
- Enable fair splitting of bills using equal, percentage, or exact amount splits.
- Maintain balances and generate simplified settlements to minimize transactions.
- Offer a dashboard view for overall financial health, including accounts, budgets, and goals.
- Implement alerts for overspending, pending settlements, and due dates.
- Send email notifications when budget thresholds are crossed (50%, 85%, 100%).

### Specifications

**Frontend only:** Pure HTML, CSS, and JavaScript.

#### Modules

| Module | Description |
| --- | --- |
| **Dashboard** | Aggregates totals, budgets, goals, and alerts. |
| **Transactions** | Log income and expenses with categories. |
| **Accounts** | Track balances across wallets, bank accounts, etc. |
| **Categories** | Organize expenses for budgeting and analysis. |
| **Budgets** | Define spending limits per category and monitor usage. |
| **Goals** | Track savings targets and progress. |
| **Groups** | Manage shared expenses among members, calculate balances, and simplify settlements. |
| **Alerts** | Generate warnings for budget exceeded, low balance, and pending settlements, and send email notifications. |

#### Expense Splitting

- Equal split
- Percentage split
- Exact amount split

#### Settlement History

Records repayments between group members.

#### Email Alerts

Implemented using **EmailJS** to automatically send email notifications when budget thresholds are crossed.

### Design

#### UI Layout

- **Sidebar navigation:**
  - Dashboard
  - Transactions
  - Accounts
  - Categories
  - Budgets
  - Goals
  - Groups
  - Alerts
- The main content area provides dynamic views for each module.

#### Groups Module

- Add members
- Add expenses with different split types
- Show member balances
- Generate simplified settlements
- Maintain settlement history

#### Dashboard Module

- Cards displaying financial totals
- Budget summaries
- Goal progress
- Alert count
- Recent transactions list

#### Alerts Module

- List of active alerts
- Automatic email notifications via EmailJS when budget thresholds of **50%**, **85%**, and **100%** are crossed

---

## 📋 Prerequisites

- A modern web browser such as Chrome, Edge, or Firefox
- Git installed for cloning the repository
- An [EmailJS](https://www.emailjs.com/) account for email notifications

---

## 🚀 How to Run the Application

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-manager.git
cd expense-manager
```

### 2. Open the Project

Open `index.html` in your browser. No server setup is required because the application is frontend-only.

### 3. Explore the Modules

Use the sidebar to navigate to:

- Dashboard
- Transactions
- Accounts
- Categories
- Budgets
- Goals
- Groups
- Alerts

Then try the following:

- Add members and expenses in the **Groups** module to test balances and settlements.
- Check the **Dashboard** for financial summaries.
- Check the **Alerts** module for active notifications.

### 4. Test Alerts

1. Define a budget, for example **₹5,000**.
2. Add expenses to cross each threshold:
   - 50%
   - 85%
   - 100%
3. An email notification is sent automatically via EmailJS when each configured threshold is crossed.

---

## 📂 Project Structure

```text
expense-manager/
│
├── components/
│   └── sidebar.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── accounts.js
│   ├── alerts.js
│   ├── budgets.js
│   ├── categories.js
│   ├── dashboard.js
│   ├── goals.js
│   ├── groups.js
│   ├── sidebar.js
│   ├── storage.js
│   └── transactions.js
│
├── accounts.html
├── alerts.html
├── budgets.html
├── categories.html
├── goals.html
├── groups.html
├── index.html
├── transactions.html
│
├── .gitignore
└── README.md
```

---

## ⚠️ Limitations

- Data is stored in the browser's local storage; there is no backend database.
- Email notifications require EmailJS configuration.
- The application is designed for demonstration purposes and is not intended for production use.

---

## 📜 License

This project is licensed under the **MIT License**.