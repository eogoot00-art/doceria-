<?php
/**
 * API REST - Promoções (banco externo JSONBin.io)
 * GET    ?id=opcional  -> listar todas ou uma por id
 * POST   (body JSON)   -> adicionar promoção
 * PUT    ?id=obrigatório (body JSON) -> editar promoção
 * DELETE ?id=obrigatório -> excluir promoção
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

function promocaoParaApi($p, $id) {
    return [
        'id' => $id,
        'nome' => $p['nome'] ?? '',
        'badge' => $p['badge'] ?? '',
        'emoji' => $p['emoji'] ?? '🍰',
        'precoOriginal' => isset($p['precoOriginal']) ? (float) $p['precoOriginal'] : 0,
        'precoPromocao' => isset($p['precoPromocao']) ? (float) $p['precoPromocao'] : 0,
        'descricao' => $p['descricao'] ?? '',
    ];
}

function promocaoParaBin($p) {
    return [
        'nome' => $p['nome'] ?? '',
        'badge' => $p['badge'] ?? '',
        'emoji' => $p['emoji'] ?? '🍰',
        'precoOriginal' => isset($p['precoOriginal']) ? (float) $p['precoOriginal'] : 0,
        'precoPromocao' => isset($p['precoPromocao']) ? (float) $p['precoPromocao'] : 0,
        'descricao' => $p['descricao'] ?? '',
    ];
}

function validarPromocao($p) {
    return !empty($p['nome']) && isset($p['precoPromocao']) && (float)$p['precoPromocao'] > 0;
}

function carregarBin() {
    return jsonbin_load();
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
    $lista = $data['promocoes'];
    if ($id) {
        $idx = $id - 1;
        if ($idx < 0 || $idx >= count($lista)) {
            http_response_code(404);
            echo json_encode(['erro' => 'Promoção não encontrada']);
            exit;
        }
        $pr = $lista[$idx];
        $pr['precoOriginal'] = $pr['precoOriginal'] ?? $pr['preco_original'] ?? 0;
        $pr['precoPromocao'] = $pr['precoPromocao'] ?? $pr['preco_promocao'] ?? 0;
        echo json_encode(promocaoParaApi($pr, $id));
    } else {
        $out = [];
        foreach ($lista as $i => $pr) {
            $p = $pr;
            if (isset($pr['preco_original'])) { $p['precoOriginal'] = (float) $pr['preco_original']; }
            if (isset($pr['preco_promocao'])) { $p['precoPromocao'] = (float) $pr['preco_promocao']; }
            $out[] = promocaoParaApi($p, $i + 1);
        }
        echo json_encode(['promocoes' => $out]);
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
    $data = carregarBin();
    if ($data === null) {
        http_response_code(502);
        echo json_encode(['erro' => 'Banco na nuvem indisponível']);
        exit;
    }
    $data['promocoes'][] = promocaoParaBin($p);
    if (!salvarBin($data)) {
        http_response_code(502);
        echo json_encode(['erro' => 'Erro ao salvar na nuvem']);
        exit;
    }
    http_response_code(201);
    echo json_encode(['ok' => true, 'id' => count($data['promocoes'])]);
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
    $data = carregarBin();
    if ($data === null) {
        http_response_code(502);
        echo json_encode(['erro' => 'Banco na nuvem indisponível']);
        exit;
    }
    $idx = $id - 1;
    if ($idx < 0 || $idx >= count($data['promocoes'])) {
        http_response_code(404);
        echo json_encode(['erro' => 'Promoção não encontrada']);
        exit;
    }
    $data['promocoes'][$idx] = promocaoParaBin($p);
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
        echo json_encode(['erro' => 'Informe ?id= da promoção']);
        exit;
    }
    $data = carregarBin();
    if ($data === null) {
        http_response_code(502);
        echo json_encode(['erro' => 'Banco na nuvem indisponível']);
        exit;
    }
    $idx = $id - 1;
    if ($idx < 0 || $idx >= count($data['promocoes'])) {
        http_response_code(404);
        echo json_encode(['erro' => 'Promoção não encontrada']);
        exit;
    }
    array_splice($data['promocoes'], $idx, 1);
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
