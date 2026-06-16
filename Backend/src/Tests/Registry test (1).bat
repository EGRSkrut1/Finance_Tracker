@echo off
chcp 65001 >nul

set API_URL=http://localhost:5078/api
set EMAIL=aaaaa@test.com
set USERNAME=aaaaa
set PASSWORD=1234567

echo Finance Tracker API Test (with correct port)
echo.

echo [1/4] Register %EMAIL%...
curl -s -X POST "%API_URL%/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"%EMAIL%\",\"username\":\"%USERNAME%\",\"password\":\"%PASSWORD%\"}"
echo.
echo.

echo [2/4] Login...
for /f "delims=" %%i in ('powershell -Command "& {(Invoke-RestMethod -Uri '%API_URL%/auth/login' -Method Post -ContentType 'application/json' -Body '{\"email\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}').token}"') do set TOKEN=%%i
echo Token: %TOKEN%
echo.

echo [3/4] Get profile...
powershell -Command "Invoke-RestMethod -Uri '%API_URL%/users/profile' -Headers @{Authorization='Bearer %TOKEN%'}"
echo.

echo [4/4] Check API status...
powershell -Command "try { Invoke-RestMethod -Uri '%API_URL%/users/profile' -Headers @{Authorization='Bearer %TOKEN%'} -ErrorAction Stop; Write-Host 'API is working' -ForegroundColor Green } catch { Write-Host 'API error' -ForegroundColor Red }"
echo.

echo Done.
pause