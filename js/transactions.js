
const recordIncomeBtn = document.getElementById("recordIncomeBtn");
const recordExpenseBtn = document.getElementById("recordExpenseBtn");
const transactionModal = document.getElementById("transactionModal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const transactionForm = document.getElementById("transactionForm");
const transactionsTableBody = document.getElementById("transactionsTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const noMatchMessage = document.getElementById("noMatchMessage");
const transactionCount = document.getElementById("transactionCount");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const accountFilter = document.getElementById("accountFilter");
const sortFilter = document.getElementById("sortFilter");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");

const transactionType = document.getElementById("transactionType");
const transactionCategory = document.getElementById("transactionCategory");
const transactionAccount = document.getElementById("transactionAccount");

let transactions = loadData("transactions");
let accounts = loadData("accounts");
let categories = loadData("categories");
let editIndex = null;

function saveAll() {
    saveData("transactions", transactions);
    saveData("accounts", accounts);
}

function updateAccountBalance(t, undo) {

    const acc = accounts.find(a => a.name === t.account);
    if (!acc) return;

    let change = t.type === "income" ? t.amount : -t.amount;
    if (undo) change = -change;

    acc.currentBalance = Math.round((Number(acc.currentBalance) + change) * 100) / 100;
}

function populateFilters() {

    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    const uniqueNames = [...new Set(categories.map(cat => cat.name))];

    uniqueNames.forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        categoryFilter.appendChild(opt);
    });

    accountFilter.innerHTML = `<option value="all">All Accounts</option>`;

    accounts.forEach(acc => {
        const opt = document.createElement("option");
        opt.value = acc.name;
        opt.textContent = acc.name;
        accountFilter.appendChild(opt);
    });
}

function populateModalDropdowns() {

    const type = transactionType.value;

    transactionCategory.innerHTML = "";
    categories
        .filter(cat => cat.type === type)
        .forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.name;
            opt.textContent = cat.name;
            transactionCategory.appendChild(opt);
        });

    transactionAccount.innerHTML = "";
    accounts.forEach(acc => {
        const opt = document.createElement("option");
        opt.value = acc.name;
        opt.textContent = acc.name;
        transactionAccount.appendChild(opt);
    });
}

function openModal(type) {

    editIndex = null;
    transactionForm.reset();
    transactionType.value = type;
    populateModalDropdowns();

    if (accounts.length === 0) {
        alert("Add an account first (Accounts page).");
        return;
    }
    if (transactionCategory.options.length === 0) {
        alert("Add an " + type + " category first (Categories page).");
        return;
    }

    modalTitle.textContent = type === "income" ? "Record Income" : "Record Expense";

    const now = new Date();
    document.getElementById("transactionDate").value = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") 
    + "-" + String(now.getDate()).padStart(2, "0");

    transactionModal.classList.remove("hidden");
}

function closeModal() {
    transactionModal.classList.add("hidden");
    editIndex = null;
}

recordIncomeBtn.addEventListener("click", () => openModal("income"));
recordExpenseBtn.addEventListener("click", () => openModal("expense"));
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
transactionType.addEventListener("change", populateModalDropdowns);

transactionForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const newTransaction = {
        type: transactionType.value,
        amount: parseFloat(document.getElementById("transactionAmount").value),
        category: transactionCategory.value,
        account: transactionAccount.value,
        date: document.getElementById("transactionDate").value,
        description: document.getElementById("transactionDescription").value.trim(),
        method: document.getElementById("transactionMethod").value.trim(),
    };

    if (!(newTransaction.amount > 0)) {
        alert("Amount must be greater than 0.");
        return;
    }
    if (!newTransaction.category || !newTransaction.account) {
        alert("Please choose a category and an account.");
        return;
    }

    if (editIndex !== null) {
        updateAccountBalance(transactions[editIndex], true);
        transactions[editIndex] = newTransaction;
    } 
    else {
        transactions.push(newTransaction);
    }

    updateAccountBalance(newTransaction, false);

    saveAll();
    closeModal();
    transactionForm.reset();
    renderTransactions();

});

function editTransaction(index) {

    const t = transactions[index];
    editIndex = index;

    modalTitle.textContent = "Edit Transaction";
    transactionType.value = t.type;
    populateModalDropdowns();

    document.getElementById("transactionAmount").value = t.amount;
    transactionCategory.value = t.category;
    transactionAccount.value = t.account;
    document.getElementById("transactionDate").value = t.date;
    document.getElementById("transactionDescription").value = t.description;
    document.getElementById("transactionMethod").value = t.method;

    transactionModal.classList.remove("hidden");

}

function deleteTransaction(index) {
    if (confirm("Delete this transaction?")) {
        updateAccountBalance(transactions[index], true);
        transactions.splice(index, 1);
        saveAll();
        renderTransactions();
    }
}

function renderTransactions() {

    transactionsTableBody.innerHTML = "";

    if (transactions.length === 0) {
        emptyMessage.style.display = "block";
        noMatchMessage.style.display = "none";
        transactionCount.textContent = 0;
        return;
    }

    let filtered = [...transactions];

    const search = searchInput.value.trim().toLowerCase();
    if (search) {
        filtered = filtered.filter(t =>
            (t.description && t.description.toLowerCase().includes(search)) ||
            (t.method && t.method.toLowerCase().includes(search))
        );
    }

    if (typeFilter.value !== "all") {
        filtered = filtered.filter(t => t.type === typeFilter.value);
    }

    if (categoryFilter.value !== "all") {
        filtered = filtered.filter(t => t.category === categoryFilter.value);
    }

    if (accountFilter.value !== "all") {
        filtered = filtered.filter(t => t.account === accountFilter.value);
    }

    if (fromDate.value) {
        filtered = filtered.filter(t => t.date >= fromDate.value);
    }
    if (toDate.value) {
        filtered = filtered.filter(t => t.date <= toDate.value);
    }

    if (sortFilter.value === "newest") {
        filtered.sort((a, b) => b.date.localeCompare(a.date));
    } 
    else if (sortFilter.value === "oldest") {
        filtered.sort((a, b) => a.date.localeCompare(b.date));
    } 
    else if (sortFilter.value === "highest") {
        filtered.sort((a, b) => b.amount - a.amount);
    } 
    else if (sortFilter.value === "lowest") {
        filtered.sort((a, b) => a.amount - b.amount);
    }

    if (filtered.length === 0) {
        noMatchMessage.style.display = "block";
        emptyMessage.style.display = "none";
        transactionCount.textContent = 0;
        return;
    }

    noMatchMessage.style.display = "none";
    emptyMessage.style.display = "none";

    filtered.forEach((t) => {
        const realIndex = transactions.indexOf(t);

        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${t.date}</td>
      <td><span class="badge ${t.type === "income" ? "badge-income" : "badge-expense"}">${t.type}</span></td>
      <td>${t.category}</td>
      <td>${t.account}</td>
      <td>${t.description || "-"}</td>
      <td>${t.method || "-"}</td>
      <td class="${t.type === "income" ? "green balance" : "red balance"}">${formatMoney(t.amount)}</td>
      <td class="text-right">
        <button class="btn btn-small" onclick="editTransaction(${realIndex})">Edit</button>
        <button class="btn btn-small btn-danger" onclick="deleteTransaction(${realIndex})">Delete</button>
      </td>
    `;
        transactionsTableBody.appendChild(row);
    });

    transactionCount.textContent = filtered.length;
}

resetFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "all";
    categoryFilter.value = "all";
    accountFilter.value = "all";
    sortFilter.value = "newest";
    fromDate.value = "";
    toDate.value = "";
    renderTransactions();
});

searchInput.addEventListener("input", renderTransactions);
typeFilter.addEventListener("change", renderTransactions);
categoryFilter.addEventListener("change", renderTransactions);
accountFilter.addEventListener("change", renderTransactions);
sortFilter.addEventListener("change", renderTransactions);
fromDate.addEventListener("change", renderTransactions);
toDate.addEventListener("change", renderTransactions);

populateFilters();
renderTransactions();