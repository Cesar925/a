<?php
/**
 * API Endpoints para Filtros (Años, Meses, Zonas, etc.)
 */

require_once 'config.php';

$db = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    sendError('Método no permitido. Use GET', 405);
}

$tipo = $_GET['tipo'] ?? null; // 'vivo' o 'beneficiado'

if (!$tipo || !in_array($tipo, ['vivo', 'beneficiado'])) {
    sendError('Parámetro "tipo" requerido: vivo o beneficiado', 400);
}

// Determinar tabla
$tabla = $tipo === 'vivo' ? 'captura_pantalla_vivo' : 'captura_pantalla_beneficiado';

try {
    // Obtener años disponibles
    $stmt = $db->query("SELECT DISTINCT ano FROM {$tabla} ORDER BY ano DESC");
    $anios = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Obtener meses disponibles
    $stmt = $db->query("SELECT DISTINCT mes FROM {$tabla} ORDER BY 
        CASE mes
            WHEN 'Enero' THEN 1
            WHEN 'Febrero' THEN 2
            WHEN 'Marzo' THEN 3
            WHEN 'Abril' THEN 4
            WHEN 'Mayo' THEN 5
            WHEN 'Junio' THEN 6
            WHEN 'Julio' THEN 7
            WHEN 'Agosto' THEN 8
            WHEN 'Septiembre' THEN 9
            WHEN 'Octubre' THEN 10
            WHEN 'Noviembre' THEN 11
            WHEN 'Diciembre' THEN 12
        END");
    $meses = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Obtener tipos de proceso
    $stmt = $db->query("SELECT DISTINCT tipo_proc FROM {$tabla} WHERE tipo_proc IS NOT NULL AND tipo_proc != '' ORDER BY tipo_proc");
    $tipos_proc = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Obtener provincias
    $stmt = $db->query("SELECT DISTINCT provincia FROM {$tabla} WHERE provincia IS NOT NULL AND provincia != '' ORDER BY provincia");
    $provincias = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Obtener zonas
    $stmt = $db->query("SELECT DISTINCT zona FROM {$tabla} WHERE zona IS NOT NULL AND zona != '' ORDER BY zona");
    $zonas = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    sendJSON([
        'success' => true,
        'data' => [
            'anios' => $anios,
            'meses' => $meses,
            'tipos_proc' => $tipos_proc,
            'provincias' => $provincias,
            'zonas' => $zonas
        ]
    ]);
    
} catch (PDOException $e) {
    sendError('Error al obtener filtros: ' . $e->getMessage(), 500);
}
