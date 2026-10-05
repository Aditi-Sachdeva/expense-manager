
const EMAILJS_SERVICE_ID = "service_z8ro96r";
const EMAILJS_TEMPLATE_ID = "template_0qzon5j";
const EMAILJS_PUBLIC_KEY = "PTpYjZvXJfJLf557A";

if (typeof emailjs !== "undefined") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

let alertSettings = loadData("alertSettings");

if (Array.isArray(alertSettings)) {
  alertSettings = { enabled: false, email: "" };
}

let alertLog = loadData("alertLog");

function saveSettings() {
  saveData("alertSettings", alertSettings);
}

function saveLog() {
  saveData("alertLog", alertLog);
}

function calcSpent(transactions, category, month) {
  return transactions.filter(
    t =>
      t.type === "expense" &&
      t.category === category &&
      t.date.startsWith(month)
  )
    .reduce((sum, t) => sum + t.amount, 0);
}

function getAlertInfo(a) {

  const left = formatMoney(a.budget - a.spent);
  const over = formatMoney(a.spent - a.budget);

  if (a.level === 100) {
    return {
      name: "Red Alert",
      color: "#d32f2f",
      message: `Your ${a.category} budget for ${a.month} is finished. You have gone over it by ${over}.`
    };
  }

  if (a.level === 80) {
    return {
      name: "Yellow Alert",
      color: "#e69500",
      message: `Your ${a.category} budget for ${a.month} is almost finished. Only ${left} is left.`
    };
  }

  return {
    name: "Green Alert",
    color: "#2e7d32",
    message: `You have used half of your ${a.category} budget for ${a.month}. ${left} is still left.`
  };
}

function checkAlerts() {

  const budgets = loadData("budgets");
  const transactions = loadData("transactions");
  const alerts = [];

  const now = new Date();
  const currentMonth = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

  budgets
    .filter(b => b.month === currentMonth)
    .forEach(b => {

      const spent = calcSpent(transactions, b.category, b.month);
      const percent = (spent / b.amount) * 100;

      let level = 0;

      if (percent >= 100) {
        level = 100;
      } else if (percent >= 80) {
        level = 80;
      } else if (percent >= 50) {
        level = 50;
      }

      if (level > 0) {
        alerts.push({
          category: b.category,
          month: b.month,
          spent,
          budget: b.amount,
          level
        });
      }
    });

  showAlerts(alerts);
  showStats(alerts);
  sendEmails(alerts);
}

function showAlerts(alerts) {

  const list = document.getElementById("activeAlertsList");

  if (alerts.length === 0) {
    list.innerHTML = `<p class="empty-inline">No active alerts. Your spending is within budget.</p>`;
    return;
  }

  list.innerHTML = "";

  alerts.forEach(a => {
    const info = getAlertInfo(a);
    const percent = ((a.spent / a.budget) * 100).toFixed(1);

    list.innerHTML += `
      <div class="alert-row">
        <div class="alert-info">
          <strong>${a.category}</strong>
          <p>${a.month} — ${formatMoney(a.spent)} of ${formatMoney(a.budget)} (${percent}%)</p>
        </div>
        <span class="badge" style="background:${info.color}; color:#fff;">${info.name}</span>
      </div>
    `;
  });
}

function showStats(alerts) {

  document.getElementById("halfwayCount").textContent = alerts.filter(a => a.level === 50).length;

  document.getElementById("nearLimitCount").textContent = alerts.filter(a => a.level === 80).length;

  document.getElementById("exceededCount").textContent = alerts.filter(a => a.level === 100).length;

  document.getElementById("emailsSentCount").textContent = alertLog.length;

}

function sendEmails(alerts) {
  if (!alertSettings.enabled || !alertSettings.email) {
    return;
  }
  if (typeof emailjs === "undefined") {
    return;
  }

  alerts.forEach(a => {
    const alreadySent = alertLog.some(
      log =>
        log.category === a.category &&
        log.month === a.month &&
        log.level === a.level
    );

    if (alreadySent) return;

    alertLog.push({
      date: new Date().toLocaleString(),
      category: a.category,
      month: a.month,
      level: a.level,
      emailSent: true
    });

    saveLog();

    const info = getAlertInfo(a);

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: alertSettings.email,
        subject_line: `${info.name}: ${a.category} (${a.month})`,
        title: info.name,
        color: info.color,
        message: info.message
      })
      .then(() => {
        showLog();
        document.getElementById("emailsSentCount").textContent =
          alertLog.length;
      })
      .catch(err => {
        console.error("Email failed:", err);

        alertLog = alertLog.filter(
          log =>
            !(
              log.category === a.category &&
              log.month === a.month &&
              log.level === a.level
            )
        );

        saveLog();
      });
  });
}

function showLog() {

  const tbody = document.getElementById("alertLogTableBody");
  const emptyMsg = document.getElementById("emptyLogMessage");

  tbody.innerHTML = "";

  if (alertLog.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  alertLog
    .slice()
    .reverse()
    .forEach(entry => {
      tbody.innerHTML += `
        <tr>
          <td>${entry.date}</td>
          <td>${entry.category}</td>
          <td>${entry.month}</td>
          <td>${entry.level}%</td>
          <td>${entry.emailSent ? "Yes" : "No"}</td>
        </tr>
      `;
    });
}

document.getElementById("settingsForm").addEventListener("submit", e => {

  e.preventDefault();

  const enabled = document.getElementById("emailEnabled").checked;
  const email = document
    .getElementById("recipientEmail")
    .value
    .trim();

  if (enabled && !email) {
    alert("Please enter an email address to receive alerts.");
    return;
  }

  alertSettings.enabled = enabled;
  alertSettings.email = email;

  saveSettings();

  alert("Settings saved.");

  checkAlerts();
});

document.getElementById("clearLogBtn").addEventListener("click", () => {
  if (
    confirm(
      "Clearing history will re-send emails for all current alerts. Continue?"
    )
  ) {
    alertLog = [];

    saveLog();
    showLog();
    checkAlerts();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("emailEnabled").checked = alertSettings.enabled;

  document.getElementById("recipientEmail").value = alertSettings.email;

  checkAlerts();
  showLog();
});
