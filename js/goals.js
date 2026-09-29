
const goalsTableBody = document.getElementById("goalsTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const goalCount = document.getElementById("goalCount");

const totalTargetEl = document.getElementById("totalTarget");
const totalSavedEl = document.getElementById("totalSaved");
const totalRemainingEl = document.getElementById("totalRemaining");
const overallProgressEl = document.getElementById("overallProgress");

const addGoalBtn = document.getElementById("addGoalBtn");
const addFirstGoalBtn = document.getElementById("addFirstGoalBtn");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");

const goalModal = document.getElementById("goalModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const goalForm = document.getElementById("goalForm");
const modalTitle = document.getElementById("modalTitle");

const goalName = document.getElementById("goalName");
const goalTarget = document.getElementById("goalTarget");
const goalSaved = document.getElementById("goalSaved");
const goalDate = document.getElementById("goalDate");

let goals = loadData("goals") || [];
let editIndex = null;

function formatMoney(amount) {
  return "₹" + amount.toFixed(2);
}

function saveAll() {
  saveData("goals", goals);
}

function getStatus(goal) {
  const today = new Date();
  const targetDate = new Date(goal.date);
  if (goal.saved >= goal.target) return "completed";
  if (today > targetDate && goal.saved < goal.target) return "overdue";
  return "in-progress";
}

function openModal(isEdit = false) {
  if (!isEdit) {
    modalTitle.textContent = "Add Financial Goal";
    goalForm.reset();
  }
  goalModal.classList.remove("hidden");
}

function closeModal() {
  goalModal.classList.add("hidden");
  editIndex = null;
}

goalForm.addEventListener("submit", e => {
  e.preventDefault();
  const newGoal = {
    name: goalName.value.trim(),
    target: parseFloat(goalTarget.value),
    saved: parseFloat(goalSaved.value) || 0,
    date: goalDate.value
  };

  if (newGoal.saved > newGoal.target) {
    alert("Saved amount cannot exceed target amount.");
    return;
  }

  if (editIndex !== null) {
    goals[editIndex] = newGoal;
  } else {
    goals.push(newGoal);
  }

  saveAll();
  closeModal();
  renderGoals();
});

function editGoal(index) {
  const g = goals[index];
  editIndex = index;
  modalTitle.textContent = "Edit Financial Goal";
  goalName.value = g.name;
  goalTarget.value = g.target;
  goalSaved.value = g.saved;
  goalDate.value = g.date;
  goalModal.classList.remove("hidden");
}

function deleteGoal(index) {
  if (confirm("Delete this goal?")) {
    goals.splice(index, 1);
    saveAll();
    renderGoals();
  }
}

function renderGoals() {
  goalsTableBody.innerHTML = "";

  if (goals.length === 0) {
    emptyMessage.style.display = "block";
    goalCount.textContent = 0;
    updateStats([]);
    return;
  }

  emptyMessage.style.display = "none";

  let filtered = [...goals];

  if (statusFilter.value !== "all") {
    filtered = filtered.filter(g => getStatus(g) === statusFilter.value);
  }

  if (sortFilter.value === "date-earliest") {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortFilter.value === "date-latest") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortFilter.value === "progress-highest") {
    filtered.sort((a, b) => (b.saved / b.target) - (a.saved / a.target));
  } else if (sortFilter.value === "progress-lowest") {
    filtered.sort((a, b) => (a.saved / a.target) - (b.saved / b.target));
  }

  filtered.forEach(g => {
    const remaining = g.target - g.saved;
    const progress = g.target ? (g.saved / g.target * 100) : 0;
    const status = getStatus(g);
    let badgeClass, progressClass;
    if (status === "completed") { badgeClass = "badge-income"; progressClass = ""; }
    else if (status === "overdue") { badgeClass = "badge-expense"; progressClass = "danger"; }
    else { badgeClass = "badge-warning"; progressClass = "warning"; }

    const realIndex = goals.indexOf(g);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${g.name}</td>
      <td>${formatMoney(g.target)}</td>
      <td>${formatMoney(g.saved)}</td>
      <td class="${remaining < 0 ? 'red' : ''}">${formatMoney(remaining)}</td>
      <td>${g.date}</td>
      <td>
        ${progress.toFixed(1)}%
        <div class="progress"><div class="progress-fill ${progressClass}" style="width:${Math.min(progress, 100)}%"></div></div>
      </td>
      <td><span class="badge ${badgeClass}">${status.replace("-", " ")}</span></td>
      <td>
        <button class="btn btn-small" onclick="editGoal(${realIndex})">Edit</button>
        <button class="btn btn-small btn-danger" onclick="deleteGoal(${realIndex})">Delete</button>
      </td>
    `;
    goalsTableBody.appendChild(row);
  });

  goalCount.textContent = filtered.length;
  updateStats(filtered);
}

function updateStats(list) {
  const totalTarget = list.reduce((s,g)=>s+g.target,0);
  const totalSaved = list.reduce((s,g)=>s+g.saved,0);
  const totalRemaining = totalTarget - totalSaved;
  const progress = totalTarget ? (totalSaved/totalTarget*100).toFixed(1) : 0;

  totalTargetEl.textContent = formatMoney(totalTarget);
  totalSavedEl.textContent = formatMoney(totalSaved);
  totalRemainingEl.textContent = formatMoney(totalRemaining);
  overallProgressEl.textContent = progress + "%";
}

addGoalBtn.addEventListener("click", ()=>openModal());
addFirstGoalBtn.addEventListener("click", ()=>openModal());
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
statusFilter.addEventListener("change", renderGoals);
sortFilter.addEventListener("change", renderGoals);

renderGoals();
