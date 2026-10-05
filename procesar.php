<?php
// =========================================================================
// 1. CONFIGURACIÓN (Deberás actualizar estos datos cuando crees la BD en cPanel)
// =========================================================================
$host     = 'localhost'; 
$dbname   = 'rimoempr_rimo';      // El nombre completo de la BD
$username = 'rimoempr_admin';     // El nombre completo del usuario
$password = 'cucuruchu01'; // La contraseña real

// La URL del Webhook de Make
$makeWebhookUrl = 'https://hook.us2.make.com/w03q8lanu347n6094qv0ox5s6dm7vtht';

// =========================================================================
// 2. RECIBIR LOS DATOS DEL FORMULARIO HTML Y SEGURIDAD
// =========================================================================
// Validación del Honeypot (Anti-Spam)
$honeypot = $_POST['_honeypot'] ?? '';
if (!empty($honeypot)) {
    // Si el campo oculto tiene texto, es un bot. Detenemos la ejecución en silencio.
    die();
}

$nombre   = $_POST['nombre'] ?? '';
$telegram = $_POST['telegram'] ?? '';
$correo   = $_POST['correo'] ?? '';
$interes  = $_POST['interes'] ?? '';
$fecha    = date('c'); // Formato de fecha estándar (ISO 8601) para Make

// =========================================================================
// 3. GUARDAR EN LA BASE DE DATOS (Usando PDO para máxima seguridad)
// =========================================================================
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Las columnas deben llamarse exactamente así cuando crees la tabla en phpMyAdmin
    $sql = "INSERT INTO contactos (nombre, telegram, correo, interes) VALUES (:nombre, :telegram, :correo, :interes)";
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        ':nombre'   => $nombre,
        ':telegram' => $telegram,
        ':correo'   => $correo,
        ':interes'  => $interes
    ]);

    // =========================================================================
    // 4. ENVIAR A MAKE MEDIANTE WEBHOOK (Usando cURL)
    // =========================================================================
    $datosParaMake = json_encode([
        'nombre'   => $nombre,
        'telegram' => $telegram,
        'correo'   => $correo,
        'interes'  => $interes,
        'fecha'    => $fecha,
        'origen'   => 'RIMO Landing Page'
    ]);

    $ch = curl_init($makeWebhookUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $datosParaMake);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $respuestaMake = curl_exec($ch);
    curl_close($ch);

    // =========================================================================
    // 5. REDIRIGIR AL USUARIO
    // =========================================================================
    // Redirige de vuelta al index.html agregando el parámetro de éxito
    header("Location: index.html?estado=enviado#rimo-contact-form");
    exit;

} catch(PDOException $e) {
    // Si hay un error, lo muestra en pantalla para facilitar la corrección
    echo "Error en la base de datos: " . $e->getMessage();
}
?>