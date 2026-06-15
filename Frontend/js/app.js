const API_URL = 'http://localhost:5078/api';

// убираем старый флаг — из-за него сразу открывался dashboard
localStorage.removeItem('loggedIn');

function showPage(name) {
  document.getElementById('page-landing').classList.toggle('page--active', name === 'landing');
  document.getElementById('page-dashboard').classList.toggle('page--active', name === 'dashboard');
  window.scrollTo(0, 0);
  if (name === 'dashboard' && typeof initDashboard === 'function') {
    initDashboard();
  }
}

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('register-error');
  errorEl.textContent = '';

  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  /* --- REGISTER API (раскомментируй когда починят бэкенд) ---
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('loggedIn', 'true');
      showPage('dashboard');
      return;
    }
    errorEl.textContent = data.error || 'Ошибка регистрации';
    return;
  } catch (err) {
    errorEl.textContent = 'Ошибка соединения с сервером';
    return;
  }
  --- конец API-блока --- */

  sessionStorage.setItem('username', username);
  showPage('dashboard');
});

document.getElementById('btn-logout').addEventListener('click', () => {
  sessionStorage.removeItem('username');
  localStorage.removeItem('token');
  showPage('landing');
});
