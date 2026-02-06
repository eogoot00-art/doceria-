<?php
/**
 * API REST - Produtos (banco externo JSONBin.io)
 * GET    ?id=opcional  -> listar todos ou um por id
 * POST   (body JSON)   -> adicionar produto
 * PUT    ?id=obrigatório (body JSON) -> editar produto
 * DELETE ?id=obrigatório -> excluir produto
 */

define('API_ROOT', __DIR__);
require_once __DIR__ . '/lib/jsonbin.php';

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

function produtoParaApi($p, $id) {
    $sabores = isset($p['sabores']) && is_array($p['sabores']) ? $p['sabores'] : [];
    return [
        'id' => $id,
        'nome' => $p['nome'] ?? '',
        'preco' => isset($p['preco']) ? (float) $p['preco'] : 0,
        'descricao' => $p['descricao'] ?? '',
        'sabores' => $sabores,
        'personalizavel' => !empty($p['personalizavel']),
        'imagem' => $p['imagem'] ?? null,
        'destaque' => !empty($p['destaque']),
    ];
}

function validarProduto($p) {
    return !empty($p['nome']) && isset($p['preco']) && (float)$p['preco'] > 0;
}

function carregarBin() {
    $data = jsonbin_load();
    if ($data === null) {
        return null;
    }
    return $data;
}

function salvarBin($data) {
    return jsonbin_save($data);
}

if ($method === 'GET') {
    $data = carregarBin();
    if ($data === null) {
        http_response_code(502);
        echo json_encode(['erro' => 'Banco na nuvem indisponível']);
        exit;
    }
    $lista = $data['produtos'];
    if ($id) {
        $idx = $id - 1;
        if ($idx < 0 || $idx >= count($lista)) {
            http_response_code(404);
            echo json_encode(['erro' => 'Produto não encontrado']);
            exit;
        }
        echo json_encode(produtoParaApi($lista[$idx], $id));
    } else {
        $out = [];
        foreach ($lista as $i => $p) {
            $out[] = produtoParaApi($p, $i + 1);
        }
        echo json_encode(['produtos' => $out]);
    }
    exit;
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $p = json_decode($raw, true);
    if (!is_array($p) || !validarProduto($p)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Dados inválidos. Envie nome e preço.']);
        exit;
    }
    $data = carregarBin();
    if ($data === null) {
        http_response_code(502);
        echo json_encode(['erro' => 'Banco na nuvem indisponível']);
        exit;
    }
    $item = [
        'nome' => $p['nome'],
        'preco' => (float) $p['preco'],
        'descricao' => $p['descricao'] ?? '',
        'sabores' => isset($p['sabores']) && is_array($p['sabores']) ? $p['sabores'] : [],
        'personalizavel' => !empty($p['personalizavel']),
        'imagem' => $p['imagem'] ?? null,
        'destaque' => !empty($p['destaque']),
    ];
    $data['produtos'][] = $item;
    if (!salvarBin($data)) {
        http_response_code(502);
        echo json_encode(['erro' => 'Erro ao salvar na nuvem']);
        exit;
    }
    http_response_code(201);
    echo json_encode(['ok' => true, 'id' => count($data['produtos'])]);
    exit;
}

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
    $data = carregarBin();
    if ($data === null) {
        http_response_code(502);
        echo json_encode(['erro' => 'Banco na nuvem indisponível']);
        exit;
    }
    $idx = $id - 1;
    if ($idx < 0 || $idx >= count($data['produtos'])) {
        http_response_code(404);
        echo json_encode(['erro' => 'Produto não encontrado']);
        exit;
    }
    $data['produtos'][$idx] = [
        'nome' => $p['nome'],
        'preco' => (float) $p['preco'],
        'descricao' => $p['descricao'] ?? '',
        'sabores' => isset($p['sabores']) && is_array($p['sabores']) ? $p['sabores'] : [],
        'personalizavel' => !empty($p['personalizavel']),
        'imagem' => $p['imagem'] ?? null,
        'destaque' => !empty($p['destaque']),
    ];
    if (!salvarBin($data)) {
        http_response_code(502);
        echo json_encode(['erro' => 'Erro ao salvar na nuvem']);
        exit;
    }
    echo json_encode(['ok' => true]);
    exit;
}

if ($method === 'DELETE') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['erro' => 'Informe ?id= do produto']);
        exit;
    }
    $data = carregarBin();
    if ($data === null) {
        http_response_code(502);
        echo json_encode(['erro' => 'Banco na nuvem indisponível']);
        exit;
    }
    $idx = $id - 1;
    if ($idx < 0 || $idx >= count($data['produtos'])) {
        http_response_code(404);
        echo json_encode(['erro' => 'Produto não encontrado']);
        exit;
    }
    array_splice($data['produtos'], $idx, 1);
    if (!salvarBin($data)) {
        http_response_code(502);
        echo json_encode(['erro' => 'Erro ao salvar na nuvem']);
        exit;
    }
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido']);
