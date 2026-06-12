```markdown
# Finance Tracker

**Finance Tracker** is a web application for managing personal finances — income, expenses, categories, and reports. Built with ASP.NET Core 9 and vanilla HTML/CSS/JS.

> Track your money, organize transactions by categories, and view your balance — all with JWT authentication.

---

## Features

### Authentication
- User registration with email and password
- JWT-based authentication
- Password hashing with BCrypt
- Protected routes (profile, categories, transactions)

### Categories
- Create income and expense categories
- Each user has their own categories
- Delete categories you don't need

### Transactions
- Add income/expense transactions
- Select category for each transaction
- Set amount, date, and optional comment
- Delete transactions
- Filter by date range

### User Profile
- View your email, username, and registration date

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/users/profile` | Get user profile |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| DELETE | `/api/categories/{id}` | Delete category |
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Add transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |

---

## 🛠️ Tech Stack

- **Backend**: ASP.NET Core Web API (.NET 9)
- **ORM**: Entity Framework Core
- **Database**: MySQL
- **Auth**: JWT + BCrypt
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Server**: Kestrel (backend) + http-server (frontend)

---

## 🚀 Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Node.js](https://nodejs.org/) (for frontend server)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EGRSkrut1/Finance_Tracker.git
   cd Finance_Tracker
   ```

2. Create database:
   ```sql
   CREATE DATABASE finance_tracker;
   ```

3. Copy `Backend/appsettings.example.json` → `Backend/appsettings.json` and set your MySQL password.

4. Run the project:
   ```cmd
   start.bat
   ```

5. Open browser:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5078

### Manual start

**Terminal 1 (backend):**
```cmd
cd Backend
dotnet run
```

**Terminal 2 (frontend):**
```cmd
cd Frontend
npx http-server -p 3000
```

---

## Project Structure

```
Finance_Tracker/
├── Backend/
│   ├── src/
│   │   ├── API/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.cs
│   │   │   │   ├── UsersController.cs
│   │   │   │   ├── CategoriesController.cs
│   │   │   │   └── TransactionsController.cs
│   │   │   └── Models/
│   │   │       ├── User.cs
│   │   │       ├── Category.cs
│   │   │       └── Transaction.cs
│   │   ├── Database/
│   │   │   └── AppDbContext.cs
│   │   └── Security/
│   │       ├── JwtService.cs
│   │       ├── PasswordService.cs
│   │       └── ValidationService.cs
│   ├── appsettings.json
│   ├── appsettings.example.json
│   ├── Program.cs
│   └── FinanceTracker.csproj
├── Frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── start.bat
├── stop.bat
└── README.md
```
```
## 📄 License

MIT
```
