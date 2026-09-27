
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
    // Turns "expense"/"income" into the badge look: red "Expense" or green "Income"
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

categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const updatedCategory = {
    name: document.getElementById("categoryName").value,
    type: document.getElementById("categoryType").value
  };

  if (editIndex !== null) {
    categories[editIndex] = updatedCategory;
    editIndex = null;
    modalTitle.textContent = "Add New Category";
  } else {
    categories.push(updatedCategory);
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
  const confirmDelete = confirm("Do you really want to delete this category?");
  if (confirmDelete) {
    categories.splice(index, 1);
    saveData("categories", categories);
    renderCategories();
  }
}

addCategoryBtn.addEventListener("click", () => {
  editIndex = null;
  modalTitle.textContent = "Add New Category";
  categoryModal.classList.remove("hidden");
});
closeModalBtn.addEventListener("click", () => categoryModal.classList.add("hidden"));
cancelBtn.addEventListener("click", () => categoryModal.classList.add("hidden"));

renderCategories();