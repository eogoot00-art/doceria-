<?php
/**
 * Verifica se o PHP e o MySQL estão funcionando.
 * Abra no navegador: http://seusite.com/api/check.php
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$result = ['php' => true, 'mysql' => false, 'tabelas' => false, 'erro' => null];

$configFile = __DIR__ . '/config/config.php';
if (!file_exists($configFile)) {
    $configFile = __DIR__ . '/config/config.example.php';
}
if (!file_exists($configFile)) {
    $result['erro'] = 'Crie api/config/config.php (copie de config.example.php) e preencha o banco.';
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

$config = require $configFile;
$dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $config['db_host'], $config['db_name'], $config['db_charset']);

try {
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $result['mysql'] = true;
} catch (PDOException $e) {
    $result['erro'] = 'MySQL: ' . $e->getMessage() . ' (crie o banco "flor_chocolate" e execute sql/schema.sql)';
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'produtos'");
    $result['tabelas'] = $stmt->rowCount() > 0;
    if (!$result['tabelas']) {
        $result['erro'] = 'Tabela "produtos" não existe. No MySQL execute: sql/schema.sql';
    }
} catch (Exception $e) {
    $result['erro'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
