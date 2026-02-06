<?php
/**
 * Acesso ao banco externo JSONBin.io (nuvem).
 * Sem banco local no PC.
 */

function jsonbin_config() {
    $file = __DIR__ . '/../config/jsonbin.php';
    if (!file_exists($file)) {
        $file = __DIR__ . '/../config/jsonbin.example.php';
    }
    $c = file_exists($file) ? require $file : [];
    return [
        'bin_id' => $c['jsonbin_bin_id'] ?? getenv('JSONBIN_BIN_ID') ?: '',
        'master_key' => $c['jsonbin_master_key'] ?? getenv('JSONBIN_MASTER_KEY') ?: '',
    ];
}

function jsonbin_load() {
    $cfg = jsonbin_config();
    if (empty($cfg['bin_id']) || empty($cfg['master_key'])) {
        return ['produtos' => [], 'promocoes' => []];
    }
    $url = 'https://api.jsonbin.io/v3/b/' . $cfg['bin_id'] . '/latest?meta=false';
    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "X-Master-Key: " . $cfg['master_key'] . "\r\n",
            'ignore_errors' => true,
        ],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false) {
        return null;
    }
    $data = json_decode($raw, true);
    if (!is_array($data) || isset($data['message'])) {
        return null;
    }
    return [
        'produtos' => isset($data['produtos']) && is_array($data['produtos']) ? $data['produtos'] : [],
        'promocoes' => isset($data['promocoes']) && is_array($data['promocoes']) ? $data['promocoes'] : [],
    ];
}

function jsonbin_save($data) {
    $cfg = jsonbin_config();
    if (empty($cfg['bin_id']) || empty($cfg['master_key'])) {
        return false;
    }
    $payload = [
        'produtos' => isset($data['produtos']) && is_array($data['produtos']) ? $data['produtos'] : [],
        'promocoes' => isset($data['promocoes']) && is_array($data['promocoes']) ? $data['promocoes'] : [],
    ];
    $url = 'https://api.jsonbin.io/v3/b/' . $cfg['bin_id'];
    $ctx = stream_context_create([
        'http' => [
            'method' => 'PUT',
            'header' => "Content-Type: application/json\r\nX-Master-Key: " . $cfg['master_key'] . "\r\n",
            'content' => json_encode($payload),
            'ignore_errors' => true,
        ],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false) {
        return false;
    }
    $res = json_decode($raw, true);
    return isset($res['record']);
}
