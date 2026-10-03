
const accountsTableBody = document.getElementById("accountsTableBody");
const accountCount = document.getElementById("accountCount");
const emptyMessage = document.getElementById("emptyMessage");
const accountForm = document.getElementById("accountForm");
const accountModal = document.getElementById("accountModal");
const addAccountBtn = document.getElementById("addAccountBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modalTitle = document.getElementById("modalTitle");

let accounts = loadData("accounts");
let editIndex = null;

function renderAccounts() {
  accountsTableBody.innerHTML = "";
  if (accounts.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
    accounts.forEach((acc, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="account-name">${acc.name}</td>
        <td><span class="badge badge-neutral">${acc.type}</span></td>
        <td class="balance">${formatMoney(acc.initialBalance)}</td>
        <td class="balance ${acc.currentBalance < 0 ? "red" : "green"}">${formatMoney(acc.currentBalance)}</td>
        <td class="text-right">
          <button class="btn btn-small" onclick="editAccount(${index})">Edit</button>
          <button class="btn btn-small btn-danger" onclick="deleteAccount(${index})">Delete</button>
        </td>
      `;
      accountsTableBody.appendChild(row);
    });
  }
  accountCount.textContent = accounts.length;
}

accountForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("accountName").value.trim();
  const type = document.getElementById("accountType").value;
  const initial = parseFloat(document.getElementById("initialBalance").value);

  if (!name || isNaN(initial) || initial < 0) {
    alert("Please enter a valid name and balance.");
    return;
  }

  const duplicate = accounts.some((a, i) =>
    a.name.toLowerCase() === name.toLowerCase() && i !== editIndex
  );
  if (duplicate) {
    alert("An account with this name already exists.");
    return;
  }

  let currentBalance = initial;

  if (editIndex !== null) {
    const old = accounts[editIndex];
    currentBalance = Number(old.currentBalance) - Number(old.initialBalance) + initial;

    if (old.name !== name) {
      const transactions = loadData("transactions");
      transactions.forEach(t => {
        if (t.account === old.name) t.account = name;
      });
      saveData("transactions", transactions);
    }
  }

  const newAccount = {
    name,
    type,
    initialBalance: initial,
    currentBalance: Math.round(currentBalance * 100) / 100 
  };

  if (editIndex !== null) {
    accounts[editIndex] = newAccount;
    editIndex = null;
    modalTitle.textContent = "Add New Account";
  } else {
    accounts.push(newAccount);
  }

  saveData("accounts", accounts);
  renderAccounts();
  accountModal.classList.add("hidden");
  accountForm.reset();
});

function editAccount(index) {
  editIndex = index;
  const acc = accounts[index];
  document.getElementById("accountName").value = acc.name;
  document.getElementById("accountType").value = acc.type;
  document.getElementById("initialBalance").value = acc.initialBalance;
  modalTitle.textContent = "Edit Account";
  accountModal.classList.remove("hidden");
}

function deleteAccount(index) {
  const transactions = loadData("transactions");
  if (transactions.some(t => t.account === accounts[index].name)) {
    alert("This account has transactions. Delete those transactions first.");
    return;
  }

  if (confirm("Do you really want to delete this account?")) {
    accounts.splice(index, 1);
    saveData("accounts", accounts);
    renderAccounts();
  }
}

addAccountBtn.addEventListener("click", () => {
  editIndex = null;
  accountForm.reset();
  modalTitle.textContent = "Add New Account";
  accountModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => accountModal.classList.add("hidden"));
cancelBtn.addEventListener("click", () => accountModal.classList.add("hidden"));

renderAccounts();