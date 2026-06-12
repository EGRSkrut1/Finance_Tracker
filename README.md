```markdown
# Finance Tracker

## Install dependencies

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Node.js](https://nodejs.org/)

## Database setup

1. Start MySQL
2. Create database:
```sql
CREATE DATABASE finance_tracker;
```
3. Copy `Backend/appsettings.example.json` → `Backend/appsettings.json`
4. Set your MySQL password in `appsettings.json`

## Run

```cmd
start.bat
```

Backend: http://localhost:5000
Frontend: http://localhost:3000

## API

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/users/profile` | Profile |
| GET | `/api/categories` | Categories |
| POST | `/api/categories` | Create category |
| GET | `/api/transactions` | Transactions |
| POST | `/api/transactions` | Add transaction |
```