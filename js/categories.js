
const expenseCategoriesBody = document.getElementById("expenseCategoriesBody");
const incomeCategoriesBody = document.getElementById("incomeCategoriesBody");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoryModal = document.getElementById("categoryModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const categoryForm = document.getElementById("categoryForm");
const modalTitle = document.getElementById("modalTitle");

let categories = loadData("categories");
let editIndex = null;

function renderCategories() {
  expenseCategoriesBody.innerHTML = "";
  incomeCategoriesBody.innerHTML = "";

  categories.forEach((cat, index) => {
    const badgeClass = cat.type === "expense" ? "badge-expense" : "badge-income";
    const badgeText = cat.type === "expense" ? "Expense" : "Income";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="category-name">${cat.name}</td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      <td class="text-right">
        <button class="btn btn-small" onclick="editCategory(${index})">Edit</button>
        <button class="btn btn-small btn-danger" onclick="deleteCategory(${index})">Delete</button>
      </td>
    `;

    if (cat.type === "expense") {
      expenseCategoriesBody.appendChild(row);
    } else {
      incomeCategoriesBody.appendChild(row);
    }
  });
}

function isInUse(cat) {
  const transactions = loadData("transactions");
  const budgets = loadData("budgets");

  const usedInTransactions = transactions.some(t => t.category === cat.name && t.type === cat.type);
  const usedInBudgets = cat.type === "expense" && budgets.some(b => b.category === cat.name);

  return usedInTransactions || usedInBudgets;
}

categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("categoryName").value.trim();
  const type = document.getElementById("categoryType").value;

  if (!name) {
    alert("Please enter a category name.");
    return;
  }

  const duplicate = categories.some((c, i) =>
    c.name.toLowerCase() === name.toLowerCase() && c.type === type && i !== editIndex
  );
  if (duplicate) {
    alert("This category already exists.");
    return;
  }

  if (editIndex !== null) {
    const old = categories[editIndex];

    if (old.type !== type && isInUse(old)) {
      alert("This category is already used, so its type cannot be changed.");
      return;
    }

    if (old.name !== name) {
      const transactions = loadData("transactions");
      transactions.forEach(t => {
        if (t.category === old.name && t.type === old.type) t.category = name;
      });
      saveData("transactions", transactions);

      const budgets = loadData("budgets");
      budgets.forEach(b => {
        if (old.type === "expense" && b.category === old.name) b.category = name;
      });
      saveData("budgets", budgets);
    }

    categories[editIndex] = { name, type };
    editIndex = null;
    modalTitle.textContent = "Add New Category";
  } else {
    categories.push({ name, type });
  }

  saveData("categories", categories);
  renderCategories();
  categoryModal.classList.add("hidden");
  categoryForm.reset();
});

function editCategory(index) {
  editIndex = index;
  const cat = categories[index];
  document.getElementById("categoryName").value = cat.name;
  document.getElementById("categoryType").value = cat.type;
  modalTitle.textContent = "Edit Category";
  categoryModal.classList.remove("hidden");
}

function deleteCategory(index) {

  if (isInUse(categories[index])) {
    alert("This category is used in transactions or budgets, so it cannot be deleted.");
    return;
  }

  if (confirm("Do you really want to delete this category?")) {
    categories.splice(index, 1);
    saveData("categories", categories);
    renderCategories();
  }
}

addCategoryBtn.addEventListener("click", () => {
  editIndex = null;
  categoryForm.reset();
  modalTitle.textContent = "Add New Category";
  categoryModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => categoryModal.classList.add("hidden"));
cancelBtn.addEventListener("click", () => categoryModal.classList.add("hidden"));

renderCategories();