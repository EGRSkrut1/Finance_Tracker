const LOG_API_URL = 'http://localhost:5078/api/logs';

window.logToFile = async function(message, data = null) {
    try {
        const logEntry = {
            message: message,
            data: data ? JSON.stringify(data, null, 2) : null
        };
        await fetch(LOG_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logEntry)
        });
    } catch (e) {
        console.error('Log error:', e);
    }
};

window.clearLog = async function() {
    try {
        await fetch(LOG_API_URL, { method: 'DELETE' });
        console.log('Log cleared');
    } catch (e) {
        console.error('Clear log error:', e);
    }
};

window.getLog = async function() {
    try {
        const res = await fetch(LOG_API_URL);
        const data = await res.json();
        return data.content || 'Лог пуст';
    } catch (e) {
        console.error('Get log error:', e);
        return 'Ошибка получения лога';
    }
};

console.log(' Logger ready');