
const totalBalanceEl = document.getElementById("totalBalance");
const monthIncomeEl = document.getElementById("monthIncome");
const monthExpensesEl = document.getElementById("monthExpenses");
const netSavingsEl = document.getElementById("netSavings");

const alertsList = document.getElementById("alertsList");
const recentTransactions = document.getElementById("recentTransactions");
const accountsList = document.getElementById("accountsList");
const budgetsList = document.getElementById("budgetsList");
const goalsList = document.getElementById("goalsList");

const accounts = loadData("accounts");
const transactions = loadData("transactions");
const budgets = loadData("budgets");
const goals = loadData("goals");

const today = new Date();
const currentMonth = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0");

const todayText = currentMonth + "-" + String(today.getDate()).padStart(2, "0");

function calcSpent(budget) {
  return transactions
    .filter(t => t.type === "expense" &&
      t.category === budget.category &&
      t.date.startsWith(budget.month))
    .reduce((sum, t) => sum + t.amount, 0);
}

function renderStats() {
  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.currentBalance), 0);

  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

  const income = monthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  totalBalanceEl.textContent = formatMoney(totalBalance);
  monthIncomeEl.textContent = formatMoney(income);
  monthExpensesEl.textContent = formatMoney(expenses);
  netSavingsEl.textContent = formatMoney(income - expenses);
}

function renderAlerts() {
  const alerts = [];

  budgets.filter(b => b.month === currentMonth).forEach(b => {
    const spent = calcSpent(b);
    const percent = spent / b.amount * 100;
    const text = `${formatMoney(spent)} of ${formatMoney(b.amount)} (${percent.toFixed(1)}%)`;

    if (percent >= 100) {
      alerts.push({ title: b.category, text, name: "Exceeded", color: "#dc2626" });
    } 
    else if (percent >= 80) {
      alerts.push({ title: b.category, text, name: "Near Limit", color: "#d97706" });
    }
  });

  goals.forEach(g => {
    if (g.saved < g.target && g.date < todayText) {
      alerts.push({
        title: g.name,
        text: `${formatMoney(g.saved)} of ${formatMoney(g.target)} saved, due ${g.date}`,
        name: "Overdue Goal",
        color: "#dc2626"
      });
    }
  });

  if (alerts.length === 0) return;

  alertsList.innerHTML = "";
  alerts.forEach(a => {
    alertsList.innerHTML += `
      <div class="alert-row">
        <div class="alert-info">
          <strong>${a.title}</strong>
          <p>${a.text}</p>
        </div>
        <span class="badge" style="background:${a.color}; color:#fff;">${a.name}</span>
      </div>
    `;
  });
}

function renderRecentTransactions() {
  if (transactions.length === 0) return;

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  recentTransactions.innerHTML = "";
  recent.forEach(t => {
    const isIncome = t.type === "income";
    recentTransactions.innerHTML += `
      <div class="balance-row">
        <div>
          <strong>${t.description || t.category}</strong>
          <p class="empty-inline">${t.category} • ${t.account} • ${t.date}</p>
        </div>
        <span class="balance-amount ${isIncome ? "green" : "red"}">
          ${isIncome ? "+" : "-"}${formatMoney(t.amount)}
        </span>
      </div>
    `;
  });
}

function renderAccounts() {
  if (accounts.length === 0) return;

  accountsList.innerHTML = "";
  accounts.forEach(acc => {
    accountsList.innerHTML += `
      <div class="balance-row">
        <div>
          <strong>${acc.name}</strong>
          <p class="empty-inline">${acc.type}</p>
        </div>
        <span class="balance-amount">${formatMoney(acc.currentBalance)}</span>
      </div>
    `;
  });
}

function renderBudgets() {
  
  const monthBudgets = budgets.filter(b => b.month === currentMonth);
  if (monthBudgets.length === 0) return;

  budgetsList.innerHTML = "";
  monthBudgets.forEach(b => {
    const spent = calcSpent(b);
    const util = spent / b.amount * 100;

    let progressClass = "";
    if (util >= 100) progressClass = "danger";
    else if (util >= 80) progressClass = "warning";

    budgetsList.innerHTML += `
      <div class="progress-item">
        <div class="progress-top">
          <strong>${b.category}</strong>
          <span class="empty-inline">${formatMoney(spent)} / ${formatMoney(b.amount)}</span>
        </div>
        <div class="progress">
          <div class="progress-fill ${progressClass}" style="width:${Math.min(util, 100)}%"></div>
        </div>
      </div>
    `;
  });
}

function renderGoals() {
  if (goals.length === 0) return;

  goalsList.innerHTML = "";
  goals.forEach(g => {
    const progress = g.target ? g.saved / g.target * 100 : 0;

    let progressClass = "warning";
    if (g.saved >= g.target) progressClass = "";
    else if (g.date < todayText) progressClass = "danger";

    goalsList.innerHTML += `
      <div class="progress-item">
        <div class="progress-top">
          <strong>${g.name}</strong>
          <span class="empty-inline">${formatMoney(g.saved)} / ${formatMoney(g.target)}</span>
        </div>
        <div class="progress">
          <div class="progress-fill ${progressClass}" style="width:${Math.min(progress, 100)}%"></div>
        </div>
      </div>
    `;
  });
}

renderStats();
renderAlerts();
renderRecentTransactions();
renderAccounts();
renderBudgets();
renderGoals();