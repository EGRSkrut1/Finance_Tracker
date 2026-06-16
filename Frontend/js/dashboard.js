const API_URL = 'http://localhost:5078/api';
const MONTHS_RU = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

let transactions = [];
let chartInstance = null;
let allCategories = [];

async function initDashboard() {
  console.log('=== Dashboard init ===');
  
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  const username = localStorage.getItem('username') || 'user';
  document.getElementById('dash-username').textContent = username;
  
  await loadCategories();
  await loadTransactions();
  
  document.getElementById('tx-date').valueAsDate = new Date();
  document.getElementById('tx-category').onchange = fillTypeSelect;
  document.getElementById('transaction-form').onsubmit = onSubmit;
  fillTypeSelect();
  renderAll();
}

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  window.location.href = 'index.html';
});

async function loadCategories() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/categories`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load categories');
    allCategories = await res.json();
    console.log('Categories loaded:', allCategories.length);
    
    if (allCategories.length === 0) {
      await seedDefaultCategories();
      await loadCategories();
    }
  } catch (e) {
    console.error('loadCategories error:', e);
    allCategories = [
      { id: 1, name: 'Зарплата', type: 'income' },
      { id: 2, name: 'Фриланс', type: 'income' },
      { id: 3, name: 'Подарки', type: 'income' },
      { id: 4, name: 'Продукты', type: 'expense' },
      { id: 5, name: 'Транспорт', type: 'expense' },
      { id: 6, name: 'Развлечения', type: 'expense' }
    ];
  }
}

async function seedDefaultCategories() {
  const defaults = [
    { name: 'Зарплата', type: 'income' },
    { name: 'Фриланс', type: 'income' },
    { name: 'Подарки', type: 'income' },
    { name: 'Продукты', type: 'expense' },
    { name: 'Транспорт', type: 'expense' },
    { name: 'Развлечения', type: 'expense' }
  ];
  const token = localStorage.getItem('token');
  for (const cat of defaults) {
    await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cat)
    });
  }
  console.log('Categories seeded');
}

async function loadTransactions() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    transactions = [];
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/transactions/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load transactions');
    transactions = await res.json();
    console.log('Transactions loaded:', transactions.length);
  } catch (e) {
    console.error('loadTransactions error:', e);
    transactions = [];
  }
}

async function saveTransaction(tx) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(tx)
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return await res.json();
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
    if (tx.type === 'income') income += tx.amount;
    if (tx.type === 'expense') expense += tx.amount;
  });
  document.getElementById('stat-income').textContent = formatMoney(income);
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
    if (tx.type === 'income') monthly[key].income += tx.amount;
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
      labels: sorted.length ? sorted.map(m => MONTHS_RU[m.month]) : ['Нет данных'],
      datasets: [
        { label: 'Доходы', data: sorted.length ? sorted.map(m => m.income) : [0], backgroundColor: '#2ecc71', borderRadius: 4 },
        { label: 'Расходы', data: sorted.length ? sorted.map(m => m.expense) : [0], backgroundColor: '#e74c3c', borderRadius: 4 }
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
      <td>${tx.description || ''}</td>
      <td>${isIncome ? 'Доход' : 'Расход'}</td>
      <td><span class="badge badge--${tx.type}">${getCategoryName(tx.categoryId)}</span></td>
      <td class="amount--${tx.type}">${isIncome ? '+' : '−'} ${formatNumber(tx.amount)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fillTypeSelect() {
  const type = document.getElementById('tx-category').value;
  const select = document.getElementById('tx-type');
  select.innerHTML = '<option value="">— выберите тип —</option>';
  allCategories.filter(c => c.type === type).forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

function getCategoryName(id) {
  const cat = allCategories.find(c => c.id === id);
  return cat ? cat.name : '—';
}

async function onSubmit(e) {
  e.preventDefault();
  document.getElementById('form-error').textContent = '';

  const categoryId = Number(document.getElementById('tx-type').value);
  if (!categoryId) {
    document.getElementById('form-error').textContent = 'Выберите категорию';
    return;
  }

  const userId = Number(localStorage.getItem('userId'));
  if (!userId) {
    document.getElementById('form-error').textContent = 'Ошибка: пользователь не авторизован';
    return;
  }

  const tx = {
    userId: userId,
    categoryId: categoryId,
    amount: Number(document.getElementById('tx-amount').value),
    description: document.getElementById('tx-description').value.trim() || 'Без описания',
    date: new Date(document.getElementById('tx-date').value + 'T00:00:00').toISOString(),
    type: document.getElementById('tx-category').value
  };

  try {
    const saved = await saveTransaction(tx);
    transactions.unshift(saved);
    renderAll();
    document.getElementById('transaction-form').reset();
    document.getElementById('tx-date').valueAsDate = new Date();
    fillTypeSelect();
  } catch (err) {
    document.getElementById('form-error').textContent = 'Ошибка сохранения: ' + err.message;
  }
}

function formatMoney(n) {
  return '₽ ' + formatNumber(n ?? 0);
}

function formatNumber(n) {
  return Number(n).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').replace('.', ',');
}

initDashboard();