<?php
/**
 * Flor de Chocolate - Banco externo (JSONBin.io na nuvem)
 *
 * Não usa banco no PC (sem SQLite, sem MySQL local).
 * GET  -> retorna { produtos: [], promocoes: [] } do JSONBin
 * POST -> grava produtos e promoções no JSONBin
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store, no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/lib/jsonbin.php';

/**
 * Garante que cada produto tenha todos os campos que o site espera (seu bin pode ter só nome e preco).
 */
function normalizarProduto($p) {
    return [
        'nome' => isset($p['nome']) ? (string) $p['nome'] : '',
        'preco' => isset($p['preco']) ? (float) $p['preco'] : 0,
        'descricao' => isset($p['descricao']) ? (string) $p['descricao'] : '',
        'sabores' => isset($p['sabores']) && is_array($p['sabores']) ? $p['sabores'] : [],
        'personalizavel' => !empty($p['personalizavel']),
        'imagem' => isset($p['imagem']) && $p['imagem'] !== '' ? $p['imagem'] : null,
        'destaque' => !empty($p['destaque']),
    ];
}

/**
 * Garante que cada promoção tenha todos os campos que o site espera.
 */
function normalizarPromocao($p) {
    return [
        'nome' => isset($p['nome']) ? (string) $p['nome'] : '',
        'badge' => isset($p['badge']) ? (string) $p['badge'] : '',
        'emoji' => isset($p['emoji']) ? (string) $p['emoji'] : '🍰',
        'precoOriginal' => isset($p['precoOriginal']) ? (float) $p['precoOriginal'] : (isset($p['preco_original']) ? (float) $p['preco_original'] : 0),
        'precoPromocao' => isset($p['precoPromocao']) ? (float) $p['precoPromocao'] : (isset($p['preco_promocao']) ? (float) $p['preco_promocao'] : 0),
        'descricao' => isset($p['descricao']) ? (string) $p['descricao'] : '',
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = jsonbin_load();
    if ($data === null) {
        http_response_code(502);
        echo json_encode(['erro' => 'Banco na nuvem indisponível. Verifique api/config/jsonbin.php (Bin ID e Master Key).']);
        exit;
    }
    $produtos = array_map('normalizarProduto', isset($data['produtos']) && is_array($data['produtos']) ? $data['produtos'] : []);
    $promocoes = array_map('normalizarPromocao', isset($data['promocoes']) && is_array($data['promocoes']) ? $data['promocoes'] : []);
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
    $ok = jsonbin_save(['produtos' => $produtos, 'promocoes' => $promocoes]);
    if (!$ok) {
        http_response_code(502);
        echo json_encode(['erro' => 'Falha ao salvar na nuvem. Verifique api/config/jsonbin.php.']);
        exit;
    }
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido']);
