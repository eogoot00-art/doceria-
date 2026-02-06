<?php
/**
 * API Flor de Chocolate - Banco central online (MySQL)
 *
 * Endpoint único para o frontend atual: carrega e salva produtos + promoções de uma vez.
 * GET  -> retorna { produtos: [], promocoes: [] } do MySQL
 * POST -> recebe JSON { produtos: [], promocoes: [] } e grava no MySQL (substitui tudo)
 *
 * Qualquer alteração no banco reflete automaticamente para todos os usuários (site e celular).
 */

define('API_ROOT', __DIR__);
$pdo = require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function loadProdutos($pdo) {
    $stmt = $pdo->query('SELECT id, nome, preco, descricao, sabores, personalizavel, imagem, destaque FROM produtos ORDER BY id');
    $out = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $sabores = [];
        if (!empty($row['sabores'])) {
            $s = json_decode($row['sabores'], true);
            if (is_array($s)) $sabores = $s;
        }
        $out[] = [
            'nome' => $row['nome'],
            'preco' => (float) $row['preco'],
            'descricao' => $row['descricao'],
            'sabores' => $sabores,
            'personalizavel' => (bool) $row['personalizavel'],
            'imagem' => $row['imagem'] ?: null,
            'destaque' => (bool) $row['destaque'],
        ];
    }
    return $out;
}

function loadPromocoes($pdo) {
    $stmt = $pdo->query('SELECT id, nome, badge, emoji, preco_original, preco_promocao, descricao FROM promocoes ORDER BY id');
    $out = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $out[] = [
            'nome' => $row['nome'],
            'badge' => $row['badge'] ?? '',
            'emoji' => $row['emoji'] ?? '🍰',
            'precoOriginal' => (float) $row['preco_original'],
            'precoPromocao' => (float) $row['preco_promocao'],
            'descricao' => $row['descricao'] ?? '',
        ];
    }
    return $out;
}

function saveProdutos($pdo, $produtos) {
    $pdo->exec('DELETE FROM produtos');
    if (empty($produtos)) return;
    $stmt = $pdo->prepare('INSERT INTO produtos (nome, preco, descricao, sabores, personalizavel, imagem, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)');
    foreach ($produtos as $p) {
        $stmt->execute([
            $p['nome'] ?? '',
            isset($p['preco']) ? (float)$p['preco'] : 0,
            $p['descricao'] ?? '',
            json_encode($p['sabores'] ?? []),
            !empty($p['personalizavel']) ? 1 : 0,
            $p['imagem'] ?? null,
            !empty($p['destaque']) ? 1 : 0,
        ]);
    }
}

function savePromocoes($pdo, $promocoes) {
    $pdo->exec('DELETE FROM promocoes');
    if (empty($promocoes)) return;
    $stmt = $pdo->prepare('INSERT INTO promocoes (nome, badge, emoji, preco_original, preco_promocao, descricao) VALUES (?, ?, ?, ?, ?, ?)');
    foreach ($promocoes as $pr) {
        $stmt->execute([
            $pr['nome'] ?? '',
            $pr['badge'] ?? '',
            $pr['emoji'] ?? '🍰',
            isset($pr['precoOriginal']) ? (float)$pr['precoOriginal'] : 0,
            isset($pr['precoPromocao']) ? (float)$pr['precoPromocao'] : 0,
            $pr['descricao'] ?? '',
        ]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $produtos = loadProdutos($pdo);
        $promocoes = loadPromocoes($pdo);
        echo json_encode(['produtos' => $produtos, 'promocoes' => $promocoes]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao carregar dados']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['erro' => 'JSON inválido']);
        exit;
    }
    $produtos = isset($data['produtos']) && is_array($data['produtos']) ? $data['produtos'] : [];
    $promocoes = isset($data['promocoes']) && is_array($data['promocoes']) ? $data['promocoes'] : [];
    try {
        $pdo->beginTransaction();
        saveProdutos($pdo, $produtos);
        savePromocoes($pdo, $promocoes);
        $pdo->commit();
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao salvar']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido']);
