let transactions = [];
let expenseChart;

// ADD
async function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;

  if (!desc || isNaN(amount) || !date) {
    alert("Fill all fields");
    return;
  }

  await fetch("http://localhost:5000/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ desc, amount, type, date })
  });

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";

  loadTransactions();
}

// LOAD
async function loadTransactions() {
  const res = await fetch("http://localhost:5000/all");
  transactions = await res.json();

  displayTransactions();
}

// DELETE
async function deleteTransaction(index) {
  await fetch("http://localhost:5000/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ index })
  });

  loadTransactions();
}

// DISPLAY
function displayTransactions() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let balance = 0;
  let income = 0;
  let expense = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${t.desc} (₹${t.amount})</span>
      <button onclick="deleteTransaction(${index})">🗑</button>
    `;

    list.appendChild(li);

    if (t.type === "income") {
      income += t.amount;
      balance += t.amount;
    } else {
      expense += t.amount;
      balance -= t.amount;
    }
  });

  document.getElementById("balance").innerText = `₹${balance}`;
  document.getElementById("income").innerText = `₹${income}`;
  document.getElementById("expense").innerText = `₹${expense}`;

  renderChart();
}

// 📊 MONTHLY EXPENSE GRAPH (ONLY EXPENSES)
function renderChart() {
  const monthlyExpense = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      const month = t.date.substring(0, 7);

      monthlyExpense[month] = (monthlyExpense[month] || 0) + t.amount;
    }
  });

  const months = Object.keys(monthlyExpense).sort();
  const data = months.map(m => monthlyExpense[m]);

  if (expenseChart) expenseChart.destroy();

  const ctx = document.getElementById("expenseChart").getContext("2d");

  expenseChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Total Monthly Expense",
          data: data,
          backgroundColor: "#ef4444"
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "white" }
        }
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } }
      }
    }
  });
}

window.onload = loadTransactions;