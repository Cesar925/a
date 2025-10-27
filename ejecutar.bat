@echo off
echo ========================================
echo   Sistema de Gestion - Ejecutando
echo ========================================
echo.
echo Iniciando servidor en http://localhost:8080
echo.
echo Presiona Ctrl+C para detener
echo.

npx wrangler pages dev dist --port 8080

pause
