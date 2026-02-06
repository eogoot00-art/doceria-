<?php
/**
 * API REST - Promoções
 * GET    ?id=opcional  -> listar todas ou uma por id
 * POST   (body JSON)   -> adicionar promoção
 * PUT    ?id=obrigatório (body JSON) -> editar promoção
 * DELETE ?id=obrigatório -> excluir promoção
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

function promocaoFromRow($row) {
    return [
        'id' => (int) $row['id'],
        'nome' => $row['nome'],
        'badge' => $row['badge'] ?? '',
        'emoji' => $row['emoji'] ?? '🍰',
        'precoOriginal' => (float) $row['preco_original'],
        'precoPromocao' => (float) $row['preco_promocao'],
        'descricao' => $row['descricao'] ?? '',
    ];
}

function validarPromocao($p) {
    if (empty($p['nome']) || !isset($p['precoPromocao']) || (float)$p['precoPromocao'] <= 0) {
        return false;
    }
    return true;
}

if ($method === 'GET') {
    try {
        if ($id) {
            $stmt = $pdo->prepare('SELECT id, nome, badge, emoji, preco_original, preco_promocao, descricao FROM promocoes WHERE id = ?');
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) {
                http_response_code(404);
                echo json_encode(['erro' => 'Promoção não encontrada']);
                exit;
            }
            echo json_encode(promocaoFromRow($row));
        } else {
            $stmt = $pdo->query('SELECT id, nome, badge, emoji, preco_original, preco_promocao, descricao FROM promocoes ORDER BY id');
            $lista = [];
            while ($row = $stmt->fetch()) {
                $lista[] = promocaoFromRow($row);
            }
            echo json_encode(['promocoes' => $lista]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao listar']);
    }
    exit;
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $p = json_decode($raw, true);
    if (!is_array($p) || !validarPromocao($p)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Dados inválidos. Envie nome e preço promocional.']);
        exit;
    }
    try {
        $stmt = $pdo->prepare('INSERT INTO promocoes (nome, badge, emoji, preco_original, preco_promocao, descricao) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $p['nome'],
            $p['badge'] ?? '',
            $p['emoji'] ?? '🍰',
            isset($p['precoOriginal']) ? (float)$p['precoOriginal'] : 0,
            (float) $p['precoPromocao'],
            $p['descricao'] ?? '',
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

if ($method === 'PUT') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['erro' => 'Informe ?id= da promoção']);
        exit;
    }
    $raw = file_get_contents('php://input');
    $p = json_decode($raw, true);
    if (!is_array($p) || !validarPromocao($p)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Dados inválidos']);
        exit;
    }
    try {
        $stmt = $pdo->prepare('UPDATE promocoes SET nome = ?, badge = ?, emoji = ?, preco_original = ?, preco_promocao = ?, descricao = ? WHERE id = ?');
        $stmt->execute([
            $p['nome'],
            $p['badge'] ?? '',
            $p['emoji'] ?? '🍰',
            isset($p['precoOriginal']) ? (float)$p['precoOriginal'] : 0,
            (float) $p['precoPromocao'],
            $p['descricao'] ?? '',
            $id,
        ]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['erro' => 'Promoção não encontrada']);
            exit;
        }
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao editar']);
    }
    exit;
}

if ($method === 'DELETE') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['erro' => 'Informe ?id= da promoção']);
        exit;
    }
    try {
        $stmt = $pdo->prepare('DELETE FROM promocoes WHERE id = ?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['erro' => 'Promoção não encontrada']);
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
