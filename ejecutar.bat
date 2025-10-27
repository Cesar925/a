@echo off
echo ========================================
echo   Sistema de Gestion - Ejecutando
echo ========================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

echo Directorio: %CD%
echo.
echo Iniciando servidor en http://localhost:8080
echo.
echo Presiona Ctrl+C para detener
echo.

npx wrangler pages dev dist --port 8080

pause
