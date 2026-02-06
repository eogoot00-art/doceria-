<?php
/**
 * API REST - Produtos
 * GET    ?id=opcional  -> listar todos ou um por id
 * POST   (body JSON)   -> adicionar produto
 * PUT    ?id=obrigatório (body JSON) -> editar produto
 * DELETE ?id=obrigatório -> excluir produto
 */

define('API_ROOT', __DIR__);
$pdo = require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

function produtoFromRow($row) {
    $sabores = [];
    if (!empty($row['sabores'])) {
        $s = json_decode($row['sabores'], true);
        if (is_array($s)) $sabores = $s;
    }
    return [
        'id' => (int) $row['id'],
        'nome' => $row['nome'],
        'preco' => (float) $row['preco'],
        'descricao' => $row['descricao'],
        'sabores' => $sabores,
        'personalizavel' => (bool) $row['personalizavel'],
        'imagem' => $row['imagem'] ?: null,
        'destaque' => (bool) $row['destaque'],
    ];
}

function validarProduto($p) {
    if (empty($p['nome']) || !isset($p['preco']) || (float)$p['preco'] <= 0) {
        return false;
    }
    return true;
}

// GET - Listar todos ou um por id
if ($method === 'GET') {
    try {
        if ($id) {
            $stmt = $pdo->prepare('SELECT id, nome, preco, descricao, sabores, personalizavel, imagem, destaque FROM produtos WHERE id = ?');
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) {
                http_response_code(404);
                echo json_encode(['erro' => 'Produto não encontrado']);
                exit;
            }
            echo json_encode(produtoFromRow($row));
        } else {
            $stmt = $pdo->query('SELECT id, nome, preco, descricao, sabores, personalizavel, imagem, destaque FROM produtos ORDER BY id');
            $lista = [];
            while ($row = $stmt->fetch()) {
                $lista[] = produtoFromRow($row);
            }
            echo json_encode(['produtos' => $lista]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao listar']);
    }
    exit;
}

// POST - Adicionar produto
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $p = json_decode($raw, true);
    if (!is_array($p) || !validarProduto($p)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Dados inválidos. Envie nome e preço.']);
        exit;
    }
    $sabores = isset($p['sabores']) && is_array($p['sabores']) ? json_encode($p['sabores']) : '[]';
    try {
        $stmt = $pdo->prepare('INSERT INTO produtos (nome, preco, descricao, sabores, personalizavel, imagem, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $p['nome'],
            (float) $p['preco'],
            $p['descricao'] ?? '',
            $sabores,
            !empty($p['personalizavel']) ? 1 : 0,
            $p['imagem'] ?? null,
            !empty($p['destaque']) ? 1 : 0,
        ]);
        $novoId = (int) $pdo->lastInsertId();
        http_response_code(201);
        echo json_encode(['ok' => true, 'id' => $novoId]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao adicionar']);
    }
    exit;
}

// PUT - Editar produto
if ($method === 'PUT') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['erro' => 'Informe ?id= do produto']);
        exit;
    }
    $raw = file_get_contents('php://input');
    $p = json_decode($raw, true);
    if (!is_array($p) || !validarProduto($p)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Dados inválidos']);
        exit;
    }
    $sabores = isset($p['sabores']) && is_array($p['sabores']) ? json_encode($p['sabores']) : '[]';
    try {
        $stmt = $pdo->prepare('UPDATE produtos SET nome = ?, preco = ?, descricao = ?, sabores = ?, personalizavel = ?, imagem = ?, destaque = ? WHERE id = ?');
        $stmt->execute([
            $p['nome'],
            (float) $p['preco'],
            $p['descricao'] ?? '',
            $sabores,
            !empty($p['personalizavel']) ? 1 : 0,
            $p['imagem'] ?? null,
            !empty($p['destaque']) ? 1 : 0,
            $id,
        ]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['erro' => 'Produto não encontrado']);
            exit;
        }
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao editar']);
    }
    exit;
}

// DELETE - Excluir produto
if ($method === 'DELETE') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['erro' => 'Informe ?id= do produto']);
        exit;
    }
    try {
        $stmt = $pdo->prepare('DELETE FROM produtos WHERE id = ?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['erro' => 'Produto não encontrado']);
            exit;
        }
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao excluir']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido']);
