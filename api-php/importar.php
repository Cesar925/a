<?php
/**
 * API Endpoint para Importación Masiva desde Excel
 */

require_once 'config.php';

$db = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    sendError('Método no permitido. Use POST', 405);
}

// Obtener datos del body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['tipo']) || !isset($input['registros'])) {
    sendError('Datos inválidos. Se requiere: tipo y registros', 400);
}

$tipo = $input['tipo'];
$registros = $input['registros'];

if (!in_array($tipo, ['vivo', 'beneficiado'])) {
    sendError('Tipo inválido. Use: vivo o beneficiado', 400);
}

if (!is_array($registros) || empty($registros)) {
    sendError('Array de registros vacío', 400);
}

// Determinar tabla
$tabla = $tipo === 'vivo' ? 'captura_pantalla_vivo' : 'captura_pantalla_beneficiado';

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

$insertados = 0;
$errores = [];

try {
    // Iniciar transacción
    $db->beginTransaction();
    
    foreach ($registros as $index => $registro) {
        try {
            // Construir query INSERT
            $columnas = [];
            $valores = [];
            $params = [];
            
            foreach ($campos as $campo) {
                if (isset($registro[$campo]) && $registro[$campo] !== null && $registro[$campo] !== '') {
                    $columnas[] = $campo;
                    $valores[] = ":{$campo}";
                    $params[":{$campo}"] = $registro[$campo];
                }
            }
            
            if (empty($columnas)) {
                $errores[] = [
                    'index' => $index,
                    'error' => 'Registro sin datos válidos',
                    'registro' => $registro
                ];
                continue;
            }
            
            $sql = "INSERT INTO {$tabla} (" . implode(', ', $columnas) . ") 
                    VALUES (" . implode(', ', $valores) . ")";
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $insertados++;
            
        } catch (PDOException $e) {
            $errores[] = [
                'index' => $index,
                'error' => $e->getMessage(),
                'registro' => $registro
            ];
        }
    }
    
    // Commit de la transacción
    $db->commit();
    
    sendJSON([
        'success' => true,
        'message' => "Importación completada",
        'insertados' => $insertados,
        'total' => count($registros),
        'errores' => $errores
    ]);
    
} catch (Exception $e) {
    // Rollback en caso de error
    $db->rollBack();
    sendError('Error durante la importación: ' . $e->getMessage(), 500);
}
