<?php
/**
 * Configuración de Base de Datos MySQL/phpMyAdmin
 * 
 * IMPORTANTE: Modificar estos valores según tu configuración local
 */

// Configuración de base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'nombre_de_tu_base_datos');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuración CORS - Permitir acceso desde el frontend
define('CORS_ORIGIN', '*'); // Cambiar a URL específica en producción

// Zona horaria
date_default_timezone_set('America/Lima');

// Manejo de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers CORS
header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Crear conexión a base de datos
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error de conexión a base de datos',
            'message' => $e->getMessage()
        ]);
        exit();
    }
}

/**
 * Enviar respuesta JSON
 */
function sendJSON($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Enviar error JSON
 */
function sendError($message, $code = 400) {
    sendJSON(['error' => $message], $code);
}
