
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
        <td>${acc.name}</td>
        <td>${acc.type}</td>
        <td>${acc.initialBalance}</td>
        <td>${acc.currentBalance}</td>
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
  const updatedAccount = {
    name: document.getElementById("accountName").value,
    type: document.getElementById("accountType").value,
    initialBalance: document.getElementById("initialBalance").value,
    currentBalance: document.getElementById("initialBalance").value
  };

  if (editIndex !== null) {
    accounts[editIndex] = updatedAccount;
    editIndex = null;
    modalTitle.textContent = "Add New Account";
  } else {
    accounts.push(updatedAccount);
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
  const confirmDelete = confirm("Do you really want to delete this account?");
  if (confirmDelete) {
    accounts.splice(index, 1);
    saveData("accounts", accounts);
    renderAccounts();
  }
}

addAccountBtn.addEventListener("click", () => {
  editIndex = null; 
  modalTitle.textContent = "Add New Account";
  accountModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => accountModal.classList.add("hidden"));
cancelBtn.addEventListener("click", () => accountModal.classList.add("hidden"));

renderAccounts();
