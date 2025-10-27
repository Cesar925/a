@echo off
echo ========================================
echo   Sistema de Gestion - Instalacion
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Descarga desde: https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js instalado

echo.
echo Instalando dependencias...
echo (Esto puede tomar 2-3 minutos)
echo.

call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR al instalar dependencias
    echo Intentando con --legacy-peer-deps...
    call npm install --legacy-peer-deps
)

if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo.
echo Compilando proyecto...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ERROR al compilar el proyecto
    pause
    exit /b 1
)

echo.
echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo Para ejecutar el proyecto:
echo   ejecutar.bat
echo.
echo O manualmente:
echo   npx wrangler pages dev dist --port 8080
echo.
pause
