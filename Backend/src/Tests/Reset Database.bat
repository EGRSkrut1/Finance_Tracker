@echo off
chcp 65001 >nul
title Сброс базы данных Finance Tracker

echo   СБРОС БАЗЫ ДАННЫХ FINANCE TRACKER
echo.

set DB_NAME=finance_tracker
set DB_USER=root

echo Введи пароль от MySQL (пользователь %DB_USER%):
echo.

set /p DB_PASS=Пароль: 

echo.
echo [1/3] Проверка подключения к MySQL...
mysql -u %DB_USER% -p%DB_PASS% -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Не удалось подключиться к MySQL!
    echo.
    echo Проверь:
    echo   1. Запущен ли MySQL сервер
    echo   2. Правильный ли пароль
    echo   3. Пользователь: %DB_USER%
    echo.
    pause
    exit /b 1
)
echo [OK] Подключение установлено
echo.

echo [2/3] Удаление базы данных %DB_NAME%...
mysql -u %DB_USER% -p%DB_PASS% -e "DROP DATABASE IF EXISTS %DB_NAME%;"
if errorlevel 1 (
    echo [ОШИБКА] Не удалось удалить базу данных
    pause
    exit /b 1
)
echo [OK] База данных %DB_NAME% удалена
echo.

echo [3/3] Создание базы данных %DB_NAME%...
mysql -u %DB_USER% -p%DB_PASS% -e "CREATE DATABASE %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать базу данных
    pause
    exit /b 1
)
echo [OK] База данных %DB_NAME% создана
echo.

echo   ГОТОВО!
echo.
echo Теперь перезапусти бэкенд:
echo   1. Закрой все окна с бэкендом (Ctrl+C)
echo   2. Запусти start.bat заново
echo   3. БД создастся автоматически с таблицами
echo.

pause