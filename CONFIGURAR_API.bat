@echo off
echo ========================================
echo  CONFIGURADOR DE API PHP
echo ========================================
echo.

REM Buscar ruta de api-php
set API_PATH=
if exist "C:\xampp\htdocs\api-php\config.php" (
    set API_PATH=C:\xampp\htdocs\api-php
)
if exist "C:\wamp64\www\api-php\config.php" (
    set API_PATH=C:\wamp64\www\api-php
)
if exist "C:\wamp\www\api-php\config.php" (
    set API_PATH=C:\wamp\www\api-php
)

if "%API_PATH%"=="" (
    echo [ERROR] No se encontro la carpeta api-php
    echo Por favor ejecuta primero: INSTALAR_API_PHP.bat
    pause
    exit /b 1
)

echo API encontrada en: %API_PATH%
echo.
echo Ingresa los datos de tu base de datos MySQL:
echo.

set /p DB_HOST="Host (localhost): "
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_NAME="Nombre de base de datos: "
if "%DB_NAME%"=="" (
    echo [ERROR] El nombre de la base de datos es obligatorio
    pause
    exit /b 1
)

set /p DB_USER="Usuario (root): "
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASS="Contraseña (dejar vacio para sin contraseña): "

echo.
echo ========================================
echo  CONFIGURACION
echo ========================================
echo Host: %DB_HOST%
echo Base de datos: %DB_NAME%
echo Usuario: %DB_USER%
echo Contraseña: %DB_PASS%
echo ========================================
echo.

set /p CONFIRMAR="¿Es correcta esta configuracion? (S/N): "
if /i not "%CONFIRMAR%"=="S" (
    echo Configuracion cancelada
    pause
    exit /b 0
)

REM Crear archivo temporal con la nueva configuración
echo ^<?php > "%API_PATH%\config.php.new"
echo /** >> "%API_PATH%\config.php.new"
echo  * Configuración de Base de Datos MySQL/phpMyAdmin >> "%API_PATH%\config.php.new"
echo  */ >> "%API_PATH%\config.php.new"
echo. >> "%API_PATH%\config.php.new"
echo // Configuración de base de datos >> "%API_PATH%\config.php.new"
echo define('DB_HOST', '%DB_HOST%'); >> "%API_PATH%\config.php.new"
echo define('DB_NAME', '%DB_NAME%'); >> "%API_PATH%\config.php.new"
echo define('DB_USER', '%DB_USER%'); >> "%API_PATH%\config.php.new"
echo define('DB_PASS', '%DB_PASS%'); >> "%API_PATH%\config.php.new"
echo define('DB_CHARSET', 'utf8mb4'); >> "%API_PATH%\config.php.new"
echo. >> "%API_PATH%\config.php.new"
echo // Configuración CORS - Permitir acceso desde el frontend >> "%API_PATH%\config.php.new"
echo define('CORS_ORIGIN', '*'); >> "%API_PATH%\config.php.new"
echo. >> "%API_PATH%\config.php.new"
echo // Zona horaria >> "%API_PATH%\config.php.new"
echo date_default_timezone_set('America/Lima'); >> "%API_PATH%\config.php.new"
echo. >> "%API_PATH%\config.php.new"
echo // Manejo de errores >> "%API_PATH%\config.php.new"
echo error_reporting(E_ALL); >> "%API_PATH%\config.php.new"
echo ini_set('display_errors', 1); >> "%API_PATH%\config.php.new"
echo. >> "%API_PATH%\config.php.new"

REM Copiar el resto del archivo config.php original
findstr /V "define('DB_HOST'" "%API_PATH%\config.php" | findstr /V "define('DB_NAME'" | findstr /V "define('DB_USER'" | findstr /V "define('DB_PASS'" | findstr /V "define('DB_CHARSET'" | findstr /V "define('CORS_ORIGIN'" | findstr /V "date_default_timezone_set" | findstr /V "error_reporting" | findstr /V "ini_set('display_errors'" | findstr /V "^<?php" | findstr /V "Configuración de Base" | findstr /V "Configuración CORS" | findstr /V "Zona horaria" | findstr /V "Manejo de errores" | findstr /V "/\*\*" | findstr /V "\*/" >> "%API_PATH%\config.php.new"

REM Hacer backup del original
copy "%API_PATH%\config.php" "%API_PATH%\config.php.backup"

REM Reemplazar con el nuevo
move /Y "%API_PATH%\config.php.new" "%API_PATH%\config.php"

echo.
echo [OK] Configuracion guardada exitosamente!
echo [OK] Backup creado: config.php.backup
echo.
echo Abriendo navegador para probar la conexion...
timeout /t 2 /nobreak >nul
start http://localhost/api-php/test.php
echo.
pause
