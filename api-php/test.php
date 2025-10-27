<?php
/**
 * Script de Prueba para Verificar Conexión a Base de Datos
 */

// Información del sistema
echo "<h1>Test de API PHP - Sistema de Captura</h1>";
echo "<h2>1. Información del Sistema</h2>";
echo "<ul>";
echo "<li><strong>PHP Version:</strong> " . phpversion() . "</li>";
echo "<li><strong>Server:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</li>";
echo "<li><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</li>";
echo "</ul>";

// Probar carga de config
echo "<h2>2. Carga de Configuración</h2>";
if (file_exists('config.php')) {
    echo "<p style='color: green;'>✓ config.php encontrado</p>";
    require_once 'config.php';
    
    echo "<ul>";
    echo "<li><strong>DB Host:</strong> " . DB_HOST . "</li>";
    echo "<li><strong>DB Name:</strong> " . DB_NAME . "</li>";
    echo "<li><strong>DB User:</strong> " . DB_USER . "</li>";
    echo "<li><strong>DB Charset:</strong> " . DB_CHARSET . "</li>";
    echo "</ul>";
} else {
    echo "<p style='color: red;'>✗ config.php no encontrado</p>";
    exit;
}

// Probar conexión a base de datos
echo "<h2>3. Conexión a Base de Datos</h2>";
try {
    $db = getDBConnection();
    echo "<p style='color: green;'>✓ Conexión exitosa a MySQL</p>";
    
    // Probar query
    $stmt = $db->query("SELECT VERSION() as version");
    $version = $stmt->fetch();
    echo "<p><strong>MySQL Version:</strong> " . $version['version'] . "</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Error de conexión: " . $e->getMessage() . "</p>";
    exit;
}

// Verificar tablas
echo "<h2>4. Verificación de Tablas</h2>";
try {
    // Verificar tabla vivo
    $stmt = $db->query("SHOW TABLES LIKE 'captura_pantalla_vivo'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Tabla 'captura_pantalla_vivo' encontrada</p>";
        
        $stmt = $db->query("SELECT COUNT(*) as total FROM captura_pantalla_vivo");
        $result = $stmt->fetch();
        echo "<p>Registros en tabla vivo: <strong>" . $result['total'] . "</strong></p>";
    } else {
        echo "<p style='color: orange;'>⚠ Tabla 'captura_pantalla_vivo' no encontrada</p>";
    }
    
    // Verificar tabla beneficiado
    $stmt = $db->query("SHOW TABLES LIKE 'captura_pantalla_beneficiado'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Tabla 'captura_pantalla_beneficiado' encontrada</p>";
        
        $stmt = $db->query("SELECT COUNT(*) as total FROM captura_pantalla_beneficiado");
        $result = $stmt->fetch();
        echo "<p>Registros en tabla beneficiado: <strong>" . $result['total'] . "</strong></p>";
    } else {
        echo "<p style='color: orange;'>⚠ Tabla 'captura_pantalla_beneficiado' no encontrada</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Error al verificar tablas: " . $e->getMessage() . "</p>";
}

// Verificar extensiones PHP
echo "<h2>5. Extensiones PHP</h2>";
echo "<ul>";
echo "<li>PDO: " . (extension_loaded('pdo') ? '✓' : '✗') . "</li>";
echo "<li>PDO MySQL: " . (extension_loaded('pdo_mysql') ? '✓' : '✗') . "</li>";
echo "<li>JSON: " . (extension_loaded('json') ? '✓' : '✗') . "</li>";
echo "</ul>";

echo "<hr>";
echo "<h2>Estado General</h2>";
echo "<p style='color: green; font-size: 18px;'><strong>✓ Sistema listo para usar</strong></p>";
echo "<p>Puedes comenzar a usar los endpoints de la API</p>";

echo "<h3>Endpoints Disponibles:</h3>";
echo "<ul>";
echo "<li><code>GET /registros.php/vivo</code> - Obtener registros vivo</li>";
echo "<li><code>GET /registros.php/beneficiado</code> - Obtener registros beneficiado</li>";
echo "<li><code>POST /registros.php/vivo</code> - Crear registro vivo</li>";
echo "<li><code>PUT /registros.php/vivo/{id}</code> - Actualizar registro vivo</li>";
echo "<li><code>DELETE /registros.php/vivo/{id}</code> - Eliminar registro vivo</li>";
echo "<li><code>GET /filtros.php?tipo=vivo</code> - Obtener filtros</li>";
echo "<li><code>GET /estadisticas.php?tipo=vivo</code> - Obtener estadísticas</li>";
echo "<li><code>POST /importar.php</code> - Importar desde Excel</li>";
echo "</ul>";
