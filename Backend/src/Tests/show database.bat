@echo off
chcp 65001 >nul
title Просмотр данных Finance Tracker

set DB_NAME=finance_tracker
set DB_USER=root

echo   ДАННЫЕ ИЗ БАЗЫ FINANCE TRACKER
echo.

set /p DB_PASS=Пароль MySQL: 

echo.
echo USERS 
mysql -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "SELECT * FROM users;"
echo.

echo CATEGORIES
mysql -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "SELECT * FROM categories;"
echo.

echo TRANSACTIONS
mysql -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "SELECT * FROM transactions;"
echo.

echo TRANSACTIONS WITH NAMES
mysql -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "SELECT t.Id, t.Amount, t.Description, DATE(t.Date) AS Date, t.Type, c.Name AS Category, u.username AS User FROM transactions t LEFT JOIN categories c ON t.CategoryId = c.Id LEFT JOIN users u ON t.UserId = u.id ORDER BY t.Date DESC;"
echo.

pause