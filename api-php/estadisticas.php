<?php
/**
 * API Endpoints para Estadísticas
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
    // Total de registros
    $stmt = $db->query("SELECT COUNT(*) FROM {$tabla}");
    $total_registros = $stmt->fetchColumn();
    
    // Total GRS
    $stmt = $db->query("SELECT SUM(grs) FROM {$tabla}");
    $total_grs = $stmt->fetchColumn() ?: 0;
    
    // Registros por año
    $stmt = $db->query("SELECT ano, COUNT(*) as cantidad FROM {$tabla} GROUP BY ano ORDER BY ano DESC");
    $por_anio = $stmt->fetchAll();
    
    // Registros por mes
    $stmt = $db->query("SELECT mes, COUNT(*) as cantidad FROM {$tabla} GROUP BY mes ORDER BY 
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
    $por_mes = $stmt->fetchAll();
    
    // Registros por provincia
    $stmt = $db->query("SELECT provincia, COUNT(*) as cantidad FROM {$tabla} WHERE provincia IS NOT NULL AND provincia != '' GROUP BY provincia ORDER BY cantidad DESC");
    $por_provincia = $stmt->fetchAll();
    
    // Top 10 clientes por GRS
    $stmt = $db->query("SELECT nombre, SUM(grs) as total_grs FROM {$tabla} WHERE nombre IS NOT NULL AND nombre != '' GROUP BY nombre ORDER BY total_grs DESC LIMIT 10");
    $top_clientes = $stmt->fetchAll();
    
    sendJSON([
        'success' => true,
        'data' => [
            'total_registros' => (int)$total_registros,
            'total_grs' => (float)$total_grs,
            'por_anio' => $por_anio,
            'por_mes' => $por_mes,
            'por_provincia' => $por_provincia,
            'top_clientes' => $top_clientes
        ]
    ]);
    
} catch (PDOException $e) {
    sendError('Error al obtener estadísticas: ' . $e->getMessage(), 500);
}
