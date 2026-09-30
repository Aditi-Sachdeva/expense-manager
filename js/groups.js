
const groupsList = document.getElementById("groupsList");
const groupDetails = document.getElementById("groupDetails");

const groupModal = document.getElementById("groupModal");
const groupForm = document.getElementById("groupForm");
const groupNameInput = document.getElementById("groupName");
const groupModalTitle = document.getElementById("groupModalTitle");
const closeGroupModalBtn = document.getElementById("closeGroupModalBtn");
const cancelGroupBtn = document.getElementById("cancelGroupBtn");

const memberModal = document.getElementById("memberModal");
const memberForm = document.getElementById("memberForm");
const memberNameInput = document.getElementById("memberName");
const closeMemberModalBtn = document.getElementById("closeMemberModalBtn");
const cancelMemberBtn = document.getElementById("cancelMemberBtn");

const expenseModal = document.getElementById("expenseModal");
const expenseForm = document.getElementById("expenseForm");
const expenseDescription = document.getElementById("expenseDescription");
const expenseAmount = document.getElementById("expenseAmount");
const expensePaidBy = document.getElementById("expensePaidBy");
const expenseDate = document.getElementById("expenseDate");
const splitType = document.getElementById("splitType");
const splitDetails = document.getElementById("splitDetails");
const expenseModalTitle = document.getElementById("expenseModalTitle");
const closeExpenseModalBtn = document.getElementById("closeExpenseModalBtn");
const cancelExpenseBtn = document.getElementById("cancelExpenseBtn");

const settleModal = document.getElementById("settleModal");
const settleForm = document.getElementById("settleForm");
const settleFrom = document.getElementById("settleFrom");
const settleTo = document.getElementById("settleTo");
const settleAmount = document.getElementById("settleAmount");
const settleDate = document.getElementById("settleDate");
const closeSettleModalBtn = document.getElementById("closeSettleModalBtn");
const cancelSettleBtn = document.getElementById("cancelSettleBtn");

let groups = loadData("groups") || [];
let selectedGroupIndex = null;
let editingExpenseIndex = null;

function saveAll() {
    saveData("groups", groups);
}

function openModal(modal) {
    modal.classList.remove("hidden");
}

function closeModal(modal) {
    modal.classList.add("hidden");
}

function renderGroupsList() {
    groupsList.innerHTML = "";

    if (groups.length === 0) {
        groupsList.innerHTML = `
            <div class="empty empty-big">
                <h4>No groups yet</h4>
                <p>Create your first group to start splitting expenses.</p>
                <button class="btn btn-primary btn-small" id="createGroupBtn">
                    + Create Group
                </button>
            </div>
        `;

        document.getElementById("createGroupBtn").onclick = () => openGroupModal();
        return;
    }

    groups.forEach((g, i) => {
        const div = document.createElement("div");

        div.className = "group-item" + (i === selectedGroupIndex ? " active" : "");

        div.innerHTML = `
            <h4>${g.name}</h4>
            <p>${g.members.length} members</p>
        `;

        div.onclick = () => {
            selectedGroupIndex = i;
            renderGroupDetails();
            renderGroupsList();
        };

        groupsList.appendChild(div);
    });
}

function renderGroupDetails() {
    if (selectedGroupIndex === null || !groups[selectedGroupIndex]) {
        groupDetails.innerHTML = `
            <div class="empty empty-big">
                <h4>No group selected</h4>
                <p>Select a group from the left panel or create a new one.</p>
                <button class="btn btn-primary btn-small" id="createFirstGroupBtn">
                    + Create Group
                </button>
            </div>
        `;

        document.getElementById("createFirstGroupBtn").onclick = () => openGroupModal();
        return;
    }

    const g = groups[selectedGroupIndex];
    let html = "";

    html += `
        <div class="group-header">
            <h2>${g.name}</h2>
            <button class="btn btn-small btn-danger"
                    onclick="deleteGroup(${selectedGroupIndex})">
                Delete Group
            </button>
        </div>
    `;

    html += `
        <div class="group-section">
            <div class="section-header">
                <div class="section-label">Members</div>
                <button class="btn btn-small btn-primary"
                        onclick="openMemberModal()">
                    + Add Member
                </button>
            </div>
    `;

    if (g.members.length === 0) {
        html += `
            <p class="empty-inline">
                No members yet. Add members to start splitting expenses.
            </p>
        `;
    } else {
        g.members.forEach(m => {
            html += `
                <span class="member-chip">
                    ${m}
                    <button onclick="removeMember('${m}')">&times;</button>
                </span>
            `;
        });
    }

    html += `</div>`;

    html += `
        <div class="group-section">
            <div class="section-header">
                <div class="section-label">Expenses</div>
                <button class="btn btn-small btn-primary"
                        onclick="openExpenseModal()">
                    + Add Expense
                </button>
            </div>
    `;

    if (g.expenses.length === 0) {
        html += `<p class="empty-inline">No expenses yet.</p>`;
    } else {
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Paid By</th>
                        <th>Amount</th>
                        <th>Split</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        g.expenses.forEach((ex, i) => {
            html += `
                <tr>
                    <td>${ex.description}</td>
                    <td>${ex.paidBy}</td>
                    <td>₹${ex.amount.toFixed(2)}</td>
                    <td>${ex.splitType}</td>
                    <td>${ex.date}</td>
                    <td>
                        <button class="btn btn-small"
                                onclick="editExpense(${i})">
                            Edit
                        </button>
                        <button class="btn btn-small btn-danger"
                                onclick="deleteExpense(${i})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;
    }

    html += `</div>`;

    const balances = calculateBalances(g);

    html += `
        <div class="group-section">
            <div class="section-label">Balances</div>
    `;

    balances.forEach(b => {
        html += `
            <div class="balance-row">
                <span>${b.member}</span>
                <span class="balance-amount">
                    ₹${b.balance.toFixed(2)}
                </span>
            </div>
        `;
    });

    html += `</div>`;

    const simplified = simplifyDebts(balances);

    if (simplified.length > 0) {
        html += `
            <div class="group-section">
                <div class="section-label">Simplified Settlements</div>
        `;

        simplified.forEach(s => {
            html += `
                <div class="balance-row">
                    <span>${s.from} owes ${s.to}</span>
                    <span class="balance-amount">
                        ₹${s.amount.toFixed(2)}
                    </span>
                </div>
            `;
        });

        html += `</div>`;
    }

    html += `
        <div class="group-section">
            <div class="section-header">
                <div class="section-label">Settlement History</div>
                <button class="btn btn-small btn-primary"
                        onclick="openSettleModal()">
                    Settle Up
                </button>
            </div>
    `;

    if (g.settlements.length === 0) {
        html += `
            <p class="empty-inline">
                No settlements recorded yet.
            </p>
        `;
    } else {
        g.settlements.forEach((s, i) => {
            html += `
                <div class="balance-row">
                    <span>${s.from} paid ${s.to} on ${s.date}</span>
                    <span class="balance-amount">
                        ₹${s.amount.toFixed(2)}
                        <button class="btn btn-small btn-danger"
                                onclick="deleteSettlement(${i})">
                            Delete
                        </button>
                    </span>
                </div>
            `;
        });
    }

    html += `</div>`;

    groupDetails.innerHTML = html;
}

function openGroupModal() {
    groupForm.reset();
    groupModalTitle.textContent = "New Group";
    openModal(groupModal);
}

groupForm.onsubmit = e => {
    e.preventDefault();

    groups.push({
        name: groupNameInput.value.trim(),
        members: [],
        expenses: [],
        settlements: []
    });

    selectedGroupIndex = groups.length - 1;

    saveAll();

    closeModal(groupModal);

    renderGroupsList();
    renderGroupDetails();
};

closeGroupModalBtn.onclick = () => closeModal(groupModal);
cancelGroupBtn.onclick = () => closeModal(groupModal);

function deleteGroup(i) {
    if (!confirm("Delete this group and everything in it? This cannot be undone.")) {
        return;
    }

    groups.splice(i, 1);

    if (i === selectedGroupIndex) {
        selectedGroupIndex = null;
    } else if (selectedGroupIndex !== null && i < selectedGroupIndex) {
        selectedGroupIndex--;
    }

    saveAll();

    renderGroupsList();
    renderGroupDetails();
}

function openMemberModal() {
    memberForm.reset();
    openModal(memberModal);
}

memberForm.onsubmit = e => {
    e.preventDefault();

    const g = groups[selectedGroupIndex];
    const name = memberNameInput.value.trim();

    if (g.members.includes(name)) {
        alert("This member already exists.");
        return;
    }

    g.members.push(name);

    saveAll();

    closeModal(memberModal);

    renderGroupsList();
    renderGroupDetails();
};

closeMemberModalBtn.onclick = () => closeModal(memberModal);
cancelMemberBtn.onclick = () => closeModal(memberModal);

function removeMember(name) {
    const g = groups[selectedGroupIndex];

    if (g.expenses.length > 0 || g.settlements.length > 0) {
        alert("Cannot remove members once expenses/settlements exist.");
        return;
    }

    if (!confirm(`Remove ${name} from this group?`)) {
        return;
    }

    g.members = g.members.filter(m => m !== name);

    saveAll();

    renderGroupsList();
    renderGroupDetails();
}

function openExpenseModal() {
    const g = groups[selectedGroupIndex];

    if (g.members.length < 2) {
        alert("Add at least 2 members before adding an expense.");
        return;
    }

    expenseForm.reset();

    editingExpenseIndex = null;

    expenseModalTitle.textContent = "Add Group Expense";

    fillMembersDropdown(expensePaidBy);

    splitType.value = "equal";

    updateSplitDetails();

    openModal(expenseModal);
}

splitType.onchange = updateSplitDetails;
expenseAmount.oninput = updateSplitDetails;

function fillMembersDropdown(select) {
    select.innerHTML = "";

    groups[selectedGroupIndex].members.forEach(m => {
        const opt = document.createElement("option");

        opt.value = m;
        opt.textContent = m;

        select.appendChild(opt);
    });
}

function updateSplitDetails() {
    const g = groups[selectedGroupIndex];

    splitDetails.innerHTML = "";

    const amt = parseFloat(expenseAmount.value) || 0;

    if (splitType.value === "equal") {

        if (g.members.length > 0) {
            const share = amt / g.members.length;

            splitDetails.innerHTML = `
                <p class="empty-inline">
                    Each pays ₹${share.toFixed(2)}
                </p>
            `;
        }

    } else if (splitType.value === "exact") {

        g.members.forEach(m => {
            splitDetails.innerHTML += `
                <div class="split-row">
                    <span>${m}</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        data-member="${m}"
                        placeholder="₹0.00"
                    >
                </div>
            `;
        });

    } else if (splitType.value === "percentage") {

        g.members.forEach(m => {
            splitDetails.innerHTML += `
                <div class="split-row">
                    <span>${m}</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        data-member="${m}"
                        placeholder="%"
                    >
                </div>
            `;
        });
    }
}

expenseForm.onsubmit = e => {
    e.preventDefault();

    const g = groups[selectedGroupIndex];
    const amt = parseFloat(expenseAmount.value);

    const splits = {};

    if (splitType.value === "equal") {

        const share = amt / g.members.length;

        g.members.forEach(m => {
            splits[m] = share;
        });

    } else if (splitType.value === "exact") {

        let sum = 0;

        splitDetails.querySelectorAll("input").forEach(inp => {
            const val = parseFloat(inp.value) || 0;

            splits[inp.dataset.member] = val;
            sum += val;
        });

        if (Math.abs(sum - amt) > 0.01) {
            alert("Exact shares must equal total amount.");
            return;
        }

    } else if (splitType.value === "percentage") {

        let sum = 0;

        splitDetails.querySelectorAll("input").forEach(inp => {
            const val = parseFloat(inp.value) || 0;

            splits[inp.dataset.member] = (val / 100) * amt;
            sum += val;
        });

        if (Math.abs(sum - 100) > 0.01) {
            alert("Percentages must equal 100.");
            return;
        }
    }

    const newExpense = {
        description: expenseDescription.value.trim(),
        amount: amt,
        paidBy: expensePaidBy.value,
        date: expenseDate.value,
        splitType: splitType.value,
        splits: splits
    };

    if (editingExpenseIndex !== null) {
        g.expenses[editingExpenseIndex] = newExpense;
        editingExpenseIndex = null;
    } else {
        g.expenses.push(newExpense);
    }

    saveAll();

    closeModal(expenseModal);

    renderGroupDetails();
};

closeExpenseModalBtn.onclick = () => closeModal(expenseModal);
cancelExpenseBtn.onclick = () => closeModal(expenseModal);

function editExpense(i) {
    const g = groups[selectedGroupIndex];
    const ex = g.expenses[i];

    editingExpenseIndex = i;

    fillMembersDropdown(expensePaidBy);

    expenseDescription.value = ex.description;
    expenseAmount.value = ex.amount;
    expensePaidBy.value = ex.paidBy;
    expenseDate.value = ex.date;
    splitType.value = ex.splitType;

    updateSplitDetails();

    if (ex.splitType !== "equal") {
        splitDetails.querySelectorAll("input").forEach(inp => {
            inp.value = ex.splitType === "exact"
                ? ex.splits[inp.dataset.member]
                : (ex.splits[inp.dataset.member] / ex.amount * 100);
        });
    }

    expenseModalTitle.textContent = "Edit Expense";

    openModal(expenseModal);
}

function deleteExpense(i) {
    if (!confirm("Delete this expense?")) {
        return;
    }

    groups[selectedGroupIndex].expenses.splice(i, 1);

    saveAll();

    renderGroupDetails();
}

function calculateBalances(g) {
    const balances = {};

    g.members.forEach(m => {
        balances[m] = 0;
    });

    g.expenses.forEach(ex => {
        balances[ex.paidBy] += ex.amount;

        for (const m in ex.splits) {
            balances[m] -= ex.splits[m];
        }
    });

    g.settlements.forEach(s => {
        balances[s.from] += s.amount;
        balances[s.to] -= s.amount;
    });

    return g.members.map(m => ({
        member: m,
        balance: balances[m]
    }));
}

function simplifyDebts(balances) {
    const creditors = balances
        .filter(b => b.balance > 0)
        .map(b => ({ ...b }));

    const debtors = balances
        .filter(b => b.balance < 0)
        .map(b => ({ ...b }));

    const result = [];

    creditors.sort((a, b) => b.balance - a.balance);
    debtors.sort((a, b) => a.balance - b.balance);

    while (creditors.length && debtors.length) {
        const c = creditors[0];
        const d = debtors[0];

        const amt = Math.min(c.balance, -d.balance);

        result.push({
            from: d.member,
            to: c.member,
            amount: amt
        });

        c.balance -= amt;
        d.balance += amt;

        if (c.balance < 0.01) {
            creditors.shift();
        }

        if (d.balance > -0.01) {
            debtors.shift();
        }
    }

    return result;
}

function openSettleModal() {
    const g = groups[selectedGroupIndex];

    if (g.members.length < 2) {
        alert("You need at least 2 members to record a settlement.");
        return;
    }

    settleForm.reset();

    fillMembersDropdown(settleFrom);
    fillMembersDropdown(settleTo);

    openModal(settleModal);
}

settleForm.onsubmit = e => {
    e.preventDefault();

    const g = groups[selectedGroupIndex];

    if (settleFrom.value === settleTo.value) {
        alert("From and To members must be different.");
        return;
    }

    g.settlements.push({
        from: settleFrom.value,
        to: settleTo.value,
        amount: parseFloat(settleAmount.value),
        date: settleDate.value
    });

    saveAll();

    closeModal(settleModal);

    renderGroupDetails();
};

closeSettleModalBtn.onclick = () => closeModal(settleModal);
cancelSettleBtn.onclick = () => closeModal(settleModal);

function deleteSettlement(i) {
    if (!confirm("Remove this settlement? (in case it was recorded by mistake)")) {
        return;
    }

    groups[selectedGroupIndex].settlements.splice(i, 1);

    saveAll();

    renderGroupDetails();
}

document.getElementById("newGroupBtn").onclick = () => openGroupModal();

renderGroupsList();
renderGroupDetails();

