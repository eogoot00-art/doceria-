<?php
/**
 * Conexão segura com o banco MySQL.
 * Use config.php (copie de config.example.php) com suas credenciais.
 */

if (!defined('API_ROOT')) {
    define('API_ROOT', dirname(__DIR__));
}

$configFile = API_ROOT . '/config/config.php';
if (!file_exists($configFile)) {
    $configFile = API_ROOT . '/config/config.example.php';
}

$config = file_exists($configFile) ? require $configFile : [
    'db_host' => getenv('DB_HOST') ?: 'localhost',
    'db_name' => getenv('DB_NAME') ?: 'flor_chocolate',
    'db_user' => getenv('DB_USER') ?: '',
    'db_pass' => getenv('DB_PASS') ?: '',
    'db_charset' => getenv('DB_CHARSET') ?: 'utf8mb4',
];

$dsn = sprintf(
    'mysql:host=%s;dbname=%s;charset=%s',
    $config['db_host'],
    $config['db_name'],
    $config['db_charset']
);

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], $options);
} catch (PDOException $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão com o banco. Verifique config.php.']);
    exit;
}

return $pdo;
