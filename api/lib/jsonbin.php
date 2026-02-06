<?php
/**
 * Acesso ao banco externo JSONBin.io (nuvem).
 * Usa cURL quando disponível (mais confiável que file_get_contents em HTTPS).
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

function jsonbin_request($url, $method = 'GET', $body = null) {
    $cfg = jsonbin_config();
    $key = $cfg['master_key'];
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        $headers = ['X-Master-Key: ' . $key];
        if ($method === 'PUT' || $method === 'POST') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
            $headers[] = 'Content-Type: application/json';
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $raw = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);
        if ($err !== '' || $raw === false) {
            return null;
        }
        return $raw;
    }
    $ctx = stream_context_create([
        'http' => [
            'method' => $method,
            'header' => "X-Master-Key: " . $key . "\r\n" . ($body ? "Content-Type: application/json\r\n" : ''),
            'content' => $body,
            'timeout' => 15,
            'ignore_errors' => true,
        ],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    return $raw !== false ? $raw : null;
}

function jsonbin_load() {
    $cfg = jsonbin_config();
    if (empty($cfg['bin_id']) || empty($cfg['master_key'])) {
        return ['produtos' => [], 'promocoes' => []];
    }
    $url = 'https://api.jsonbin.io/v3/b/' . $cfg['bin_id'] . '/latest?meta=false';
    $raw = jsonbin_request($url, 'GET');
    if ($raw === null) {
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
    $body = json_encode($payload);
    $raw = jsonbin_request($url, 'PUT', $body);
    if ($raw === null) {
        return false;
    }
    $res = json_decode($raw, true);
    return isset($res['record']);
}
