const STORAGE_KEY = 'finance_tracker_data';
const MONTHS_RU = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

const categories = [
  { id: 1, name: 'Зарплата',    type: 'income'  },
  { id: 2, name: 'Фриланс',     type: 'income'  },
  { id: 3, name: 'Подарки',     type: 'income'  },
  { id: 4, name: 'Продукты',    type: 'expense' },
  { id: 5, name: 'Транспорт',   type: 'expense' },
  { id: 6, name: 'Развлечения', type: 'expense' }
];

let transactions = [];
let chartInstance = null;

function initDashboard() {
  const username = localStorage.getItem('username') || sessionStorage.getItem('username') || 'user';
  document.getElementById('dash-username').textContent = username;
  loadData();
  document.getElementById('tx-date').valueAsDate = new Date();
  document.getElementById('tx-category').onchange = fillTypeSelect;
  document.getElementById('transaction-form').onsubmit = onSubmit;
  fillTypeSelect();
  renderAll();
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  transactions = saved ? JSON.parse(saved) : [];
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function renderAll() {
  renderStats();
  renderChart();
  renderTable();
}

function renderStats() {
  let income = 0;
  let expense = 0;
  transactions.forEach(tx => {
    if (tx.type === 'income')  income  += tx.amount;
    if (tx.type === 'expense') expense += tx.amount;
  });
  document.getElementById('stat-income').textContent  = formatMoney(income);
  document.getElementById('stat-expense').textContent = formatMoney(expense);
  document.getElementById('stat-balance').textContent = formatMoney(income - expense);
}

function renderChart() {
  const monthly = {};
  transactions.forEach(tx => {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthly[key]) {
      monthly[key] = { month: d.getMonth(), year: d.getFullYear(), income: 0, expense: 0 };
    }
    if (tx.type === 'income')  monthly[key].income  += tx.amount;
    if (tx.type === 'expense') monthly[key].expense += tx.amount;
  });

  const sorted = Object.values(monthly).sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );

  const ctx = document.getElementById('monthlyChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.length ? sorted.map(m => MONTHS_RU[m.month]) : [],
      datasets: [
        { label: 'Доходы',  data: sorted.map(m => m.income),  backgroundColor: '#2ecc71', borderRadius: 4 },
        { label: 'Расходы', data: sorted.map(m => m.expense), backgroundColor: '#e74c3c', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#333' } } },
      scales: {
        x: { ticks: { color: '#333' }, grid: { display: false } },
        y: { ticks: { color: '#333' }, grid: { color: 'rgba(0,0,0,0.06)' }, beginAtZero: true }
      }
    }
  });
}

function renderTable() {
  const tbody = document.getElementById('transactions-body');
  tbody.innerHTML = '';

  if (!transactions.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="opacity:0.5">нет записей</td></tr>';
    return;
  }

  transactions.forEach(tx => {
    const isIncome = tx.type === 'income';
    const d = new Date(tx.date);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.getDate()} ${MONTHS_RU[d.getMonth()]}</td>
      <td>${tx.description}</td>
      <td>${isIncome ? 'Доход' : 'Расход'}</td>
      <td><span class="badge badge--${tx.type}">${getCategoryName(tx.categoryId)}</span></td>
      <td class="amount--${tx.type}">${isIncome ? '+' : '−'} ${formatNumber(tx.amount)}</td>`;
    tbody.appendChild(tr);
  });
}

function fillTypeSelect() {
  const type = document.getElementById('tx-category').value;
  const select = document.getElementById('tx-type');
  select.innerHTML = '<option value="">— выберите тип —</option>';
  categories.filter(c => c.type === type).forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

function getCategoryName(id) {
  const cat = categories.find(c => c.id === id);
  return cat ? cat.name : '—';
}

function onSubmit(e) {
  e.preventDefault();
  document.getElementById('form-error').textContent = '';

  const categoryId = Number(document.getElementById('tx-type').value);
  if (!categoryId) {
    document.getElementById('form-error').textContent = 'Выберите тип';
    return;
  }

  transactions.unshift({
    id: Date.now(),
    date: document.getElementById('tx-date').value + 'T00:00:00',
    description: document.getElementById('tx-description').value.trim(),
    type: document.getElementById('tx-category').value,
    categoryId: categoryId,
    amount: Number(document.getElementById('tx-amount').value)
  });

  saveData();
  document.getElementById('transaction-form').reset();
  document.getElementById('tx-date').valueAsDate = new Date();
  fillTypeSelect();
  renderAll();
}

function formatMoney(n) {
  return '₽ ' + formatNumber(n ?? 0);
}

function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU');
}
