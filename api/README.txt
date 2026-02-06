API Flor de Chocolate - Banco externo na nuvem (JSONBin.io)

Não usa banco no PC (sem SQLite, sem MySQL local). Produtos e promoções
ficam no JSONBin.io; qualquer alteração reflete para todos os usuários.

Requisitos:
- Servidor com PHP (XAMPP, hospedagem, etc.) para rodar a API
- Conta grátis no JSONBin.io (https://jsonbin.io)

Como configurar:
1. Crie conta em https://jsonbin.io/login
2. Em API Keys, copie sua Master Key
3. Crie um bin: no site ou POST https://api.jsonbin.io/v3/b
   com body {"produtos":[],"promocoes":[]} e header X-Master-Key.
   Copie o "id" do bin da resposta.
4. Copie api/config/jsonbin.example.php para api/config/jsonbin.php
   e preencha jsonbin_bin_id e jsonbin_master_key.
5. Coloque o site (incluindo api/) no servidor. Acesse por http.

Endpoints:
- api/dados.php  GET = carregar tudo, POST = salvar tudo (usado pelo site)
- api/produtos.php   GET/POST/PUT/DELETE por produto
- api/promocoes.php  GET/POST/PUT/DELETE por promoção

Documentação: API-DOCS.md (raiz do projeto).
