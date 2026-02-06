# API Flor de Chocolate - Documentação

Backend em PHP com banco **MySQL online**. Qualquer alteração (adicionar, editar, excluir produto) fica no banco central e reflete automaticamente para todos os usuários (site e celular).

---

## 1. Modelo do banco de dados

### Tabela `produtos`

| Coluna         | Tipo         | Descrição |
|----------------|--------------|-----------|
| id             | INT, PK, AI  | Chave primária |
| nome           | VARCHAR(255) | Nome do produto |
| preco          | DECIMAL(10,2)| Preço |
| descricao      | TEXT         | Descrição |
| sabores        | TEXT (JSON)  | Variedade de sabores: array JSON, ex. `["Chocolate","Morango"]` |
| personalizavel | TINYINT(1)   | 0 ou 1 |
| imagem         | LONGTEXT     | URL ou base64 da imagem |
| destaque       | TINYINT(1)   | 0 ou 1 (exibir em promoções) |
| created_at     | TIMESTAMP    | Criação |
| updated_at     | TIMESTAMP    | Última atualização |

### Tabela `promocoes`

| Coluna          | Tipo         | Descrição |
|-----------------|--------------|-----------|
| id              | INT, PK, AI  | Chave primária |
| nome            | VARCHAR(255) | Nome |
| badge           | VARCHAR(100) | Ex: "Promoção", "Novidade" |
| emoji           | VARCHAR(20)  | Ex: "🍰" |
| preco_original  | DECIMAL(10,2)| Preço original |
| preco_promocao  | DECIMAL(10,2)| Preço promocional |
| descricao       | TEXT         | Descrição |
| created_at      | TIMESTAMP    | |
| updated_at      | TIMESTAMP    | |

---

## 2. Script SQL para criar as tabelas

Arquivo: **`sql/schema.sql`**

No MySQL (phpMyAdmin, linha de comando ou painel da hospedagem):

1. Crie o banco: `CREATE DATABASE flor_chocolate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
2. Execute o conteúdo de `sql/schema.sql` nesse banco.

---

## 3. Conexão com o banco (PHP)

Arquivo: **`api/config/database.php`**

- Copie **`api/config/config.example.php`** para **`api/config/config.php`**.
- Preencha em `config.php`:

```php
return [
    'db_host' => 'localhost',      // ou IP do servidor MySQL
    'db_name' => 'flor_chocolate',
    'db_user' => 'seu_usuario',
    'db_pass' => 'sua_senha',
    'db_charset' => 'utf8mb4',
];
```

Ou use variáveis de ambiente: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`.

---

## 4. Endpoints da API REST

Base URL: `https://seusite.com/api/` (ou `http://localhost/pasta/api/`)

### Produtos – `produtos.php`

| Método | URL              | Descrição |
|--------|------------------|-----------|
| GET    | `produtos.php`   | Listar todos os produtos |
| GET    | `produtos.php?id=1` | Listar um produto por id |
| POST   | `produtos.php`   | Adicionar produto (body JSON) |
| PUT    | `produtos.php?id=1` | Editar produto (body JSON) |
| DELETE | `produtos.php?id=1` | Excluir produto |

### Promoções – `promocoes.php`

| Método | URL                | Descrição |
|--------|--------------------|-----------|
| GET    | `promocoes.php`    | Listar todas |
| GET    | `promocoes.php?id=1` | Listar uma por id |
| POST   | `promocoes.php`    | Adicionar |
| PUT    | `promocoes.php?id=1` | Editar |
| DELETE | `promocoes.php?id=1` | Excluir |

### Endpoint único (frontend atual) – `dados.php`

| Método | URL        | Descrição |
|--------|------------|-----------|
| GET    | `dados.php`| Retorna `{ produtos: [], promocoes: [] }` do MySQL |
| POST   | `dados.php`| Recebe `{ produtos: [], promocoes: [] }` e grava tudo no MySQL |

---

## 5. Exemplos de resposta JSON

### GET `produtos.php` (listar todos)

```json
{
  "produtos": [
    {
      "id": 1,
      "nome": "Brigadeiro",
      "preco": 3.5,
      "descricao": "Brigadeiro artesanal",
      "sabores": ["Tradicional", "Coco", "Morango"],
      "personalizavel": true,
      "imagem": null,
      "destaque": true
    }
  ]
}
```

### GET `produtos.php?id=1` (um produto)

```json
{
  "id": 1,
  "nome": "Brigadeiro",
  "preco": 3.5,
  "descricao": "Brigadeiro artesanal",
  "sabores": ["Tradicional", "Coco"],
  "personalizavel": true,
  "imagem": null,
  "destaque": true
}
```

### POST `produtos.php` (adicionar) – body

```json
{
  "nome": "Brigadeiro",
  "preco": 3.5,
  "descricao": "Brigadeiro artesanal",
  "sabores": ["Tradicional", "Morango"],
  "personalizavel": true,
  "imagem": null,
  "destaque": false
}
```

Resposta: `201` → `{ "ok": true, "id": 2 }`

### PUT `produtos.php?id=1` (editar) – body

Mesmo formato do POST (nome, preco, descricao, sabores, personalizavel, imagem, destaque).

Resposta: `200` → `{ "ok": true }`

### DELETE `produtos.php?id=1`

Resposta: `200` → `{ "ok": true }`

### GET `dados.php` (usado pelo frontend atual)

```json
{
  "produtos": [
    {
      "nome": "Brigadeiro",
      "preco": 3.5,
      "descricao": "...",
      "sabores": ["Tradicional"],
      "personalizavel": true,
      "imagem": null,
      "destaque": true
    }
  ],
  "promocoes": [
    {
      "nome": "Bolo da Vovó",
      "badge": "Promoção",
      "emoji": "🎂",
      "precoOriginal": 75,
      "precoPromocao": 67.5,
      "descricao": "..."
    }
  ]
}
```

---

## 6. Como o frontend consome a API

### Opção A – Endpoint único (como está hoje)

No `script.js` já existe algo como:

- **Carregar tudo:**  
  `fetch('api/dados.php').then(r => r.json()).then(d => { produtos = d.produtos; promocoes = d.promocoes; ... })`
- **Salvar (após adicionar/editar/excluir):**  
  `fetch('api/dados.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ produtos, promocoes }) })`

O backend passa a usar MySQL em `dados.php`; o frontend não precisa mudar. Qualquer alteração no banco reflete para todos (site e celular) na próxima leitura ou na sincronização periódica que você já tem.

### Opção B – API REST por recurso

- **Listar produtos:**  
  `GET api/produtos.php` → `{ produtos: [...] }`
- **Adicionar produto:**  
  `POST api/produtos.php` com body JSON do produto (incluindo `sabores` como array).
- **Editar produto:**  
  `PUT api/produtos.php?id=2` com body JSON do produto.
- **Excluir produto:**  
  `DELETE api/produtos.php?id=2`

O mesmo padrão vale para `api/promocoes.php`.

### Configuração da base URL

No frontend, use uma variável para a base da API, por exemplo:

```javascript
const API_BASE = 'api';  // ou 'https://seusite.com/api'
fetch(`${API_BASE}/dados.php`)   // ou `${API_BASE}/produtos.php`
```

---

## Resumo

- **Banco:** MySQL online (não SQLite local).
- **Backend:** PHP (config em `api/config/`, endpoints em `api/*.php`).
- **API REST:** `produtos.php` e `promocoes.php` (GET/POST/PUT/DELETE).
- **Compatível com o frontend atual:** `dados.php` (GET = tudo, POST = salvar tudo).
- **Variedade de sabores:** campo `sabores` em `produtos` (JSON com array de sabores).
- Qualquer alteração no banco reflete para todos os usuários ao recarregar ou na próxima sincronização do frontend.
