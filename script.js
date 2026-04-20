let expenses = [];
let chart;

// Load
window.onload = function () {
  let data = localStorage.getItem("expenses");
  if (data) {
    expenses = JSON.parse(data);
    displayExpenses(expenses);
  }

  let savedTheme = localStorage.getItem("theme");
  let btn = document.querySelector(".theme-btn");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    btn.innerText = "☀️";
  }
};

// Add
function addExpense() {
  let desc = document.getElementById("desc").value;
  let amount = document.getElementById("amount").value;
  let category = document.getElementById("category").value;

  if (desc === "" || amount === "") {
    alert("Fill all fields");
    return;
  }

  let expense = {
    desc,
    amount: Number(amount),
    category,
  };

  expenses.push(expense);
  saveData();
  displayExpenses(expenses);

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

// Display
function displayExpenses(data) {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let total = 0;

  data.forEach((item, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      ${item.desc} - ₹${item.amount} (${item.category})
      <div>
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </div>
    `;

    list.appendChild(li);
    total += item.amount;
  });

  document.getElementById("total").innerText = total;

  document.getElementById("emptyMsg").style.display =
    data.length === 0 ? "block" : "none";

  renderChart();
}

// Delete
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveData();
  displayExpenses(expenses);
}

// Edit
function editExpense(index) {
  let item = expenses[index];

  document.getElementById("desc").value = item.desc;
  document.getElementById("amount").value = item.amount;
  document.getElementById("category").value = item.category;

  expenses.splice(index, 1);
  saveData();
  displayExpenses(expenses);
}

// Filter
function filterExpenses() {
  let selected = document.getElementById("filter").value;

  let filtered = expenses.filter(
    (item) => selected === "All" || item.category === selected,
  );

  displayExpenses(filtered);
}

// Save
function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");

  let isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  document.querySelector(".theme-btn").innerText = isDark ? "☀️" : "🌙";
}

// Chart
function renderChart() {
  let totals = {
    Food: 0,
    Travel: 0,
    Shopping: 0,
  };

  expenses.forEach((item) => {
    totals[item.category] += item.amount;
  });

  let ctx = document.getElementById("expenseChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Food", "Travel", "Shopping"],
      datasets: [
        {
          data: [totals.Food, totals.Travel, totals.Shopping],
          backgroundColor: ["#6366f1", "#22c55e", "#f59e0b"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}
