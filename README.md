# Expense Manager

A web-based application built with **HTML, CSS, and JavaScript** to manage personal and group expenses.

---

## Project Proposal

### Project Description

Expense Manager helps users manage personal and group expenses. It supports splitting shared bills, tracking who paid, calculating balances, and simplifying settlements. The application also provides a dashboard with financial summaries and an alerts system that warns users when budgets are nearing or exceeding their limits, with optional email notifications.

### Goals

- Provide a simple interface for tracking income and expenses across accounts and categories.
- Let users set monthly budgets per category and monitor how much has been spent.
- Let users set savings goals and track their progress and due dates.
- Enable fair splitting of group bills using equal, percentage, or exact amount splits.
- Maintain member balances and generate simplified settlements to minimize the number of payments.
- Offer a dashboard for overall financial health, including accounts, budgets, goals, and alerts.
- Show alerts when a budget crosses 50%, 80%, or 100% of its limit, and when a goal is overdue.
- Optionally send an email notification when a budget threshold is crossed.

### Specifications

**Frontend only:** pure HTML, CSS, and JavaScript. Data is stored in the browser using Web Storage (`localStorage`). Every module supports **create, read, update, and delete (CRUD)**.

#### Modules

| Module | Description |
| --- | --- |
| **Dashboard** | Shows total balance, this month's income, expenses and net savings, smart alerts, recent transactions, accounts, current month budgets, and goals. |
| **Transactions** | Log income and expenses with category, account, date, description, and payment method. Search, filter, and sort the list. Account balances update automatically. |
| **Accounts** | Track balances across bank accounts, cash, cards, and wallets. |
| **Categories** | Separate expense and income categories used by transactions and budgets. |
| **Budgets** | Set a monthly limit per expense category. Shows spent, remaining, utilization, days left, and a status of On Track, Near Limit, or Exceeded. |
| **Goals** | Track savings targets with a saved amount and a target date. Status is In Progress, Completed, or Overdue. |
| **Groups** | Manage shared expenses among members, calculate balances, and simplify settlements. |
| **Alerts** | Lists active budget alerts for the current month, keeps an alert history, and manages email notification settings. |

#### Expense Splitting

- Equal split
- Percentage split
- Exact amount split

#### Settlement History

Records repayments between group members and updates the balances.

#### Budget Status and Alert Levels

| Used | Budget status | Alert level |
| --- | --- | --- |
| Below 50% | On Track | No alert |
| 50% to 79% | On Track | Halfway Used |
| 80% to 99% | Near Limit | Near Limit |
| 100% or more | Exceeded | Exceeded |

#### Email Alerts

Implemented using **EmailJS**. When email notifications are enabled, one email is sent per budget per level per month. Emails are sent when the Alerts page checks the budgets.

#### Data Storage

All data is stored in the browser's `localStorage`:

| Key | Contents |
| --- | --- |
| `accounts` | Bank accounts, cash, cards, wallets and their balances |
| `categories` | Expense and income categories |
| `transactions` | Income and expense records |
| `budgets` | Monthly category budgets |
| `goals` | Savings goals |
| `groups` | Groups with their members, expenses, and settlements |
| `alertSettings` | Email notification on/off and the recipient address |
| `alertLog` | History of alerts already sent |

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
- The main content area shows the selected module.
- **Responsive layout:** on screens 768px wide or less, the sidebar collapses into a hamburger menu, the top bar stays fixed while scrolling, cards stack into one column, and tables scroll sideways inside their card.

#### Transactions Module

- Record income and expenses in a form
- Search by description or payment method
- Filter by type, category, account, and date range
- Sort by date or amount

#### Groups Module

- Add members
- Add expenses with different split types
- Show member balances (who gets money back and who owes)
- Generate simplified settlements
- Maintain settlement history

#### Dashboard Module

- Cards for total balance, monthly income, monthly expenses, and net savings
- Smart alerts for budgets near or over their limit and overdue goals
- Recent transactions and account balances
- Current month budgets and goal progress

#### Alerts Module

- Counts of budgets at Halfway, Near Limit, and Exceeded levels
- List of active alerts for the current month
- Email notification settings
- Alert history

#### Built-in Rules

- Account balances are updated every time a transaction is added, edited, or deleted.
- A category or account that is used by transactions or budgets cannot be deleted.
- Renaming a category or account also updates the transactions and budgets that use it.
- Each month has its own budgets, and alerts only look at the current month.

---

## Tech Stack

- **HTML5** for the page structure
- **CSS3** with Flexbox, Grid, and media queries for the responsive layout
- **JavaScript (ES6)** for the DOM, events, forms, `localStorage`, and `fetch` (used to load the sidebar component)
- **EmailJS** (loaded from a CDN) used only for optional email notifications

---

## Prerequisites

- A modern web browser such as Chrome, Edge, or Firefox
- Git installed for cloning the repository
- A code editor with a local server option, such as VS Code with the **Live Server** extension
- *(Optional)* An [EmailJS](https://www.emailjs.com/) account for email notifications. The application works without it.

---

## How to Run the Application

### 1. Clone the Repository

```bash
git clone <https://github.com/Aditi-Sachdeva/expense-manager.git>
cd expense-manager
```

### 2. Start a Local Server

The sidebar is loaded with `fetch`, so the project must be opened through a local server. Opening `index.html` directly from the file system will not show the sidebar.

1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` and choose **Open with Live Server**.

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

A good order to try the application:

1. **Accounts:** add an account, for example *HDFC Bank* with ₹10,000.
2. **Categories:** add an expense category, for example *Groceries*, and an income category, for example *Salary*.
3. **Transactions:** record some income and expenses. The account balance updates automatically.
4. **Budgets:** create a budget for *Groceries* for the current month.
5. **Goals:** add a savings goal with a target date.
6. **Groups:** create a group, add members, add an expense, and settle up.
7. **Dashboard:** check the financial summary and smart alerts.

### 4. Set Up Email Alerts (Optional)

1. In your EmailJS account, add an email service and create an email template that uses these variables: `to_email`, `subject_line`, `title`, `color`, and `message`.
2. Copy your **Service ID**, **Template ID**, and **Public Key** into the three constants at the top of `js/alerts.js`.
3. Open the **Alerts** page, tick the email option, enter your email address, and click **Save Settings**.

### 5. Test Alerts

1. Create a budget for the current month, for example **₹5,000** for *Groceries*.
2. Record grocery expenses that bring the spending to 50%, 80%, and 100% of the budget.
3. Open the **Alerts** page. The active alert appears in the list and the counts update.
4. If email notifications are enabled, an email is sent once for each level reached, and the alert history records it.

---

## Project Structure

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
├── LICENSE
└── README.md
```

---

## Limitations

- Data is stored in the browser's `localStorage`. It stays on one browser on one device, and clearing the browser's site data removes it. There is no backend database or login.
- Email notifications are sent when the Alerts page checks the budgets, not at the exact moment a budget is crossed.
- Email notifications require EmailJS configuration, and the EmailJS keys are visible in the browser. Restrict allowed domains in your EmailJS dashboard.
- Transactions and budgets refer to accounts and categories by name, so the application blocks deleting items that are in use.
- The application is designed for demonstration purposes and is not intended for production use.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.