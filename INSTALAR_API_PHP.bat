@echo off
echo ========================================
echo  INSTALACION DE API PHP
echo ========================================
echo.

REM Verificar si XAMPP esta instalado
if exist "C:\xampp\htdocs\" (
    echo [OK] XAMPP encontrado en C:\xampp
    set HTDOCS_PATH=C:\xampp\htdocs
    goto :copiar_archivos
)

REM Verificar si WAMP esta instalado
if exist "C:\wamp64\www\" (
    echo [OK] WAMP encontrado en C:\wamp64
    set HTDOCS_PATH=C:\wamp64\www
    goto :copiar_archivos
)

if exist "C:\wamp\www\" (
    echo [OK] WAMP encontrado en C:\wamp
    set HTDOCS_PATH=C:\wamp\www
    goto :copiar_archivos
)

echo [ERROR] No se encontro XAMPP ni WAMP instalado
echo.
echo Por favor instala:
echo - XAMPP: https://www.apachefriends.org/
echo   O
echo - WAMP: http://www.wampserver.com/
echo.
pause
exit /b 1

:copiar_archivos
echo.
echo Copiando archivos de API a: %HTDOCS_PATH%\api-php
echo.

REM Crear directorio api-php
if not exist "%HTDOCS_PATH%\api-php\" mkdir "%HTDOCS_PATH%\api-php"

REM Copiar todos los archivos PHP
xcopy /Y /E /I "api-php\*.*" "%HTDOCS_PATH%\api-php\"

if %errorlevel% neq 0 (
    echo [ERROR] No se pudieron copiar los archivos
    pause
    exit /b 1
)

echo.
echo [OK] Archivos copiados exitosamente!
echo.
echo ========================================
echo  PROXIMOS PASOS
echo ========================================
echo.
echo 1. Iniciar Apache y MySQL desde el panel de control de XAMPP/WAMP
echo.
echo 2. Abrir phpMyAdmin: http://localhost/phpmyadmin
echo.
echo 3. Crear nueva base de datos (Ej: sistema_captura)
echo.
echo 4. Importar las tablas SQL:
echo    - captura_pantalla_vivo
echo    - captura_pantalla_beneficiado
echo.
echo 5. Editar configuracion en:
echo    %HTDOCS_PATH%\api-php\config.php
echo.
echo 6. Probar la API en:
echo    http://localhost/api-php/test.php
echo.
pause
