
const budgetsTableBody = document.getElementById("budgetsTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const noMatchMessage = document.getElementById("noMatchMessage");
const budgetCount = document.getElementById("budgetCount");

const totalBudgetEl = document.getElementById("totalBudget");
const totalSpentEl = document.getElementById("totalSpent");
const totalRemainingEl = document.getElementById("totalRemaining");
const overallUtilizationEl = document.getElementById("overallUtilization");

const addBudgetBtn = document.getElementById("addBudgetBtn");
const addFirstBudgetBtn = document.getElementById("addFirstBudgetBtn");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

const monthFilter = document.getElementById("monthFilter");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

const budgetModal = document.getElementById("budgetModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const budgetForm = document.getElementById("budgetForm");
const modalTitle = document.getElementById("modalTitle");

const budgetCategory = document.getElementById("budgetCategory");
const budgetMonth = document.getElementById("budgetMonth");
const budgetAmount = document.getElementById("budgetAmount");

let budgets = loadData("budgets");
let categories = loadData("categories");
let transactions = loadData("transactions");
let editIndex = null;

function saveAll() {
    saveData("budgets", budgets);
}

function calcSpent(budget) {
    return transactions
        .filter(
            t =>
                t.type === "expense" &&
                t.category === budget.category &&
                t.date.startsWith(budget.month)
        )
        .reduce((sum, t) => sum + t.amount, 0);
}

function getStatus(util) {

    if (util < 80) {
        return {
            text: "On Track",
            key: "on-track",
            badge: "badge-income",
            bar: ""
        };
    }

    if (util < 100) {
        return {
            text: "Near Limit",
            key: "near-limit",
            badge: "badge-warning",
            bar: "warning"
        };
    }

    return {
        text: "Exceeded",
        key: "exceeded",
        badge: "badge-expense",
        bar: "danger"
    };
}

function daysLeft(monthStr) {

    const [year, month] = monthStr.split("-").map(Number);
    const lastDay = new Date(year, month, 0);
    const today = new Date();

    if (today.getFullYear() !== year || today.getMonth() + 1 !== month) {
        return null;
    }

    return lastDay.getDate() - today.getDate() + 1;
}

function populateCategoryDropdown() {

    budgetCategory.innerHTML = "";

    categories
        .filter(c => c.type === "expense")
        .forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.name;
            opt.textContent = c.name;
            budgetCategory.appendChild(opt);
        });
}

function openModal() {

    populateCategoryDropdown();

    if (budgetCategory.options.length === 0) {
        alert("Add an expense category first (Categories page).");
        return;
    }

    editIndex = null;
    modalTitle.textContent = "Add Category Budget";
    budgetForm.reset();

    const now = new Date();

    budgetMonth.value = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

    budgetModal.classList.remove("hidden");
}

function closeModal() {
    budgetModal.classList.add("hidden");
    editIndex = null;
}

budgetForm.addEventListener("submit", e => {

    e.preventDefault();

    const newBudget = {
        category: budgetCategory.value,
        month: budgetMonth.value,
        amount: parseFloat(budgetAmount.value)
    };

    if (!(newBudget.amount > 0)) {
        alert("Budget amount must be greater than 0.");
        return;
    }

    const duplicate = budgets.some(
        (b, i) =>
            b.category === newBudget.category &&
            b.month === newBudget.month &&
            i !== editIndex
    );

    if (duplicate) {
        alert("Budget for this category and month already exists.");
        return;
    }

    if (editIndex !== null) {
        budgets[editIndex] = newBudget;
    } else {
        budgets.push(newBudget);
    }

    saveAll();
    closeModal();
    populateFilters();
    renderBudgets();
});

function editBudget(index) {

    const b = budgets[index];

    editIndex = index;
    modalTitle.textContent = "Edit Budget";

    populateCategoryDropdown();

    budgetCategory.value = b.category;
    budgetMonth.value = b.month;
    budgetAmount.value = b.amount;

    budgetModal.classList.remove("hidden");
}

function deleteBudget(index) {

    if (confirm("Delete this budget?")) {
        budgets.splice(index, 1);
        saveAll();
        populateFilters();
        renderBudgets();
    }
}

function renderBudgets() {

    budgetsTableBody.innerHTML = "";

    if (budgets.length === 0) {
        emptyMessage.style.display = "block";
        noMatchMessage.style.display = "none";
        budgetCount.textContent = 0;
        updateStats([]);
        return;
    }

    let filtered = [...budgets];

    if (monthFilter.value !== "all") {
        filtered = filtered.filter(b => b.month === monthFilter.value);
    }

    if (categoryFilter.value !== "all") {
        filtered = filtered.filter(
            b => b.category === categoryFilter.value
        );
    }

    if (statusFilter.value !== "all") {
        filtered = filtered.filter(
            b =>
                getStatus((calcSpent(b) / b.amount) * 100).key ===
                statusFilter.value
        );
    }

    if (filtered.length === 0) {
        noMatchMessage.style.display = "block";
        emptyMessage.style.display = "none";
        budgetCount.textContent = 0;
        updateStats([]);
        return;
    }

    noMatchMessage.style.display = "none";
    emptyMessage.style.display = "none";

    filtered.forEach(b => {
        const spent = calcSpent(b);
        const remaining = b.amount - spent;
        const util = (spent / b.amount) * 100;
        const status = getStatus(util);

        const realIndex = budgets.indexOf(b);
        const dLeft = daysLeft(b.month);
        const perDay =
            dLeft !== null && remaining > 0
                ? remaining / dLeft
                : null;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${b.category}</td>
            <td>${b.month}</td>
            <td>${formatMoney(b.amount)}</td>
            <td>${formatMoney(spent)}</td>
            <td class="${remaining < 0 ? "red" : ""}">
                ${formatMoney(remaining)}
                ${dLeft !== null
                ? `<br><small>${dLeft} days left${perDay
                    ? ` → ${formatMoney(perDay)}/day`
                    : ``
                }</small>`
                : ""
            }
            </td>
            <td>
                ${util.toFixed(1)}%
                <div class="progress">
                    <div
                        class="progress-fill ${status.bar}"
                        style="width:${Math.min(util, 100)}%"
                    ></div>
                </div>
            </td>
            <td>
                <span class="badge ${status.badge}">
                    ${status.text}
                </span>
            </td>
            <td>
                <button
                    class="btn btn-small"
                    onclick="editBudget(${realIndex})"
                >
                    Edit
                </button>
                <button
                    class="btn btn-small btn-danger"
                    onclick="deleteBudget(${realIndex})"
                >
                    Delete
                </button>
            </td>
        `;

        budgetsTableBody.appendChild(row);
    });

    budgetCount.textContent = filtered.length;
    updateStats(filtered);
}

function updateStats(list) {

    const totalBudget = list.reduce(
        (s, b) => s + b.amount,
        0
    );

    const totalSpent = list.reduce(
        (s, b) => s + calcSpent(b),
        0
    );

    const totalRemaining = totalBudget - totalSpent;

    const util = totalBudget ? (totalSpent / totalBudget * 100).toFixed(1) : 0;

    totalBudgetEl.textContent = formatMoney(totalBudget);
    totalSpentEl.textContent = formatMoney(totalSpent);
    totalRemainingEl.textContent = formatMoney(totalRemaining);
    overallUtilizationEl.textContent = util + "%";
}

function populateFilters() {

    const selectedMonth = monthFilter.value;
    const selectedCategory = categoryFilter.value;

    const months = [...new Set(budgets.map(b => b.month))];

    monthFilter.innerHTML = `<option value="all">All Months</option>`;

    months.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        monthFilter.appendChild(opt);
    });

    monthFilter.value = months.includes(selectedMonth) ? selectedMonth : "all";

    const cats = [...new Set(budgets.map(b => b.category))];

    categoryFilter.innerHTML =
        `<option value="all">All Categories</option>`;

    cats.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        categoryFilter.appendChild(opt);
    });

    categoryFilter.value = cats.includes(selectedCategory) ? selectedCategory : "all";

}

addBudgetBtn.addEventListener("click", openModal);
addFirstBudgetBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

resetFiltersBtn.addEventListener("click", () => {
    monthFilter.value = "all";
    categoryFilter.value = "all";
    statusFilter.value = "all";
    renderBudgets();
});

monthFilter.addEventListener("change", renderBudgets);
categoryFilter.addEventListener("change", renderBudgets);
statusFilter.addEventListener("change", renderBudgets);

populateFilters();
renderBudgets();