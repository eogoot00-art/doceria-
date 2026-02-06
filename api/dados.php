<?php
/**
 * API Flor de Chocolate - Banco de dados online (SQLite no servidor)
 *
 * Fonte única da verdade: todos os clientes recebem os mesmos produtos e promoções.
 * GET: retorna { produtos: [], promocoes: [] } do SQLite
 * POST: recebe JSON { produtos: [], promocoes: [] } e grava no SQLite (substitui tudo)
 *
 * Quando você atualiza um produto no painel admin, os dados são enviados aqui e
 * gravados no SQLite. Qualquer pessoa que acessar o site (ou já estiver com a
 * página aberta) verá as mesmas alterações.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbFile = __DIR__ . '/flor.sqlite';

function getDb() {
    global $dbFile;
    try {
        $db = new PDO('sqlite:' . $dbFile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (Exception $e) {
    }
    return null;
}

function initTables($db) {
    $db->exec("
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            preco REAL,
            descricao TEXT,
            sabores TEXT,
            personalizavel INTEGER,
            imagem TEXT,
            destaque INTEGER
        )
    ");
    $db->exec("
        CREATE TABLE IF NOT EXISTS promocoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            badge TEXT,
            emoji TEXT,
            preco_original REAL,
            preco_promocao REAL,
            descricao TEXT
        )
    ");
}

function loadProdutos($db) {
    $stmt = $db->query("SELECT id, nome, preco, descricao, sabores, personalizavel, imagem, destaque FROM produtos ORDER BY id");
    $out = [];
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $sabores = [];
        if (!empty($row[4])) {
            $s = json_decode($row[4], true);
            if (is_array($s)) $sabores = $s;
        }
        $out[] = [
            'nome' => $row[1],
            'preco' => (float)$row[2],
            'descricao' => $row[3],
            'sabores' => $sabores,
            'personalizavel' => (bool)$row[5],
            'imagem' => $row[6] ?: null,
            'destaque' => (bool)$row[7]
        ];
    }
    return $out;
}

function loadPromocoes($db) {
    $stmt = $db->query("SELECT id, nome, badge, emoji, preco_original, preco_promocao, descricao FROM promocoes ORDER BY id");
    $out = [];
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $out[] = [
            'nome' => $row[1],
            'badge' => $row[2],
            'emoji' => $row[3] ?: '🍰',
            'precoOriginal' => (float)$row[4],
            'precoPromocao' => (float)$row[5],
            'descricao' => $row[6]
        ];
    }
    return $out;
}

function saveProdutos($db, $produtos) {
    $db->exec("DELETE FROM produtos");
    if (empty($produtos)) return;
    $stmt = $db->prepare("INSERT INTO produtos (nome, preco, descricao, sabores, personalizavel, imagem, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($produtos as $p) {
        $stmt->execute([
            $p['nome'] ?? '',
            isset($p['preco']) ? (float)$p['preco'] : 0,
            $p['descricao'] ?? '',
            json_encode($p['sabores'] ?? []),
            !empty($p['personalizavel']) ? 1 : 0,
            $p['imagem'] ?? null,
            !empty($p['destaque']) ? 1 : 0
        ]);
    }
}

function savePromocoes($db, $promocoes) {
    $db->exec("DELETE FROM promocoes");
    if (empty($promocoes)) return;
    $stmt = $db->prepare("INSERT INTO promocoes (nome, badge, emoji, preco_original, preco_promocao, descricao) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($promocoes as $pr) {
        $stmt->execute([
            $pr['nome'] ?? '',
            $pr['badge'] ?? '',
            $pr['emoji'] ?? '🍰',
            isset($pr['precoOriginal']) ? (float)$pr['precoOriginal'] : 0,
            isset($pr['precoPromocao']) ? (float)$pr['precoPromocao'] : 0,
            $pr['descricao'] ?? ''
        ]);
    }
}

$db = getDb();
if (!$db) {
    http_response_code(500);
    echo json_encode(['erro' => 'Banco indisponível']);
    exit;
}

initTables($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $produtos = loadProdutos($db);
    $promocoes = loadPromocoes($db);
    echo json_encode(['produtos' => $produtos, 'promocoes' => $promocoes]);
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
        $db->beginTransaction();
        saveProdutos($db, $produtos);
        savePromocoes($db, $promocoes);
        $db->commit();
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao salvar']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido']);
