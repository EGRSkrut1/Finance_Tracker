const API_URL = 'http://localhost:5078/api';

let authToken = localStorage.getItem('token');

if (authToken && window.location.pathname.includes('dashboard.html')) {
    loadDashboard();
} else if (authToken && !window.location.pathname.includes('dashboard.html')) {
    window.location.href = 'dashboard.html';
} else if (!authToken && window.location.pathname.includes('dashboard.html')) {
    window.location.href = 'index.html';
}

function showTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('register-error').textContent = data.error || 'Ошибка регистрации';
        }
    } catch (error) {
        document.getElementById('register-error').textContent = 'Ошибка соединения с сервером';
    }
}

// Логин
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('login-error').textContent = data.error || 'Ошибка входа';
        }
    } catch (error) {
        document.getElementById('login-error').textContent = 'Ошибка соединения с сервером';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

async function loadDashboard() {
    const token = localStorage.getItem('token');
    
    try {
        const profileResponse = await fetch(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const profile = await profileResponse.json();
        
        if (profile.success) {
            document.getElementById('username').textContent = profile.user.username;
        }
        
        
    } catch (error) {
        console.error('Ошибка загрузки дашборда:', error);
    }
}

function addTransaction() {
    alert('API транзакций ещё в разработке. Ждите обновления!');
}