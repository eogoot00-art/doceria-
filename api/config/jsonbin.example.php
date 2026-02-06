<?php
/**
 * Configuração do banco externo JSONBin.io (nuvem).
 * Copie para jsonbin.php e preencha com seus dados.
 *
 * 1. Crie conta grátis em https://jsonbin.io/login
 * 2. Em API Keys, copie sua Master Key
 * 3. Crie um bin: POST https://api.jsonbin.io/v3/b com body {"produtos":[],"promocoes":[]}
 *    (ou use o site) e copie o "id" do bin da resposta
 * 4. Cole abaixo e renomeie este arquivo para jsonbin.php
 */

return [
    'jsonbin_bin_id'     => 'COLE_O_ID_DO_BIN_AQUI',
    'jsonbin_master_key' => 'COLE_SUA_MASTER_KEY_AQUI',
];
