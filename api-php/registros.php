<?php
/**
 * API Endpoints para Registros (Vivo y Beneficiado)
 */

require_once 'config.php';

$db = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '/';

// Parsear el path para obtener tipo de proceso
$parts = explode('/', trim($path, '/'));
$tipo = $parts[0] ?? null; // 'vivo' o 'beneficiado'

/**
 * GET /registros.php/vivo - Obtener todos los registros vivo
 * GET /registros.php/beneficiado - Obtener todos los registros beneficiado
 * GET /registros.php/vivo?filters=... - Obtener registros con filtros
 */
if ($method === 'GET') {
    
    // Determinar tabla según tipo
    $tabla = null;
    if ($tipo === 'vivo') {
        $tabla = 'captura_pantalla_vivo';
    } elseif ($tipo === 'beneficiado') {
        $tabla = 'captura_pantalla_beneficiado';
    } else {
        sendError('Tipo de proceso no válido. Use: vivo o beneficiado', 400);
    }
    
    // Construir query base
    $sql = "SELECT * FROM {$tabla} WHERE 1=1";
    $params = [];
    
    // Aplicar filtros si existen
    if (isset($_GET['filters'])) {
        $filters = json_decode($_GET['filters'], true);
        
        if (isset($filters['anio']) && $filters['anio']) {
            $sql .= " AND ano = :anio";
            $params[':anio'] = $filters['anio'];
        }
        
        if (isset($filters['mes']) && $filters['mes']) {
            $sql .= " AND mes = :mes";
            $params[':mes'] = $filters['mes'];
        }
        
        if (isset($filters['tipo_proc']) && $filters['tipo_proc']) {
            $sql .= " AND tipo_proc = :tipo_proc";
            $params[':tipo_proc'] = $filters['tipo_proc'];
        }
        
        if (isset($filters['provincia']) && $filters['provincia']) {
            $sql .= " AND provincia = :provincia";
            $params[':provincia'] = $filters['provincia'];
        }
        
        if (isset($filters['zona']) && $filters['zona']) {
            $sql .= " AND zona = :zona";
            $params[':zona'] = $filters['zona'];
        }
        
        if (isset($filters['busqueda']) && $filters['busqueda']) {
            $sql .= " AND (nombre LIKE :busqueda OR zona LIKE :busqueda)";
            $params[':busqueda'] = '%' . $filters['busqueda'] . '%';
        }
    }
    
    // Ordenar resultados
    $sql .= " ORDER BY ano DESC, mes DESC, nombre ASC";
    
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $registros = $stmt->fetchAll();
        
        sendJSON([
            'success' => true,
            'count' => count($registros),
            'data' => $registros
        ]);
    } catch (PDOException $e) {
        sendError('Error al obtener registros: ' . $e->getMessage(), 500);
    }
}

/**
 * POST /registros.php/vivo - Crear nuevo registro vivo
 * POST /registros.php/beneficiado - Crear nuevo registro beneficiado
 */
elseif ($method === 'POST') {
    
    // Determinar tabla según tipo
    $tabla = null;
    if ($tipo === 'vivo') {
        $tabla = 'captura_pantalla_vivo';
    } elseif ($tipo === 'beneficiado') {
        $tabla = 'captura_pantalla_beneficiado';
    } else {
        sendError('Tipo de proceso no válido. Use: vivo o beneficiado', 400);
    }
    
    // Obtener datos del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Datos JSON inválidos', 400);
    }
    
    // Campos comunes
    $campos_comunes = [
        'tipo_proc', 'ano', 'mes', 'provincia', 'zona', 'nombre', 'grs', 'rp'
    ];
    
    // Campos específicos de vivo
    $campos_vivo = [
        'renzo', 'fafo', 'santa_angela', 'jorge_pan', 'luis_calsin', 
        'fredi_roque', 'vidal_choque', 'gregorio', 'isaias', 'juan_carlos',
        'pot_min', 'pot_max', 'cond_min', 'cond_max', 'unidad_compra'
    ];
    
    // Campos específicos de beneficiado
    $campos_beneficiado = [
        'renzo', 'fafo', 'santa_angela', 'jorge_pan', 'luis_calsin', 
        'fredi_roque', 'vidal_choque', 'gregorio', 'isaias', 'juan_carlos',
        'santa_elena', 'granjas_chicas', 'avelino', 'peladores',
        'pot_min', 'pot_max', 'cond_min', 'cond_max', 'unidad_compra'
    ];
    
    // Seleccionar campos según tipo
    $campos = array_merge($campos_comunes, $tipo === 'vivo' ? $campos_vivo : $campos_beneficiado);
    
    // Construir query INSERT
    $columnas = [];
    $valores = [];
    $params = [];
    
    foreach ($campos as $campo) {
        if (isset($input[$campo])) {
            $columnas[] = $campo;
            $valores[] = ":{$campo}";
            $params[":{$campo}"] = $input[$campo];
        }
    }
    
    if (empty($columnas)) {
        sendError('No se proporcionaron datos válidos', 400);
    }
    
    $sql = "INSERT INTO {$tabla} (" . implode(', ', $columnas) . ") 
            VALUES (" . implode(', ', $valores) . ")";
    
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        
        sendJSON([
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'id' => $db->lastInsertId()
        ], 201);
    } catch (PDOException $e) {
        sendError('Error al crear registro: ' . $e->getMessage(), 500);
    }
}

/**
 * PUT /registros.php/vivo/123 - Actualizar registro vivo con id=123
 * PUT /registros.php/beneficiado/456 - Actualizar registro beneficiado con id=456
 */
elseif ($method === 'PUT') {
    
    // Obtener ID del registro
    $id = $parts[1] ?? null;
    
    if (!$id || !is_numeric($id)) {
        sendError('ID de registro no válido', 400);
    }
    
    // Determinar tabla según tipo
    $tabla = null;
    if ($tipo === 'vivo') {
        $tabla = 'captura_pantalla_vivo';
    } elseif ($tipo === 'beneficiado') {
        $tabla = 'captura_pantalla_beneficiado';
    } else {
        sendError('Tipo de proceso no válido. Use: vivo o beneficiado', 400);
    }
    
    // Obtener datos del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Datos JSON inválidos', 400);
    }
    
    // Campos comunes
    $campos_comunes = [
        'tipo_proc', 'ano', 'mes', 'provincia', 'zona', 'nombre', 'grs', 'rp'
    ];
    
    // Campos específicos de vivo
    $campos_vivo = [
        'renzo', 'fafo', 'santa_angela', 'jorge_pan', 'luis_calsin', 
        'fredi_roque', 'vidal_choque', 'gregorio', 'isaias', 'juan_carlos',
        'pot_min', 'pot_max', 'cond_min', 'cond_max', 'unidad_compra'
    ];
    
    // Campos específicos de beneficiado
    $campos_beneficiado = [
        'renzo', 'fafo', 'santa_angela', 'jorge_pan', 'luis_calsin', 
        'fredi_roque', 'vidal_choque', 'gregorio', 'isaias', 'juan_carlos',
        'santa_elena', 'granjas_chicas', 'avelino', 'peladores',
        'pot_min', 'pot_max', 'cond_min', 'cond_max', 'unidad_compra'
    ];
    
    // Seleccionar campos según tipo
    $campos = array_merge($campos_comunes, $tipo === 'vivo' ? $campos_vivo : $campos_beneficiado);
    
    // Construir query UPDATE
    $set = [];
    $params = [];
    
    foreach ($campos as $campo) {
        if (isset($input[$campo])) {
            $set[] = "{$campo} = :{$campo}";
            $params[":{$campo}"] = $input[$campo];
        }
    }
    
    if (empty($set)) {
        sendError('No se proporcionaron datos válidos para actualizar', 400);
    }
    
    $params[':id'] = $id;
    
    $sql = "UPDATE {$tabla} SET " . implode(', ', $set) . " WHERE id = :id";
    
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() === 0) {
            sendError('Registro no encontrado', 404);
        }
        
        sendJSON([
            'success' => true,
            'message' => 'Registro actualizado exitosamente'
        ]);
    } catch (PDOException $e) {
        sendError('Error al actualizar registro: ' . $e->getMessage(), 500);
    }
}

/**
 * DELETE /registros.php/vivo/123 - Eliminar registro vivo con id=123
 * DELETE /registros.php/beneficiado/456 - Eliminar registro beneficiado con id=456
 */
elseif ($method === 'DELETE') {
    
    // Obtener ID del registro
    $id = $parts[1] ?? null;
    
    if (!$id || !is_numeric($id)) {
        sendError('ID de registro no válido', 400);
    }
    
    // Determinar tabla según tipo
    $tabla = null;
    if ($tipo === 'vivo') {
        $tabla = 'captura_pantalla_vivo';
    } elseif ($tipo === 'beneficiado') {
        $tabla = 'captura_pantalla_beneficiado';
    } else {
        sendError('Tipo de proceso no válido. Use: vivo o beneficiado', 400);
    }
    
    $sql = "DELETE FROM {$tabla} WHERE id = :id";
    
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([':id' => $id]);
        
        if ($stmt->rowCount() === 0) {
            sendError('Registro no encontrado', 404);
        }
        
        sendJSON([
            'success' => true,
            'message' => 'Registro eliminado exitosamente'
        ]);
    } catch (PDOException $e) {
        sendError('Error al eliminar registro: ' . $e->getMessage(), 500);
    }
}

else {
    sendError('Método no permitido', 405);
}
