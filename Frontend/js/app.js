const API_URL = 'http://localhost:5078/api';

function showDashboard() {
  window.location.href = 'dashboard.html';
}

document.getElementById('btn-switch-auth').addEventListener('click', function() {
  const form = document.querySelector('.registration-form');
  const btn = document.getElementById('btn-submit');
  const usernameField = document.getElementById('reg-username');
  const label = document.querySelector('.form-label:first-child');
  const errorEl = document.getElementById('register-error');
  errorEl.textContent = '';
  
  if (form.dataset.mode === 'login') {
    form.dataset.mode = 'register';
    btn.textContent = 'вступить в клуб';
    usernameField.style.display = 'block';
    label.textContent = 'имя пользователя';
    this.textContent = 'уже есть аккаунт? войти';
  } else {
    form.dataset.mode = 'login';
    btn.textContent = 'войти';
    usernameField.style.display = 'none';
    label.textContent = 'email';
    this.textContent = 'создать аккаунт';
  }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const mode = form.dataset.mode || 'register';
  const errorEl = document.getElementById('register-error');
  errorEl.textContent = '';
  errorEl.style.color = '#ff0000';

  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  if (mode === 'login') {
    if (!email || !password) {
      errorEl.textContent = 'Заполните email и пароль';
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        showDashboard();
        return;
      }
      errorEl.textContent = data.error || 'Неверный email или пароль';
    } catch (err) {
      errorEl.textContent = 'Ошибка соединения с сервером';
    }
    return;
  }

  const username = document.getElementById('reg-username').value.trim();

  if (!username || !email || !password) {
    errorEl.textContent = 'Заполните все поля';
    return;
  }

  try {
    const checkRes = await fetch(`${API_URL}/auth/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const checkData = await checkRes.json();

    if (checkData.exists) {
      errorEl.textContent = 'Вход...';
      errorEl.style.color = '#2ecc71';

      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();

      if (loginData.success) {
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('username', loginData.user.username);
        localStorage.setItem('userId', loginData.user.id);
        showDashboard();
        return;
      } else {
        errorEl.style.color = '#ff0000';
        errorEl.textContent = 'Пользователь существует, но пароль неверный';
        return;
      }
    }

    errorEl.textContent = 'Регистрация...';
    errorEl.style.color = '#2ecc71';

    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const regData = await regRes.json();
    
    if (regData.success) {
      localStorage.setItem('token', regData.token);
      localStorage.setItem('username', regData.user.username);
      localStorage.setItem('userId', regData.user.id);
      showDashboard();
      return;
    }
    errorEl.textContent = regData.error || 'Ошибка регистрации';
  } catch (err) {
    errorEl.textContent = 'Ошибка соединения с сервером';
  }
});

(async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        showDashboard();
      }
    }
  } catch (e) {}
})();