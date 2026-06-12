@echo off
cd /d "%~dp0"
start "Backend" cmd /k "cd Backend && dotnet run"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd Frontend && npx http-server -p 3000"
timeout /t 2 /nobreak >nul
start http://localhost:3000
echo Backend: http://localhost:5078
echo Frontend: http://localhost:3000
pause